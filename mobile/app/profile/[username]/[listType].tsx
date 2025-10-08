import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useFollowList } from "@/hooks/useFollowList";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/hooks/useUser";

type UserListItem = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string;
};


const UserRow = ({ user }: { user: UserListItem }) => (
  <Link href={`/profile/${user.username}`} asChild>
    <TouchableOpacity className="flex-row items-center p-4">
      <Image
        source={{ uri: user.profilePicture }}
        className="w-12 h-12 rounded-full"
      />
      <View className="ml-4">
        <Text className="font-bold text-base text-gray-900">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-gray-500">@{user.username}</Text>
      </View>
    </TouchableOpacity>
  </Link>
);

const FollowListScreen = () => {
  const router = useRouter();
  const { username, listType } = useLocalSearchParams<{
    username: string;
    listType: "followers" | "following";
  }>();

  const { user: profileUser } = useUser(username);
  const { data: users, isLoading, error } = useFollowList(username, listType);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Failed to load list.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Custom Header */}
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {profileUser?.firstName} {profileUser?.lastName}
          </Text>
          <Text className="text-sm text-gray-500">@{username}</Text>
        </View>
      </View>

      {/* Tabs for switching */}
      <View className="flex-row border-b border-gray-100">
        <Link href={`/profile/${username}/followers`} replace asChild>
          <TouchableOpacity className="flex-1 items-center py-4">
            <Text
              className={`font-semibold ${
                listType === "followers" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Followers
            </Text>
            {listType === "followers" && (
              <View className="h-1 w-16 bg-blue-500 rounded-full mt-1" />
            )}
          </TouchableOpacity>
        </Link>
        <Link href={`/profile/${username}/following`} replace asChild>
          <TouchableOpacity className="flex-1 items-center py-4">
            <Text
              className={`font-semibold ${
                listType === "following" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Following
            </Text>
            {listType === "following" && (
              <View className="h-1 w-16 bg-blue-500 rounded-full mt-1" />
            )}
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={users}
        renderItem={({ item }) => <UserRow user={item} />}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
        ListEmptyComponent={
          <View className="p-8 items-center">
            <Text className="text-gray-500">No users to display.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FollowListScreen;