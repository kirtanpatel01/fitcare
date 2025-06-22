import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { saveOnboardingData } from '../controllers/profile.controller.js';

const router = Router()

router.route('/onboarding').post(verifyJWT, saveOnboardingData);

export default router