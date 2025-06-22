import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { saveOnboardingData, getDetails, updateProfile } from '../controllers/profile.controller.js';

const router = Router()

router.route('/onboarding').post(verifyJWT, saveOnboardingData);
router.route('/onboarding/:profileId').put(verifyJWT, updateProfile);
router.route('/').get(verifyJWT, getDetails);

export default router