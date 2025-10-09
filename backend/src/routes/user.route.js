import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
  getFollowers,
  getFollowing,
  updateUserImages, 
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js"; 

const router = express.Router();

// public routes
router.get("/profile/:username", getUserProfile);
router.get("/profile/:username/followers", getFollowers);
router.get("/profile/:username/following", getFollowing);

// protected routes
router.post("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);
router.post("/follow/:targetUserId", protectRoute, followUser);


router.put(
  "/profile/image",
  protectRoute,
  upload.single("image"), 
  updateUserImages
);

export default router;