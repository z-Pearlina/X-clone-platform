import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";

// This hook fetches either the followers or following list for a given user.
export const useFollowList = (username: string, listType: "followers" | "following") => {
  const api = useApiClient();

  const { data, isLoading, error } = useQuery({
    // The query key is unique for each user and list type.
    queryKey: ["followList", username, listType],
    
    // The query function dynamically chooses which API to call.
    queryFn: () => {
      if (listType === "followers") {
        return userApi.getFollowers(api, username);
      } else {
        return userApi.getFollowing(api, username);
      }
    },
    select: (response) => response.data,
    
    
    enabled: !!username && !!listType,
  });

  return { data, isLoading, error };
};