import mongoose from "mongoose";
import { Profile } from "../models/profile.model.js";

export async function saveOnboardingData(req, res) {
  const { body, user } = req;
  try {
    if(!user) {
      return res.status(401).error(`You're not autherized to perform this action!`)
    }
    if(!mongoose.Types.ObjectId.isValid(user?._id)) {
      return res.status(400).json({ error: "Invalid mongoose id!" })
    }
  
    const userId = new mongoose.Types.ObjectId(user?._id)
    const data = {...body, user: userId }
  
    const profile = await Profile.create(data);
    if(!profile) {
      return res.status(500).json({ error: "Error while saving the profile!" })
    }
    return res.status(201).json({ message: "Data saved successfully.", profile })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Error while saving the profile!" })
  }
} 