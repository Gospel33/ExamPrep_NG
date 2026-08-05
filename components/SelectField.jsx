import { useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function SelectField({children}) {
  const [selectedValue, setSelectedValue] = useState("react");
  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
      >
        {children}
      </Picker>
    </View>
  );
}
