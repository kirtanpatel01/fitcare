import mongoose from "mongoose";
import { Exercise } from "../models/exercise.model.js";

export async function saveExerciseData(req, res) {
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
  
  const { payload } = req.body
  if(!payload) {
    return res.status(409).json({ error: "Payload not found!" })
  }

  try {
    console.log(payload)
    const exercise = await Exercise.create({ user: userId, ...payload })
    if(!exercise) {
      return res.status(500).json({ error: "Error while saving data!" })
    }

    return res.status(201).json({ message: "Exerecise data saved successfully." })
  } catch (error) {
    console.log("Error while saving the exercise data: ", error)
    return res.status(500).json("Error while saving the exercise data!")
  }
}
