// src/components/ImagePreloader.tsx
import { useEffect } from "react";
import { Image } from "react-native";

type ImagePreloaderProps = {
  uri: string; // chỉ 1 url
};

const ImagePreloader = ({ uri }: ImagePreloaderProps) => {
  useEffect(() => {
    const preload = async () => {
      if (uri) {
        try {
          await Image.prefetch(uri);
          console.log("Preloaded image:", uri);
        } catch (err) {
          console.warn("Failed to preload image", err);
        }
      }
    };
    preload();
  }, [uri]);

  return null; // không render gì ra UI
};

export default ImagePreloader;
