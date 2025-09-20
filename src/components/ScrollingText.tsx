import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

interface ScrollingTextProps {
  text: string;
  threshold?: number; // Ngưỡng số ký tự để bắt đầu scroll
  style?: any; // Custom styles cho text
}

const ScrollingText = ({
  text,
  threshold = 23,
  style = {},
}: ScrollingTextProps): React.ReactElement => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const animationRef = useRef<any>(null);

  const startAnimation = React.useCallback(() => {
    // Check if text needs scrolling based on character count
    const needsScrolling = text.length > threshold;

    if (!needsScrolling || textWidth <= 0 || containerWidth <= 0) {
      return;
    }

    // Stop any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Reset to start position
    scrollAnim.setValue(0);

    const duration = Math.max(6000, text.length * 200);

    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(scrollAnim, {
          toValue: -(textWidth + 50),
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scrollAnim, {
          toValue: containerWidth + 20,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(200),
      ])
    );

    animationRef.current.start();
  }, [text, textWidth, containerWidth, threshold, scrollAnim]);

  useEffect(() => {
    // Reset animation when text changes
    if (animationRef.current) {
      animationRef.current.stop();
    }
    scrollAnim.setValue(0);

    // Start animation after measurements are complete
    const timer = setTimeout(() => {
      startAnimation();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [text, textWidth, containerWidth, startAnimation, scrollAnim]);

  const handleContainerLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const handleTextLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  return (
    <View style={styles.scrollContainer} onLayout={handleContainerLayout}>
      <Animated.View
        style={[
          styles.scrollingTextContainer,
          {
            transform: [{ translateX: scrollAnim }],
          },
        ]}
      >
        {/* Hidden text to measure real width */}
        <Text
          style={[
            styles.baseText,
            style,
            { position: "absolute", opacity: 0, zIndex: -1, width: "auto" },
          ]}
          onLayout={handleTextLayout}
        >
          {text}
        </Text>
        {/* Visible scrolling text */}
        <Text style={[styles.baseText, style]}>{text}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    overflow: "hidden",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 1000, // Large width to accommodate long text
  },
  baseText: {
    paddingHorizontal: 10,
    width: "auto",
    fontFamily: "Baloo2_medium",
  },
});

export default ScrollingText;
