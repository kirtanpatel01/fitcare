import mongoose from "mongoose";
import { Calories } from "../models/calories.model.js";

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
      time: payload.timing
     })

     if(!calorie) {
      return res
        .status(500)
        .json({ message: "Error while saving calorie earned data" });
     }

     return res.status(201).json({ message: "Calorie data saved successfully.", calorie })
  } catch (error) {
    console.log("Error while saving calorie earned data!");
    return res
      .status(500)
      .json({ message: "Error while saving calorie earned data" });
  }
}

export async function getCalDataByDate(req, res) {
  const { user } = req
  if(!user) {
    return res.status(401).json({ error: "You're not authenticated!" })
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
    })
    if(!calories) {
      return res.status(404).json({ error: "Calorie data not found for this user!" })
    }

    return res.status(200).json({ 
      message: "Calorie data fetched successfully.", 
      calories 
    })
  } catch (error) {
    console.log("Error while fetching the calories: ", error)
    return res.status(500).json({ error: "Error while fetching the calories!" })
  }
}

export async function getAllCal(req, res) {
  const { user } = req
  if(!user) {
    return res.status(401).json({ error: "You're not authenticated!" })
  }

  try {
    const calories = await Calories.find({ user })
    if(!calories) {
      return res.status(404).json({ error: "Calorie data not found for this user!" })
    }

    return res.status(200).json({ 
      message: "All Calorie data fetched successfully.", 
      calories 
    })
  } catch (error) {
    console.log("Error while fetching the calories: ", error)
    return res.status(500).json({ error: "Error while fetching the calories!" })
  }
}
