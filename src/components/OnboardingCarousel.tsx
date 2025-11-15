import LoadingOverlay from "@src/components/LoadingOverlay";
import { SlideItem } from "@src/components/SlideItem";
import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
  onFinish: () => void;
  onSkip?: () => void;
};

export type CarouselItem = {
  title: string;
  body: string;
  image?: any;
  imgWidth?: number;
  imgHeight?: number;
};

const CONTENT: CarouselItem[] = [
  {
    title: "Chào mừng đến với thế giới kỷ niệm",
    body: "Đây là không gian nơi bạn có thể tự do sáng tạo, trang trí và biến những khoảng khắc đáng nhớ thành một căn phòng sống động mang dấu ấn riêng.",
    image: require("../../assets/images/welcome.png"),
    imgWidth: 320,
    imgHeight: 260,
  },
  {
    title: "Trang trí phòng theo phong cách của bạn",
    body: "Thu thập các item khác nhau trong cửa hàng bằng tiền trong game - thứ bạn có thể kiếm rất dễ dàng chỉ bằng việc điểm danh mỗi ngày.",
    image: require("../../assets/images/shop.png"),
    imgWidth: 300,
    imgHeight: 245,
  },
  {
    title: "Bạn muốn chia sẻ câu chuyện với nhiều người chơi khác?",
    body: "Hãy chuyển phòng sang chế độ Công khai để mọi người đều có thể ghé thăm, xem hình ảnh, và cảm nhận những câu chuyện mà bạn đã kể.",
    image: require("../../assets/images/public.png"),
    imgWidth: 320,
    imgHeight: 230,
  },
  {
    title: "Hay bạn muốn giữ cảm xúc cho riêng mình?",
    body: "Đừng lo, đã có chế độ Riêng tư. Đây là góc nhỏ yên tĩnh để bạn thoải mái giải tỏa cảm xúc và lưu lại những khoảnh khắc chỉ dành cho bản thân.",
    image: require("../../assets/images/private.png"),
    imgWidth: 320,
    imgHeight: 235,
  },
  {
    title: "Khám phá câu chuyện của mọi người",
    body: "Mỗi căn phòng là một câu chuyện, một cảm xúc, một góc nhìn riêng. Hãy dạo quanh và xem cách họ trang trí, cách họ kể về ký ức của mình – biết đâu bạn lại tìm được cảm hứng mới cho chính không gian của mình, thông qua chức năng Khám phá phòng.",
    image: require("../../assets/images/discovery.png"),
    imgWidth: 300,
    imgHeight: 230,
  },
  {
    title: "Biến kỷ niệm ảo thành quà thật",
    body: "Tạo Album từ những khoảnh khắc ý nghĩa, sắp xếp lại theo cách bạn muốn, và đặt in để nhận hàng tận nơi. Đây có thể là món quà dành cho bạn, hoặc dành cho người thân, bạn bè – một cuốn album đầy cảm xúc.",
    image: require("../../assets/images/album.png"),
    imgWidth: 320,
    imgHeight: 250,
  },
  {
    title: "Bạn đã sẵn sàng chưa?",
    body: "Trang trí, chia sẻ, khám phá – tất cả trong tầm tay. Hãy vào Memora và bắt đầu hành trình của bạn ngay bây giờ!",
  },
];

export default function OnboardingCarousel({
  visible,
  onFinish,
  onSkip,
}: Props) {
  // State
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const BG = require("../../assets/images/loginScreen/nen_troi.png");
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const progress = useDerivedValue(() => {
    return scrollX.value / width;
  });

  const PaginationDot = ({
    index,
    progress,
  }: {
    index: number;
    progress: SharedValue<number>;
  }) => {
    const animatedDot = useAnimatedStyle(() => {
      const scale = interpolate(
        progress.value,
        [index - 1, index, index + 1],
        [1, 1.6, 1],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        progress.value,
        [index - 1, index, index + 1],
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return <Animated.View style={[styles.dot, animatedDot]} />;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      supportedOrientations={["portrait", "landscape"]}
    >
      {loading && <LoadingOverlay />}
      <View style={StyleSheet.absoluteFill}>
        {/* Nền trời */}
        <Image
          source={BG}
          resizeMode="cover"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: [{ scale: 1 }],
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
      <View style={styles.modalWrapper}>
        {/* ScrollView + Animated */}
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {CONTENT.map((item, index) => (
            <SlideItem
              key={index}
              item={item}
              index={index}
              scrollX={scrollX}
              onFinish={onFinish}
            />
          ))}
        </Animated.ScrollView>

        {/* Pagination */}
        <View style={styles.paginationWrapper}>
          {CONTENT.map((_, index) => (
            <PaginationDot key={index} index={index} progress={progress} />
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  paginationWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 40,
    marginTop: -30,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#5C4D90",
    borderRadius: 5,
    marginHorizontal: 6,
  },
});
