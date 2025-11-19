import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { signupSchema, loginSchema } from '../utlis/validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);

router.post('/login', validate(loginSchema), login);

router.get('/me', protect, getMe);

export default router;