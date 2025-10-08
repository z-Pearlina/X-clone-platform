import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api"; 

export const useUser = (username: string) => {
  const api = useApiClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    // The query key now includes the username to ensure uniqueness.
    // This way, React Query caches each user's data separately.
    queryKey: ["userProfile", username],
    queryFn: () => userApi.getUserProfile(api, username),
    select: (response) => response.data.user,
    // We only enable the query if a username is actually provided.
    enabled: !!username,
  });

  return { user, isLoading, error, refetch };
};