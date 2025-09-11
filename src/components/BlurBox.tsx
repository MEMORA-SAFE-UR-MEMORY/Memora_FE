import {
  Text,
  View,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";

interface BlurBoxProps {
  h: number;
  w: number;
  title: string;
  image?: ImageSourcePropType;
  imageSize?: number;
  textSize?: number;
}

const BlurBox: React.FC<BlurBoxProps> = ({
  h,
  w,
  title,
  image,
  imageSize = 24,
  textSize,
}) => {
  return (
    <BlurView
      intensity={10}
      tint="light"
      style={[
        styles.blurContainer,
        {
          height: h,
          width: w,
        },
      ]}
    >
      {image && (
        <Image
          source={image}
          style={{
            width: imageSize,
            height: imageSize,
            resizeMode: "contain",
          }}
        />
      )}
      <Text style={{ fontWeight: 500, fontSize: textSize }}>{title}</Text>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: 161,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 0.8,
    gap: 8,
  },
});

export default BlurBox;
