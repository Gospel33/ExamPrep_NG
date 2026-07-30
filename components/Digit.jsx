import { View, TextInput } from "react-native";

function Digit({ text }) {
  return (
    <View
      style={{
        width: 55,
        height: 72,
      }}
    >
      <TextInput
        keyboardType="numeric"
        style={{
          fontFamily: "Poppins",
          fontSize: 27,
          fontWeight: "semibold",
          color: "#000000",
          borderWidth: 1,
          borderColor: "#666666",
          paddingHorizontal: 18,
          paddingVertical: 8,
          borderRadius: 11,
        }}
      />
    </View>
  );
}

export default Digit;
