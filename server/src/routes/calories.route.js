import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { saveCalData, getCalDataByDate, getAllCal } from "../controllers/calories.controller.js";

const router = Router()

router.route("/save").post(verifyJWT, saveCalData);
router.route("/get").get(verifyJWT, getCalDataByDate);
router.route("/get-all").get(verifyJWT, getAllCal);

export default router