import { View, Text } from "react-native";

function Subject({ label }) {
  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2F6FED",
      }}
    >
      <Text style={{ fontFamily: "Poppins", fontWeight: 400, fontSize: 14 }}>
        {label}
      </Text>
    </View>
  );
}

export default Subject;
