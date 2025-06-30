import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { saveOnboardingData, getDetails, updateProfile, getSuggestions, saveActiveDay } from '../controllers/profile.controller.js';

const router = Router()

router.route('/onboarding').post(verifyJWT, saveOnboardingData);
router.route('/onboarding/:profileId').put(verifyJWT, updateProfile);
router.route('/').get(verifyJWT, getDetails);
router.route('/suggetions').get(verifyJWT, getSuggestions);
router.route('/active').post(verifyJWT, saveActiveDay)

export default router