import { StyleSheet, Text, TouchableOpacity } from "react-native";

function OutlineButton({ icon, title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default OutlineButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#2F6FED",
    flexDirection: "row",
    gap: 2,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#2F6FED",
    fontSize: 12,
    fontWeight: "bold",
  },
});
