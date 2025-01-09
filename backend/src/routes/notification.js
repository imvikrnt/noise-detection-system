import express from 'express';
import { sendMail } from '../controllers/notification.js';

const router = express.Router();

router.post("/user/sendmail",sendMail)

export default router