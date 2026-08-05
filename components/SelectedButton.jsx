import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

function SelectedButton({ title, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
      {icon }
    </TouchableOpacity>
  );
}

export default SelectedButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#EDEDED",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#2F6FED",
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  buttonText: {
    color: "#2F6FED",
    fontSize: 10,
    fontWeight: 400,
    alignSelf: "center",
  },
});
