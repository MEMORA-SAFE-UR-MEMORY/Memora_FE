import { useEffect } from "react";
import { Image } from "react-native";

type ImagePreloaderProps = {
  uri: string;
};

const ImagePreloader = ({ uri }: ImagePreloaderProps) => {
  useEffect(() => {
    const preload = async () => {
      if (uri) {
        try {
          await Image.prefetch(uri);
        } catch (err) {
          console.warn("Failed to preload image", err);
        }
      }
    };
    preload();
  }, [uri]);

  return null;
};

export default ImagePreloader;
