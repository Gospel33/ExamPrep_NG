import { View, Text, StyleSheet, TextInput } from "react-native";

import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import OutlineButton from "../../components/OutlineButton";
import { router } from "expo-router";

export default function PracticeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome Back Joe!</Text>
      <View style={styles.search}>
        <View>
          <TextInput placeholder="Search by keyword or question" />
        </View>
        <EvilIcons name="search" size={24} color="black" />
      </View>
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Self-Paced Practice</Text>
        <View style={styles.contentBox}>
          <View style={styles.contentItem}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <MaterialCommunityIcons
                name="timer-sand-empty"
                size={24}
                color="#fff"
              />
              <Text
                style={{
                  color: "#FFFFFC",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Start Custom Practice
              </Text>
            </View>
            <View>
              <Entypo name="chevron-small-right" size={24} color="#fff" />
            </View>
          </View>

          <View style={styles.contentDescription}>
            <Text style={styles.contentDescriptionText}>
              Customize your practice by choosing your subjects, topics,
              difficulty, and question count.
            </Text>
          </View>
        </View>

        <View style={styles.contentBottom}>
          <Text style={styles.contentBottomText}>Recommended Practice</Text>
          <View
            style={{
              marginHorizontal: 22,
              marginTop: 12,
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Text style={styles.contentBottomTitle}>
              Pure Organic Chemistry
            </Text>
            <Text style={styles.contentBottomDescription}>
              Sharpen your understanding of carbon compounds, reaction
              mechanisms, and functional groups with carefully selected Organic
              Chemistry questions tailored to your current learning needs... {`\n`}
              10mins . Chemistry
            </Text>

            <OutlineButton title={"Start"} onPress={() =>{
              router.push("./practice-setup-1")
            }}/>

            <Text style={styles.contentBottomTitle}>
              Pure Organic Chemistry
            </Text>
            <Text style={styles.contentBottomDescription}>
              Sharpen your understanding of carbon compounds, reaction
              mechanisms, and functional groups with carefully selected Organic
              Chemistry questions tailored to your current learning needs.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 18,
  },

  welcome: {
    top: 76,
    fontFamily: "Poppins",
    fontWeight: 500,
    fontSize: 16,
    color: "#020712",
  },

  search: {
    top: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FAFAFA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  content: {
    top: 120,
  },

  contentTitle: {
    fontFamily: "Poppins",
    fontWeight: 600,
    fontSize: 16,
    color: "#515B6E",
  },

  contentBox: {
    backgroundColor: "#2F6FED",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 12,
    height: 120,
  },

  contentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contentDescription: {
    marginTop: 8,
  },

  contentDescriptionText: {
    color: "#DADCE0",
    fontFamily: "Poppins",
    fontWeight: 400,
    fontSize: 12,
  },

  contentBottom: {
    marginTop: 24,
  },

  contentBottomText: {
    fontFamily: "Poppins",
    fontWeight: 600,
    fontSize: 16,
    color: "#515B6E",
  },

  contentBottomDescription: {
    fontFamily: "Poppins",
    fontWeight: 400,
    fontSize: 12,
    color: "#515B6E",
  },
});
