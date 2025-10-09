import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
  getFollowers,
  getFollowing,
  updateProfileImage, 
  updateBannerImage, 
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

// routes for image uploads
router.put(
  "/profile-image",
  protectRoute,
  upload.single("image"),
  updateProfileImage
);
router.put(
  "/banner-image",
  protectRoute,
  upload.single("image"),
  updateBannerImage
);

export default router;