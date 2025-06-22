import { Schema, model } from 'mongoose'

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  age: Number,
  gender: String,
  state: String,
  city: String,
  height: Number,
  hUnit: String,
  weight: Number,
  wUnit: String,
  goal: String,
  target: Number,
  targetDays: Number,
  tUnit: String,
  activity: String,
  food: String,
  taste: [String],
  bmr: Number,
  tdee: Number,
  targetCalories: Number
}, { timestamps: true })

export const Profile = model("Profile", profileSchema)