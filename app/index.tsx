import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BlurBox from "@src/components/BlurBox";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import LoginModal from "@src/components/LoginModal";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 320,
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <BlurBox
            h={43}
            w={259}
            title="Đăng nhập bằng Google"
            image={require("../assets/images/google-icon.png")}
            imageSize={24}
            textSize={16}
          />
        </TouchableOpacity>
        <BlurBox h={43} w={259} title="Chơi ngay" textSize={16} />
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "center",
          marginTop: 5,
        }}
      >
        <AntDesign name="copyright" size={20} color="black" />
        <Text>2025. Memora Corp. All Rights Reserved</Text>
      </View>
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
