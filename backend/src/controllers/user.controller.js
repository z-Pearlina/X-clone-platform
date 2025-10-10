import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { firstName, lastName, bio } = req.body;

  const updatedData = {
    firstName,
    lastName,
    bio,
  };

  try {
    if (req.files?.profilePicture) {
      const profilePicFile = req.files.profilePicture[0];
      const uploadResponse = await uploadToCloudinary(profilePicFile.buffer, "profile_pictures");
      updatedData.profilePicture = uploadResponse.secure_url;
    }

    // CHANGE: Check for 'banner' file from req.files
    if (req.files?.banner) {
      const bannerFile = req.files.banner[0];
      const uploadResponse = await uploadToCloudinary(bannerFile.buffer, "banner_images");
      // CHANGE: Save the URL to the 'bannerImage' property to match the model
      updatedData.bannerImage = uploadResponse.secure_url;
    }
  } catch (uploadError) {
    console.error("Cloudinary upload error during profile update:", uploadError);
    return res.status(400).json({ error: "Failed to upload one or more images" });
  }

  const user = await User.findOneAndUpdate(
    { clerkId: userId },
    { $set: updatedData },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
    profilePicture: clerkUser.imageUrl || "",
  };

  const user = await User.create(userData);
  res.status(201).json({ user, message: "User created successfully" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  if (userId === targetUserId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    await User.findByIdAndUpdate(currentUser._id, { $pull: { following: targetUserId } });
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUser._id } });
  } else {
    await User.findByIdAndUpdate(currentUser._id, { $push: { following: targetUserId } });
    await User.findByIdAndUpdate(targetUserId, { $push: { followers: currentUser._id } });

    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
  });
});

export const getFollowers = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const userWithFollowers = await User.findById(user._id).populate({
    path: "followers",
    select: "firstName lastName username profilePicture",
  });
  if (!userWithFollowers) return res.status(404).json({ error: "User not found" });
  res.status(200).json(userWithFollowers.followers);
});

export const getFollowing = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const userWithFollowing = await User.findById(user._id).populate({
    path: "following",
    select: "firstName lastName username profilePicture",
  });
  if (!userWithFollowing) return res.status(404).json({ error: "User not found" });
  res.status(200).json(userWithFollowing.following);
});