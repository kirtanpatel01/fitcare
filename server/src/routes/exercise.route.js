import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { saveExerciseData } from '../controllers/exercise.controller.js'
const router = Router()

router.route("/save").post(verifyJWT, saveExerciseData)

export default router