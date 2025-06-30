import mongoose from "mongoose";
import { Calories } from "../models/calories.model.js";
import { GoogleGenAI } from "@google/genai";

export async function saveCalData(req, res) {
  const { user } = req;
  if (!user) {
    return res
      .status(401)
      .json({ error: "You're not authenticated to perform this action!" });
  }
  if (!mongoose.Types.ObjectId.isValid(user._id)) {
    return res.status(400).json({ error: "Invalid mongoose id!" });
  }
  const userId = new mongoose.Types.ObjectId(user._id);

  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ error: "Payload not given!" });
  }

  try {
    const calorie = await Calories.create({
      user: userId,
      cal: payload.calories,
      time: payload.timing,
    });

    if (!calorie) {
      return res
        .status(500)
        .json({ message: "Error while saving calorie earned data" });
    }

    return res
      .status(201)
      .json({ message: "Calorie data saved successfully.", calorie });
  } catch (error) {
    console.log("Error while saving calorie earned data!");
    return res
      .status(500)
      .json({ message: "Error while saving calorie earned data" });
  }
}

export async function getCalDataByDate(req, res) {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ error: "You're not authenticated!" });
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const calories = await Calories.find({
      user,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    if (!calories) {
      return res
        .status(404)
        .json({ error: "Calorie data not found for this user!" });
    }

    return res.status(200).json({
      message: "Calorie data fetched successfully.",
      calories,
    });
  } catch (error) {
    console.log("Error while fetching the calories: ", error);
    return res
      .status(500)
      .json({ error: "Error while fetching the calories!" });
  }
}

export async function getAllCal(req, res) {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ error: "You're not authenticated!" });
  }

  try {
    const calories = await Calories.find({ user });
    if (!calories) {
      return res
        .status(404)
        .json({ error: "Calorie data not found for this user!" });
    }

    return res.status(200).json({
      message: "All Calorie data fetched successfully.",
      calories,
    });
  } catch (error) {
    console.log("Error while fetching the calories: ", error);
    return res
      .status(500)
      .json({ error: "Error while fetching the calories!" });
  }
}

export async function getBySearch(req, res) {
  const query = req.query.query.trim() || "";
  if (!query) {
    return res.status(409).json({ error: "Query food name not provided!" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const user_profile_prompt = `
        You are an expert food data processor for an Indian food knowledge system.

        I will give you only the name of an Indian food item.

        Your job is to return a valid JSON only object with the following keys:

        {
          "name": string,                     // Same as input
          "state": string,                   // Primary state of origin; if common across India, use "all"
          "veg": boolean,                    // true for vegetarian, false for non-vegetarian
          "timing": [array],                 // When this is usually eaten: any of ["breakfast", "lunch", "dinner"]
          "calories": number,               // Estimated calories for one serving
          "quantity": number,               // Numeric quantity, converted from traditional formats
          "qtyUnit": "g" | "ml" | "sole"     // Valid units only: g, ml, sole
        }

        Rules:
        - If the item is a single piece (e.g. roti, samosa), set quantity = 1, qtyUnit = "sole"
        - If the item is a liquid (e.g. rasam, buttermilk), use ml
        - If the item is served in measurable solids (e.g. poha, biryani), use grams (g)
        - Estimate reasonable values based on typical serving
        - Return only the JSON — no explanations

        Food item: ${query}
      `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: user_profile_prompt,
    });
    const text = response?.text?.trim();

    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res
        .status(422)
        .json({ error: "Failed to extract JSON from response." });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log(parsed)
    return res.status(200).json({ message: "Food details fetched.", parsed });
  } catch (error) {
    console.log("Error while fetching food name's calorie info: ", error);
    return res
      .status(500)
      .json({ error: "Error while fetching food name's calorie info!" });
  }
}
