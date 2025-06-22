import { mongoose } from 'mongoose'

export async function connectDB(url) {
  try {
    await mongoose.connect(`${url}/fitcare`).then(
      console.log("Mongodb connected")
    )
  } catch (error) {
    console.log("Error while connecting to mongodb: ", error)
  }
}