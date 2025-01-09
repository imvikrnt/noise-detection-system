import express from 'express';
import {forgotPassword, verifyEmail,newPassword,changePassword} from '../controllers/forgotPassword.js';

const router = express.Router();

router.post("/user/forgotpassword",forgotPassword);
router.post("/user/verifyemail",verifyEmail);
router.post("/user/newpassword",newPassword);
router.post("/user/changepassword",changePassword);

export default router