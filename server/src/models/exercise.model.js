import { Schema, model } from "mongoose"

const exerciseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  efficiency: Number,
  time: Number
}, { timestamps: true })

export const Exercise = model("Exercise", exerciseSchema)