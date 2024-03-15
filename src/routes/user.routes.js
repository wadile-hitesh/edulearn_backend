import { Router } from "express";
import { sendOtp } from "../controllers/user.controllers.js";

const router = Router();

router.route('/send-otp').post(sendOtp);

export default router