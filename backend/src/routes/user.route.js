import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
  getFollowers,   
  getFollowing,
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

// profile picture and banner upload handling
router.put(
  "/profile",
  protectRoute,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateProfile
);

router.post("/follow/:targetUserId", protectRoute, followUser);

export default router;