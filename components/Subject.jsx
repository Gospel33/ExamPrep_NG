import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";

import Entypo from "@expo/vector-icons/Entypo";

function Subject({ name, checked}) {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <View style={styles.subject}>
      <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
        <Checkbox
          size={8}
          color="#666666"
          style={{ borderRadius: 5 }}
          value={isChecked}
          onValueChange={() => setIsChecked(!isChecked)}
        />
        <Text style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 16, color: "#666666" }}>
          {name}
        </Text>
      </View>
      <View>
        <Entypo name="chevron-small-right" size={18} color="#333333" />
      </View>
    </View>
  );
}

export default Subject;

const styles = StyleSheet.create({
  subject: {
    marginHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6
  },
});
