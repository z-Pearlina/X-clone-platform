import { User } from "@/types";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentUser: User | null;
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
  };
  saveProfile: () => void;
  updateFormField: (field: string, value: string) => void;
  isUpdating: boolean;
  selectedProfilePic: string | null;
  selectedBanner: string | null;
  pickProfileImage: () => void;
  pickBannerImage: () => void;
}

const EditProfileModal = ({
  isVisible,
  onClose,
  currentUser,
  formData,
  saveProfile,
  updateFormField,
  isUpdating,
  selectedProfilePic,
  selectedBanner,
  pickProfileImage,
  pickBannerImage,
}: EditProfileModalProps) => {
  if (!currentUser) return null;

   const bannerSource = selectedBanner
    ? { uri: selectedBanner }
    : { uri: currentUser.bannerImage || "https://via.placeholder.com/600x200.png?text=No+Banner" };

  const profilePicSource = selectedProfilePic
    ? { uri: selectedProfilePic }
    : { uri: currentUser.profilePicture };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      {/* --- Header --- */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-blue-500 text-lg">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Edit Profile</Text>
        <TouchableOpacity onPress={saveProfile} disabled={isUpdating}>
          {isUpdating ? (
            <ActivityIndicator size="small" color="#1DA1F2" />
          ) : (
            <Text className="text-blue-500 text-lg font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-white">
        {/* --- Image Pickers --- */}
        <View>
          <ImageBackground source={bannerSource} className="w-full h-40 bg-gray-300" resizeMode="cover">
            <TouchableOpacity
              onPress={pickBannerImage}
              className="w-full h-full bg-black/30 items-center justify-center"
            >
              <Feather name="camera" size={24} color="white" />
              <Text className="text-white font-semibold mt-1">Change Banner</Text>
            </TouchableOpacity>
          </ImageBackground>

          <View className="items-center -mt-12 px-4">
            <View className="w-28 h-28 rounded-full border-4 border-white bg-gray-200">
              <Image source={profilePicSource} className="w-full h-full rounded-full" />
              <TouchableOpacity
                onPress={pickProfileImage}
                className="absolute inset-0 bg-black/30 rounded-full items-center justify-center"
              >
                <Feather name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- Text Inputs --- */}
        <View className="p-4 space-y-4 mt-4">
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
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;