import { useItems } from "@src/hooks/useItems";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingCart, Gift, Star } from "lucide-react-native";
import { useThemes } from "@src/hooks/useThemes";

// Update dimensions constants
const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width;
const ITEM_HEIGHT = height;

const Christmas = () => {
  const { items, fetchItems } = useItems();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { themes, fetchThemes } = useThemes();

  useEffect(() => {
    fetchItems();
    fetchThemes();
  }, [fetchItems, fetchThemes]);

  // Lọc item có theme_id = 2 (Giáng Sinh)
  const christmasItems =
    items?.filter((item: any) => item.theme_id === 2) || [];

  const handleBuyTheme = async () => {
    console.log("object");
  };

  const renderItem = ({ item, index }: any) => (
    <View
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        marginHorizontal: (width - ITEM_WIDTH) / 2,
        borderRadius: 24,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      }}
    >
      <LinearGradient
        colors={["#FFEBEE", "#FFFFFF", "#E8F5E8"]}
        style={{
          flex: 1,
          padding: 20,
          alignItems: "center",
          justifyContent: "space-around", // Changed from space-between
        }}
      >
        {/* Header với số thứ tự */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "stretch",
            justifyContent: "space-between",
            marginBottom: 20, // Increased from 10
          }}
        ></View>

        {/* Item Image */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: 20,
            padding: 30,
            borderWidth: 3,
            borderColor: "#E53935",
          }}
        >
          <Image
            source={{ uri: item.item_image_path }}
            style={{
              width: 100, // Increased from 140
              height: 100, // Increased from 140
            }}
            resizeMode="contain"
          />
        </View>

        {/* Item Info */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: 20, // Added padding
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 24, // Increased from 20
              textAlign: "center",
              color: "#2E7D32",
              marginBottom: 12, // Increased from 8
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 16, // Increased from 14
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            Exclusive Christmas Item
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderPagination = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 30,
      }}
    >
      {christmasItems.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }}
          style={{
            width: currentIndex === index ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: currentIndex === index ? "#D32F2F" : "#FFCDD2",
            marginHorizontal: 4,
          }}
        />
      ))}
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  if (christmasItems.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF8F0" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#666" }}>
            Loading Christmas items...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "white" }}
    >
      {/* Header */}
      <LinearGradient
        colors={["#D32F2F", "#F44336"]}
        style={{
          paddingVertical: 30,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          🎅 Bộ sưu tập Giáng sinh 🎄
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
          }}
        >
          Khám phá vật phẩm chủ đề giáng sinh
        </Text>
      </LinearGradient>

      {/* Carousel */}
      <View style={{ marginTop: 30, height: ITEM_HEIGHT + 40 }}>
        {/* Added fixed height */}
        <FlatList
          ref={flatListRef}
          data={christmasItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="center"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: (width - ITEM_WIDTH) / 2,
          }}
        />
      </View>

      {/* Pagination */}
      {renderPagination()}

      {/* Purchase Section */}
      <View
        style={{
          paddingHorizontal: 30,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 24,
            borderWidth: 2,
            borderColor: "#E53935",
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Gift size={32} color="#D32F2F" />
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#D32F2F",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Trọn bộ Theme Giáng Sinh
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
                marginTop: 4,
                lineHeight: 22,
              }}
            >
              Mở khóa tất cả {christmasItems.length} items Giáng Sinh
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#2E7D32",
              }}
            >
              {themes[1].theme_price}vnd
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleBuyTheme}
            style={{
              backgroundColor: "#D32F2F",
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 24,
              elevation: 4,
              shadowColor: "#D32F2F",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }}
            activeOpacity={0.8}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart size={20} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginLeft: 8,
                }}
              >
                Mua gói chủ đề
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Christmas;
