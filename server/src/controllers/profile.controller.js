import mongoose from "mongoose";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";

const activityMultipliers = {
  low: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  ultra: 1.9,
}

export async function saveOnboardingData(req, res) {
  const { body, user } = req;
  console.log(body)
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
    if(body.gender === 'male') {
      bmr = 10 * body.weight + 6.25 * body.height - 5 * body.age + 5
    } else if(body.gender === 'female') {
      bmr = 10 * body.weight + 6.25 * body.height - 5 * body.age - 161      
    }

    const tdee = bmr * activityMultipliers[body.activity]

    const weightDiff = body.target - body.weight
    const calorieChange = weightDiff * 7700
    const dailyCaloriesNeed = calorieChange / body.targetDays
    const targetCalories = tdee + dailyCaloriesNeed

    const data = { ...body, user: userId, bmr, tdee, targetCalories };

    const profile = await Profile.create(data);
    if (!profile) {
      return res.status(500).json({ error: "Error while saving the profile!" });
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { hasOnboarded: true },
    );
    
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
  if(!user) {
    return res.status(401).json({ error: "You're authenticated!" })
  }

  try {
    const profile = await Profile.findOne({ user: user._id })
    if(!profile) {
      return res.status(404).json({ error: "Profile details not found!" })
    }

    return res.status(200).json({ message: "Profile fetched successfully.", profile })
  } catch (error) {
    console.log("Error while fetching the user profile data: ", error)
    return res.status(500).json({ error: "Error while fetching the user profile data!" })
  }
}

export async function updateProfile(req, res) {
  const { profileId } = req.params
  const { body } = req

  if(!profileId) {
    return res.status(405).json("Profile id not found!")
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

    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: profileId },
      {
        ...body,
        bmr,
        tdee,
        targetCalories,
      },
      { new: true }
    )
    if(!updateProfile) {
      return res.status(500).json("Profile not found!")
    }

    return res.status(200).json({ message: "Updated successfully.", profile: updatedProfile })
  } catch (error) {
    console.log("Error while updating the user profile data: ", error)
    return res.status(500).json({ error: "Error while updating the user profile data!" })
  }
}