import { View, StyleSheet, Text, Pressable } from "react-native";
import { router } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

function Header({ title, subTitle, showAvatar = false, icon }) {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
        </Pressable>
      </View>
      {showAvatar ? <View style={styles.avatar} /> : <View style={{alignSelf: "center", top: 72}}>{icon}</View> }
      <View style={[styles.titleContainer, showAvatar ? {top: 44} : {top: 86}]}>
        <Text style={styles.caption}>{title}</Text>
        <Text style={styles.subCaption}>{subTitle}</Text>
      </View>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "column"
  },

  avatar: {
    width: 76,
    height: 76,
    top: 12,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: "100%",
  },

  titleContainer: {
    top: 24,
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },

  caption: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontStyle: "normal",
    fontSize: 24,
    color: "#333333",
  },

  subCaption: {
    fontFamily: "Poppins",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: 14,
    color: "#666666",
    textAlign: "center"
  },
});
