// mobile/hooks/useUpdateUserImages.ts

import { useApiClient, userApi } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";

export const useUpdateUserImages = (username: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { mutateAsync: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: async (type: "profile" | "banner") => {
      // 1. Ask for permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }

      // 2. Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        // 👇 This line is updated to fix the deprecation warning
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [16, 9],
        quality: 0.8, // Using a slightly higher quality
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      // 3. Prepare form data
      const image = result.assets[0];
      const formData = new FormData();
      
      // The `uri` can have different formats, let's handle it robustly
      const localUri = image.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename!);
      const imageType = match ? `image/${match[1]}` : `image`;

      // The key part for sending a file in FormData with React Native
      formData.append("image", {
        uri: localUri,
        name: filename,
        type: imageType,
      } as any);

      formData.append("type", type);

      // 4. Call the API
      await userApi.updateUserImage(api, formData);
    },
    onSuccess: () => {
      // 5. Invalidate queries to refetch data and update UI
      queryClient.invalidateQueries({ queryKey: ["user", username] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      // Log the full error for better debugging
      console.error("Image upload failed", error);
      alert("Image upload failed. Please check the console and try again.");
    },
  });

  return { uploadImage, isUploading };
};