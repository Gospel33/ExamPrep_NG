import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function TimerButton({ onPress, title, icon }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View>{icon}</View>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F0F5FE",
    borderWidth: 1,
    borderColor: "#2F6FED",
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "center",
    width: 98
  },
  buttonText: {
    color: "#2F6FED",
    fontFamily: "Poppins",
    fontWeight: "semibold",
    fontSize: 16,
  },
});
