import { Router } from 'express'
import { signUpUser, loginUser, logoutUser, getUser } from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/signup', signUpUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/', logoutUser)
router.get('/profile', verifyJWT, getUser)

export default router