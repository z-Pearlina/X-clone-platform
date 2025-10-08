import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { Alert } from "react-native";

export const useFollow = (username: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (targetUserId: string) => userApi.followUser(api, targetUserId),
        onSuccess: () => {
      // Invalidate the cache for the specific user profile page.
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      // Invalidate the cache for the current logged-in user's data.
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      Alert.alert("Error", error.response?.data?.error || "Failed to perform action.");
    },
  });

  return mutation;
};