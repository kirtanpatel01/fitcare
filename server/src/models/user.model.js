import { Schema, model } from 'mongoose'
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true })

userSchema.pre("save", async function(next) {
  if(this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 16)
  }
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password)
}

export const User = model("User", userSchema)