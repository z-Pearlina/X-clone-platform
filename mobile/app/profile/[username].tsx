import EditProfileModal from "@/components/EditProfileModal";
import PostsList from "@/components/PostsList";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProfile } from "@/hooks/useProfile";
import { Feather, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { usePosts } from "@/hooks/usePosts";
import { useFollow } from "@/hooks/useFollow";

const ProfileScreen = () => {
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user: profileUser, isLoading, refetch: refetchProfile } = useUser(username);
  const { currentUser } = useCurrentUser();
  const { mutate: followUser, isPending: isFollowingUser } = useFollow(username);

  const isFollowing = !!currentUser?.following?.includes(profileUser?._id);
  const isMyProfile = currentUser?._id === profileUser?._id;
  const insets = useSafeAreaInsets();
  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching,
  } = usePosts(username);
 
  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    selectedProfilePic,
    selectedBanner,
    pickProfileImage,
    pickBannerImage,
  } = useProfile();

  if (isLoading || !profileUser) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900">
            {profileUser.firstName} {profileUser.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">{userPosts.length} Posts</Text>
        </View>
        <TouchableOpacity onPress={() => {}} className="w-10 items-end">
          <Feather name="more-horizontal" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetchProfile();
              refetchPosts();
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              profileUser.bannerImage || 
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48 bg-gray-200"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: profileUser.profilePicture }}
              className="w-32 h-32 rounded-full border-4 border-white bg-gray-200"
            />
            {isMyProfile ? (
              <TouchableOpacity
                className="border border-gray-300 px-6 py-2 rounded-full"
                onPress={openEditModal}
              >
                <Text className="font-semibold text-gray-900">Edit profile</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`px-6 py-2 rounded-full ${
                  isFollowing ? "bg-black border border-black" : "border border-gray-300"
                }`}
                onPress={() => followUser(profileUser._id)}
                disabled={isFollowingUser}
              >
                <Text
                  className={`font-semibold ${isFollowing ? "text-white" : "text-gray-900"}`}
                >
                  {isFollowingUser ? (
                    <ActivityIndicator size="small" color={isFollowing ? "white" : "black"} />
                  ) : isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {profileUser.firstName} {profileUser.lastName}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <Text className="text-gray-500 mb-2">@{profileUser.username}</Text>
            <Text className="text-gray-900 mb-3">{profileUser.bio}</Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">{profileUser.location}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined {format(new Date(profileUser.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <Link href={`/profile/${username}/following`} asChild>
                <TouchableOpacity className="mr-6">
                  <Text className="text-gray-900">
                    <Text className="font-bold">{profileUser.following?.length || 0}</Text>
                    <Text className="text-gray-500"> Following</Text>
                  </Text>
                </TouchableOpacity>
              </Link>
              <Link href={`/profile/${username}/followers`} asChild>
                <TouchableOpacity>
                  <Text className="text-gray-900">
                    <Text className="font-bold">{profileUser.followers?.length || 0}</Text>
                    <Text className="text-gray-500"> Followers</Text>
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        <PostsList username={profileUser?.username} />
      </ScrollView>

      {/* Pass all the required props down to the EditProfileModal */}
      {isMyProfile && (
        <EditProfileModal
          isVisible={isEditModalVisible}
          onClose={closeEditModal}
          currentUser={currentUser}
          formData={formData}
          saveProfile={saveProfile}
          updateFormField={updateFormField}
          isUpdating={isUpdating}
          selectedProfilePic={selectedProfilePic}
          selectedBanner={selectedBanner}
          pickProfileImage={pickProfileImage}
          pickBannerImage={pickBannerImage}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;