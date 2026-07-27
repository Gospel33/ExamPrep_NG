import { View, TextInput, StyleSheet, Text, Pressable } from "react-native";
import { useState } from "react";

import Entypo from "@expo/vector-icons/Entypo";

function InputField({
  label,
  icon,
  iconName,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fieldContainer}>
        <View>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={visible ? secureTextEntry : false}
            keyboardType={keyboardType}
          />
        </View>

        <View style={{marginRight: 6}}>
          {iconName === "password" || iconName === "confirm-password" ? (
            <Pressable onPress={() => setVisible(!visible)}>
              {visible ? (
                <Entypo name="eye-with-line" size={18} color="#4f5351" />
              ) : (
                <Entypo name="eye" size={18} color="#4f5351" />
              )}
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    gap: 1,
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#76849F",
    borderRadius: 5
  },
  label: {
    fontFamily: "Poppins",
    fontWeight: 400,
    fontSize: 12,
  },
  input: {
    borderWidth: 0,
    padding: 10,
    fontSize: 18,
    width: "100%",
  },
});
