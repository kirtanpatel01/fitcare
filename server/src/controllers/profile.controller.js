import mongoose from "mongoose";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai";

const activityMultipliers = {
  low: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  ultra: 1.9,
};

export async function saveOnboardingData(req, res) {
  const { body, user } = req;
  console.log(body);
  try {
    if (!user) {
      return res
        .status(401)
        .error(`You're not autherized to perform this action!`);
    }
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({ error: "Invalid mongoose id!" });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    let bmr;
    if (body.gender === "male") {
      bmr = 10 * body.weight + 6.25 * body.height - 5 * body.age + 5;
    } else if (body.gender === "female") {
      bmr = 10 * body.weight + 6.25 * body.height - 5 * body.age - 161;
    }

    const tdee = bmr * activityMultipliers[body.activity];

    const weightDiff = body.target - body.weight;
    const calorieChange = weightDiff * 7700;
    const dailyCaloriesNeed = calorieChange / body.targetDays;
    const targetCalories = tdee + dailyCaloriesNeed;

    const protien = (targetCalories * 0.2) / 4;
    const carbs = (targetCalories * 0.5) / 4;
    const fat = (targetCalories * 0.2) / 9;
    const fiber = (targetCalories / 1000) * 14;

    const data = {
      ...body,
      user: userId,
      bmr,
      tdee,
      targetCalories,
      protien,
      carbs,
      fat,
      fiber,
    };

    const profile = await Profile.create(data);
    if (!profile) {
      return res.status(500).json({ error: "Error while saving the profile!" });
    }

    await User.findOneAndUpdate({ _id: userId }, { hasOnboarded: true });

    return res
      .status(201)
      .json({ message: "Data saved successfully.", profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while saving the profile!" });
  }
}

export async function getDetails(req, res) {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ error: "You're authenticated!" });
  }

  try {
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile details not found!" });
    }

    return res
      .status(200)
      .json({ message: "Profile fetched successfully.", profile });
  } catch (error) {
    console.log("Error while fetching the user profile data: ", error);
    return res
      .status(500)
      .json({ error: "Error while fetching the user profile data!" });
  }
}

export async function updateProfile(req, res) {
  const { profileId } = req.params;
  const { body } = req;

  if (!profileId) {
    return res.status(405).json("Profile id not found!");
  }

  try {
    let bmr;
    if (body.gender === "male") {
      bmr = 10 * body.weight + 6.25 * body.height - 5 * body.age + 5;
    } else if (body.gender === "female") {
      bmr = 10 * body.weight + 6.25 * body.height - 5 * body.age - 161;
    }

    // 2. Calculate TDEE
    const activityMultipliers = {
      low: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      ultra: 1.9,
    };

    const tdee = bmr * activityMultipliers[body.activity];

    // 3. Calculate Target Calories
    const weightDiff = body.target - body.weight;
    const calorieChange = weightDiff * 7700;
    const dailyCaloriesNeed = calorieChange / body.targetDays;
    const targetCalories = tdee + dailyCaloriesNeed;

    const protien = (targetCalories * 0.2) / 4;
    const carbs = (targetCalories * 0.5) / 4;
    const fat = (targetCalories * 0.2) / 9;
    const fiber = (targetCalories / 1000) * 14;

    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: profileId },
      {
        ...body,
        bmr,
        tdee,
        targetCalories,
        protien,
        carbs,
        fat,
        fiber,
      },
      { new: true }
    );
    if (!updateProfile) {
      return res.status(500).json("Profile not found!");
    }

    return res
      .status(200)
      .json({ message: "Updated successfully.", profile: updatedProfile });
  } catch (error) {
    console.log("Error while updating the user profile data: ", error);
    return res
      .status(500)
      .json({ error: "Error while updating the user profile data!" });
  }
}

export async function getSuggestions(req, res) {
  const { user } = req;
  console.log(user);
  if (!user) {
    return res
      .status(401)
      .json({ error: "You're not authorized for this action!" });
  }

  try {
    const profile = await Profile.find({ user: user?._id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found!" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are a certified fitness and nutrition expert. Based on the following user profile, generate a structured wellness plan in strict JSON format with these sections:
  
      1. "food": an array of 4 food objects with the following keys:
        - "name": string (e.g., "Oats with almond milk and banana")
        - "state": string (from main region of origin; if "Common across India", use "all")
        - "veg": boolean (true for vegetarian, false for non-veg)
        - "timing": array of strings — subset of ["breakfast", "lunch", "dinner"] only
        - "calories": integer (approximate per item)
        - "quantity": integer (numeric quantity only)
        - "qtyUnit": one of ["g", "ml", "sole"]
  
      2. "exercise": array of 3–4 beginner-friendly exercises. Each must have:
        - "name": string
        - "type": "reps" or "duration"
        - "sets": integer
        - If "type" is "reps": include "reps_per_set" (integer)
        - If "type" is "duration": include "duration_seconds" (integer)
  
      3. "extra": an object containing:
        - "bonus_tip": string (1 practical advice for health/fitness)
        - "motivation": string (1 short motivational quote)
  
      Only output valid JSON. Do not include explanations or any extra text.
  
      User Profile:
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response?.text?.trim();

    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res
        .status(422)
        .json({ error: "Failed to extract JSON from response." });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ message: "Food details fetched.", parsed });
  } catch (error) {
    console.log("Error generating suggestions: ", error);
    return res.status(500).json({ error: "Error generating suggetions!" });
  }
}

export async function saveActiveDay(req, res) {
  const id = req.user?._id;
  const { date } = req.body;

  const userId = new mongoose.Types.ObjectId(id);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid mongoose id!" });
  }

  try {
    const user = await User.findById({_id: userId});

    if (!user.activeDays.includes(date)) {
      user.activeDays.push(date);
      await user.save();
    }

    res.status(200).json({ message: "Day marked as active" });
  } catch (error) {
    console.log("Error while updating the active days: ", error);
    return res.status(500).json("Error while updating the active days!");
  }
}
``