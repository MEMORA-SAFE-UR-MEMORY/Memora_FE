import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export const useImagePicker = (initialUri: string | null = null) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialUri);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Cần quyền truy cập thư viện ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return { selectedImage, setSelectedImage, pickImage };
};
