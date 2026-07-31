import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

function SelectedButton({ title, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
      <Ionicons name="close" size={16} color="black" />
    </TouchableOpacity>
  );
}

export default SelectedButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EDEDED",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#333333"
  },
  buttonText: {
    color: "#333333",
    fontSize: 10,
    fontWeight: 400,
  },
});
