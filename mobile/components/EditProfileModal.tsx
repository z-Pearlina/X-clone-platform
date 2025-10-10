import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { User } from "@/types";
import { useEffect, useState } from "react";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  };
  saveProfile: () => void;
  updateFormField: (field: string, value: string) => void;
  isUpdating: boolean;
  currentUser: User | null;
  handleImageSelection: (
    imageFor: "profileImage" | "bannerImage",
    onImagePicked: (localUri: string) => void
  ) => void;
  isUploadingProfileImage: boolean;
  isUploadingBannerImage: boolean;
}

const EditProfileModal = ({
  formData,
  isUpdating,
  isVisible,
  onClose,
  saveProfile,
  updateFormField,
  currentUser,
  handleImageSelection,
  isUploadingProfileImage,
  isUploadingBannerImage,
}: EditProfileModalProps) => {
  const [localProfileUri, setLocalProfileUri] = useState<string | null>(null);
  const [localBannerUri, setLocalBannerUri] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      setLocalProfileUri(null);
      setLocalBannerUri(null);
    }
  }, [isVisible]);

  const handleSave = () => {
    saveProfile();
  };

  const bannerSource = localBannerUri
    ? { uri: localBannerUri }
    : {
        uri:
          currentUser?.bannerImage ||
          "https://p1.pxfuel.com/preview/349/564/927/banner-header-grey-background.jpg",
      };

  const profileSource = localProfileUri
    ? { uri: localProfileUri }
    : { uri: currentUser?.profilePicture };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-lg text-[#1DA1F2]">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold">Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`px-4 py-1 rounded-full ${isUpdating ? "opacity-50" : ""}`}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#1DA1F2" />
          ) : (
            <Text className="text-lg font-bold text-[#1DA1F2]">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-white">
        <View className="relative mb-16">
          <Image source={bannerSource} className="w-full h-40 bg-gray-300" />
          {isUploadingBannerImage && (
            <View style={styles.imageOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleImageSelection("bannerImage", setLocalBannerUri)}
            className="absolute top-1/2 left-1/2 -translate-x-5 -translate-y-5 bg-black/50 p-3 rounded-full"
            disabled={isUploadingBannerImage}
          >
            <Feather name="camera" size={24} color="white" />
          </TouchableOpacity>

          <View className="absolute top-28 left-4 bg-white p-1 rounded-full">
            <Image source={profileSource} className="w-24 h-24 rounded-full bg-gray-300" />
            {isUploadingProfileImage && (
              <View style={[styles.imageOverlay, { borderRadius: 100 }]}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
            <TouchableOpacity
              onPress={() => handleImageSelection("profileImage", setLocalProfileUri)}
              className="absolute top-1/2 left-1/2 -translate-x-3 -translate-y-3 bg-black/50 p-2 rounded-full"
              disabled={isUploadingProfileImage}
            >
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 py-6 space-y-4">
          <View>
            <Text className="text-gray-500 text-sm mb-2">First Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.firstName}
              onChangeText={(text) => updateFormField("firstName", text)}
              placeholder="Your first name"
            />
          </View>
          <View>
            <Text className="text-gray-500 text-sm mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.lastName}
              onChangeText={(text) => updateFormField("lastName", text)}
              placeholder="Your last name"
            />
          </View>
          <View>
            <Text className="text-gray-500 text-sm mb-2">Bio</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          <View>
            <Text className="text-gray-500 text-sm mb-2">Location</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="Where are you located?"
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfileModal;