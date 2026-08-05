import { View, Pressable } from "react-native";
import { router } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";



function BackButton({ onPress }) {
  return (
    <View style={{ top: 52 }}>
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color="#515B6E"
        />
      </Pressable>
    </View>
  );
}

export default BackButton;

// const styles = StyleSheet.create({
//   icon: {
//     marginHorizontal: 12,
//   },
// });
