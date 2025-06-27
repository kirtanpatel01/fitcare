import { Schema, model } from "mongoose"

const caloriesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  cal: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
    enum: [ "breakfast", "lunch", "dinner" ]
  }
}, { timestamps: true })

export const Calories = model("Calories", caloriesSchema)