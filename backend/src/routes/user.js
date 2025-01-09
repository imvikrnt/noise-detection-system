import express from "express";

import { getData, notificationData } from "../controllers/user.js";

const router = express.Router();


router.post("/getdata", getData);
router.post("/getnotificationdata", notificationData);

export default router