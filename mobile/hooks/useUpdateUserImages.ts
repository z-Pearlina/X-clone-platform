import { useApiClient, userApi } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
  MediaTypeOptions,
} from "expo-image-picker";

import * as FileSystem from "expo-file-system";

export const useUpdateUserImages = (username: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { mutateAsync: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: async (type: "profile" | "banner") => {
      const permissionResult = await requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }

      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];

      const base64 = await FileSystem.readAsStringAsync(image.uri, {
        encoding: "base64",
      });
      const base64Image = `data:image/jpeg;base64,${base64}`;

      await userApi.updateUserImage(api, { type, image: base64Image });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", username] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Image upload failed", error);
      alert("Image upload failed. Please check the console and try again.");
    },
  });

  return { uploadImage, isUploading };
};