import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useApiClient } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";


interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  bio: string;
  profilePictureUri?: string;
  bannerUri?: string;
}

export const useProfile = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });
  
  const [selectedProfilePic, setSelectedProfilePic] = useState<string | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      
      const newFormData = new FormData();

      
      newFormData.append("firstName", profileData.firstName);
      newFormData.append("lastName", profileData.lastName);
      newFormData.append("bio", profileData.bio);

      
      if (profileData.profilePictureUri) {
        const uriParts = profileData.profilePictureUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        newFormData.append("profilePicture", {
          uri: profileData.profilePictureUri,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      
      if (profileData.bannerUri) {
        const uriParts = profileData.bannerUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        newFormData.append("banner", {
          uri: profileData.bannerUri,
          name: `banner.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      
      return api.put("/users/profile", newFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); 
      
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");

      
      setSelectedProfilePic(null);
      setSelectedBanner(null);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.error || "Failed to update profile");
    },
  });


  
  const handleImagePicker = async (imageType: "profilePicture" | "banner") => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission needed", "Please grant permission to access your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: imageType === "profilePicture" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (imageType === "profilePicture") {
        setSelectedProfilePic(result.assets[0].uri);
      } else {
        setSelectedBanner(result.assets[0].uri);
      }
    }
  };

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
      });
      
      setSelectedProfilePic(null);
      setSelectedBanner(null);
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  
  const saveProfile = () => {
    const profileData: ProfileUpdateData = {
      ...formData,
      profilePictureUri: selectedProfilePic || undefined,
      bannerUri: selectedBanner || undefined,
    };
    updateProfileMutation.mutate(profileData);
  };

  
  return {
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    saveProfile,
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
    
    selectedProfilePic,
    selectedBanner,
    pickProfileImage: () => handleImagePicker("profilePicture"),
    pickBannerImage: () => handleImagePicker("banner"),
    removeSelectedProfilePic: () => setSelectedProfilePic(null),
    removeSelectedBanner: () => setSelectedBanner(null),
  };
};