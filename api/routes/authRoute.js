import express from "express"
import {
  register,
  login,
  logout,
  getUser,
  refreshToken,
} from "../controllers/authContr.js";
import { verifyToken } from './../utils/verifyToken.js';

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/rtoken", refreshToken);
router.delete("/auth/logout", verifyToken, logout);
router.get("/auth/user/:id", verifyToken, getUser);

export default router
