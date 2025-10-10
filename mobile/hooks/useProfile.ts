import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";
import * as ImagePicker from "expo-image-picker";

export const useProfile = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });

  const onUpdateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["user", currentUser?.username] });
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
  };

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: typeof formData) => userApi.updateProfile(api, profileData),
    onSuccess: () => {
      onUpdateSuccess();
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.error || "Failed to update profile");
    },
  });

  const updateProfileImageMutation = useMutation({
    mutationFn: (imageData: FormData) => userApi.updateProfileImage(api, imageData),
    onSuccess: onUpdateSuccess,
    onError: () => Alert.alert("Error", "Failed to upload profile image."),
  });

  const updateBannerImageMutation = useMutation({
    mutationFn: (imageData: FormData) => userApi.updateBannerImage(api, imageData),
    onSuccess: onUpdateSuccess,
    onError: () => Alert.alert("Error", "Failed to upload banner image."),
  });

  const handleImageSelection = async (
    imageFor: "profileImage" | "bannerImage",
    onImagePicked: (localUri: string) => void
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos to do this.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: imageFor === "profileImage" ? [1, 1] : [3, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      onImagePicked(asset.uri);

      const formData = new FormData();
      formData.append(imageFor, {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `${imageFor}.jpg`,
      } as any);

      if (imageFor === "profileImage") {
        updateProfileImageMutation.mutate(formData);
      } else {
        updateBannerImageMutation.mutate(formData);
      }
    }
  };

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    saveProfile: () => updateProfileMutation.mutate(formData),
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
    handleImageSelection,
    isUploadingProfileImage: updateProfileImageMutation.isPending,
    isUploadingBannerImage: updateBannerImageMutation.isPending,
  };
};