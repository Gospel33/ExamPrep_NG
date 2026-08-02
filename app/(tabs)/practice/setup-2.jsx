import { StyleSheet, Text, View } from "react-native";
import BackButton from "../../../components/BackButton";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Button from "../../../components/Button";
import { router } from "expo-router";

export default function PracticeSetup2() {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={[styles.title, { top: 68}]}>Review Your Setup</Text>
      <View
        style={{
          top: 92,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Selected Subject (s)</Text>
        <View>
          <FontAwesome name="edit" size={24} color="black" />
        </View>
      </View>
      <View style={{ top: 112, paddingVertical: 8, gap: 16 }}>
        <Text style={styles.subject}>Mathematics</Text>
        <Text style={styles.subject}>Physics</Text>
        <Text style={styles.subject}>Biology</Text>
      </View>

      <View
        style={{ top: 128, marginVertical: 24, gap: 32 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons
              name="book-open"
              size={24}
              color="#1B6E45"
            />
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Number of Questions</Text>
              <Text style={styles.subject}>30 Questions</Text>
            </View>
          </View>
          <View>
            <FontAwesome name="edit" size={24} color="black" />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons name="timer" size={24} color="#1B6E45" />
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Duration</Text>
              <Text style={styles.subject}>25 Minutes</Text>
            </View>
          </View>
          <View>
            <FontAwesome name="edit" size={24} color="black" />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={24}
              color="#1B6E45"
            />
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Exam Year</Text>
              <Text style={styles.subject}>2021</Text>
            </View>
          </View>
          <View>
            <FontAwesome name="edit" size={24} color="black" />
          </View>
        </View>
      </View>

      <View style={{ top: 182 }}>
        <Button
          title={"Start practice"}
          backgroundColor="#2F6FED"
          textColor="#FFFFFC"
          onPress={() => {
            router.push("/practice/startPage");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 18,
  },
  title: {
    fontFamily: "Poppins",
    fontWeight: "semibold",
    fontSize: 16,
    color: "#020712",
  },


  subject: {
    fontFamily: "Poppins",
    fontWeight: 400,
    fontSize: 14,
    color: "#515B6E",

  },
});
