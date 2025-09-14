import { useState } from "react";
import { Text, TextInput, View } from "react-native";

const InputBox = ({ title, inside }: any) => {
  const [text, onChangeText] = useState("");

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: "300", marginLeft: 5 }}>
        {title}
      </Text>
      <TextInput
        onChangeText={onChangeText}
        value={text}
        placeholder={inside}
        keyboardType="default"
        style={{
          height: 46,
          width: 493,
          borderWidth: 1,
          paddingHorizontal: 20,
          marginTop: 6,
          borderRadius: 20,
          backgroundColor: "white",
        }}
      />
    </View>
  );
};

export default InputBox;
