import BtnBorder from "@src/components/BtnBorder";
import { CarouselItem } from "@src/components/OnboardingCarousel";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export type SlideProps = {
  item: CarouselItem;
  index: number;
  scrollX: SharedValue<number>;
  onFinish: () => void;
};

export function SlideItem({ item, index, scrollX, onFinish }: SlideProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [40, 0, 40],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const isLast = !item.image;
  const isReversed = index % 2 === 1;

  return (
    <View
      style={[
        styles.page,
        { width: SCREEN_WIDTH },
        isLast && { paddingHorizontal: 150 },
      ]}
    >
      <Animated.View
        style={[
          styles.row,
          isLast && { justifyContent: "center", alignItems: "center" },
          //   !isLast && isReversed && { flexDirection: "row-reverse" },
          animatedStyles,
        ]}
      >
        {!isLast && item.image && (
          <Image
            source={item.image}
            style={{
              width: item.imgWidth,
              height: item.imgHeight,
              resizeMode: "contain",
              marginHorizontal: 10,
            }}
          />
        )}

        {/* Text content */}
        <View style={[styles.textBlock, isLast && { alignItems: "center" }]}>
          <Text style={[styles.title, isLast && { fontSize: 27 }]}>
            {item.title}
          </Text>
          <Text style={[styles.body, isLast && { fontSize: 17 }]}>
            {item.body}
          </Text>
          {isLast && (
            <View style={styles.btnContainer}>
              <BtnBorder
                text="Bắt đầu"
                colorType="purple"
                onPress={onFinish}
                width={150}
                height={50}
                fontSize={16}
              />
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  textBlock: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 23,
    marginBottom: 8,
    textAlign: "left",
    color: "#5C4D90",
    fontFamily: "Baloo2_bold",
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
    textAlign: "left",
    fontFamily: "Baloo2_medium",
  },
  btnContainer: {
    marginTop: 20,
  },
});
