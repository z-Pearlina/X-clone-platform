import PostComposer from "@/components/PostComposer";
import PostsList from "@/components/PostsList";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useUserSync } from "@/hooks/useUserSync";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router"; 
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const { refetch: refetchPosts } = usePosts();

  const { currentUser } = useCurrentUser();

  const handlePullToRefresh = async () => {
    setIsRefetching(true);
    await refetchPosts();
    setIsRefetching(false);
  };

  useUserSync();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <Link href={`/profile/${currentUser?.username}`}>
          <Image
            source={{ uri: currentUser?.profilePicture }}
            className="w-8 h-8 rounded-full"
          />
        </Link>

        <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />

        
        <Link href="/settings" asChild>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#1DA1F2" />
          </TouchableOpacity>
        </Link>
        
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handlePullToRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        <PostComposer />
        <PostsList />
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;