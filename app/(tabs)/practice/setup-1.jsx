import { StyleSheet, Text, View } from "react-native";
import BackButton from "../../../components/BackButton";
import SelectedButton from "../../../components/SelectedButton";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import SelectField from "../../../components/SelectField";
import { Picker } from "@react-native-picker/picker";
import TimerButton from "../../../components/TimerButton";
import Button from "../../../components/Button";
import { router } from "expo-router";

export default function PracticeSetup1() {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Customize your practice </Text>
      <Text style={[styles.title, { marginTop: 28 }]}>
        1. Select the subjects you’d like to practice
      </Text>
      <View style={{ top: 82, flexWrap: "wrap", flexDirection: "row", gap: 8 }}>
        <SelectedButton title={"English"} />
        <SelectedButton title={"Chemistry"} />
        <SelectedButton title={"Physics"} />
        <SelectedButton title={"Biology"} />
        <SelectedButton
          title={"Add Another"}
          icon={<FontAwesome6 name="plus" size={18} color="#2F6FED" />}
        />
      </View>

      <View style={{ top: 108 }}>
        <Text style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 16 }}>
          2. Exam Year
        </Text>

        <View style={{ marginTop: 8 }}>
          <SelectField>
            <Picker.Item label="2021" value="2021" />
            <Picker.Item label="2022" value="2022" />
            <Picker.Item label="2023" value="2023" />
            <Picker.Item label="2024" value="2024" />
          </SelectField>
        </View>
      </View>
      <View style={{ top: 122 }}>
        <Text style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 16 }}>
          3. Number of Questions
        </Text>
        <View style={{ marginTop: 8 }}>
          <SelectField>
            <Picker.Item label="20 Questions" value="20" />
            <Picker.Item label="50 Questions" value="50" />
            <Picker.Item label="100 Questions" value="100" />
            <Picker.Item label="200 Questions" value="200" />
          </SelectField>
        </View>
      </View>

      <View style={{ top: 132 }}>
        <Text style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 16 }}>
          4. Preferred Practice Duration
        </Text>
        <View
          style={{
            marginTop: 8,
            flexWrap: "wrap",
            flexDirection: "row",
            gap: 4,
            alignSelf: "center",
          }}
        >
          <TimerButton
            title={"No timer"}
            icon={
              <MaterialCommunityIcons
                name="timer-sand-paused"
                size={24}
                color="#1458E1"
              />
            }
          />
          <TimerButton
            title={"10 mins"}
            icon={<MaterialIcons name="timer" size={24} color="#DADCE0" />}
          />
          <TimerButton
            title={"15 mins"}
            icon={<MaterialIcons name="timer" size={24} color="#DADCE0" />}
          />
        </View>
      </View>

      <View style={{ top: 144 }}>
        <Button
          title={"Continue to practice"}
          backgroundColor="#2F6FED"
          textColor="#FFFFFC"
          onPress={() => {
            router.push("/practice/setup-2");
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
    top: 68,
  },
  description: {
    fontFamily: "Poppins",
    fontWeight: 400,
    fontSize: 14,
    color: "#515B6E",
    marginTop: 8,
  },
});
