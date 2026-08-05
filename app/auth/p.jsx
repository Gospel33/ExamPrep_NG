import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";

import { router } from "expo-router";
import SelectedButton from "../../components/SelectedButton";
import Subject from "../../components/Subject";
import Button from "../../components/Button";

function PracticeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons
              name="chevron-back-outline"
              size={16}
              color="#333333"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Poppins",
              color: "#333333",
              fontWeight: 600,
            }}
          >
            Select Subjects
          </Text>
        </View>
        <View>
          <Ionicons name="information-circle" size={20} color="#000000" />
        </View>
      </View>
      <View style={styles.searchBar}>
        <View>
          <Fontisto name="search" size={18} color="black" />
        </View>
        <View>
          <TextInput style={styles.searchField} placeholder="Search subjects" />
        </View>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.instructionText}>Selected (3)</Text>
        <Text style={styles.instructionText}>Clear all (3)</Text>
      </View>

      <View style={styles.selection}>
        <SelectedButton title={"Mathematics"} />
        <SelectedButton title={"English Language"} />
        <SelectedButton title={"Chemistry"} />
      </View>

      <View style={styles.subjects}>
        <Subject name={"Mathematics"} checked={true} />
        <Subject name={"English Language"} checked={true} />
        <Subject name={"Chemistry"} checked={true} />
        <Subject name={"Physics"} checked={false} />
        <Subject name={"Biology"} checked={false} />
        <Subject name={"Economics"} checked={false} />
      </View>

      <View style={styles.continueBtn}>
        <Button title={"Continue"} />

        <Text
          style={{
            color: "#666666",
            alignSelf: "center",
            fontSize: 12,
            fontFamily: "Poppins",
            fontWeight: 400,
            marginTop: 8
          }}
        >
          Select at least one subject to continue
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFC",
  },
  text: { fontSize: 16, color: "#6B7280" },
  header: {
    top: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 18,
  },

  searchBar: {
    top: 84,
    marginHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchField: {
    paddingHorizontal: 10,
    color: "#333333",
  },
  instruction: {
    top: 102,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 18,
  },
  instructionText: {
    color: "#666666",
    fontFamily: "Poppins",
    fontWeight: 400,
    fontSize: 14,
  },
  selection: {
    top: 120,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginHorizontal: 18,
  },
  subjects: {
    top: 134,
  },

  continueBtn: {
    top: 194,
    marginHorizontal: 18,
  },
});
