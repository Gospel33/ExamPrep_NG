import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import Header from "../../components/Header";

import Entypo from "@expo/vector-icons/Entypo";
import { Button } from "react-native-web";

function AccountCreated() {
  return (
    <View style={styles.container}>
      <Header
        icon={<Entypo name="check" size={36} color="#000000" />}
        title={"Account created succesfuly"}
        subTitle={
          "Welcome to ExamPrep NG.\nLet’s help you achieve\nyour JAMB goal"
        }
      />

      <View>
        <Button title="Complete Profile" />

        <Pressable>
          <Text
            style={{
              color: "#1A1A1A",
              fontWeight: 400,
              fontFamily: "Poppins",
              fontSize: 16,
            }}
          >
            Skip for now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default AccountCreated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    flexDirection: "column",
    height: "100%",
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
});
