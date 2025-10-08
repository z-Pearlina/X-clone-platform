import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/formatters";
import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onComment: (post: Post) => void;
  isLiked?: boolean;
  currentUser: User;
}

const PostCard = ({ currentUser, onDelete, onLike, post, isLiked, onComment }: PostCardProps) => {
  if (!post.user) {
    return null;
  }

  const isOwnPost = post.user?._id === currentUser?._id;

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(post._id),
      },
    ]);
  };

  return (
    
    <View className="flex-row p-4 border-b border-gray-100 bg-white">
      
      <Link href={`/profile/${post.user.username}`} asChild>
        <TouchableOpacity>
          <Image
            source={{ uri: post.user.profilePicture || "" }}
            className="w-12 h-12 rounded-full mr-3" 
          />
        </TouchableOpacity>
      </Link>

      
      <View className="flex-1">
        
        <View className="flex-row justify-between items-center mb-1">
          
          <Link href={`/profile/${post.user.username}`} asChild>
            <TouchableOpacity className="flex-shrink">
              <View className="flex-row items-baseline">
                <Text className="font-bold text-gray-900 mr-1" numberOfLines={1}>
                  {post.user.firstName} {post.user.lastName}
                </Text>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                  @{post.user.username} · {formatDate(post.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          
          {isOwnPost && (
            <TouchableOpacity onPress={handleDelete} className="pl-4">
              <Feather name="trash" size={18} color="#657786" />
            </TouchableOpacity>
          )}
        </View>

        
        {post.content && (
          <Text className="text-gray-900 text-base leading-5 mb-3">{post.content}</Text>
        )}

        {post.image && (
          <Image
            source={{ uri: post.image }}
            className="w-full h-72 rounded-xl mb-3" 
            resizeMode="cover"
          />
        )}

        
        <View className="flex-row justify-between max-w-xs mt-2">
          <TouchableOpacity className="flex-row items-center" onPress={() => onComment(post)}>
            <Feather name="message-circle" size={18} color="#657786" />
            <Text className="text-gray-500 text-sm ml-2">
              {formatNumber(post.comments?.length || 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Feather name="repeat" size={18} color="#657786" />
            <Text className="text-gray-500 text-sm ml-2">0</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center" onPress={() => onLike(post._id)}>
            {isLiked ? (
              <AntDesign name="heart" size={18} color="#E0245E" />
            ) : (
              <Feather name="heart" size={18} color="#657786" />
            )}
            <Text className={`text-sm ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
              {formatNumber(post.likes?.length || 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Feather name="share" size={18} color="#657786" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;