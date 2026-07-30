import { StyleSheet, View, Platform, StatusBar, Text } from "react-native";
import Header from "../../components/Header";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Digit from "../../components/Digit";
import Button from "../../components/Button";
import { router } from "expo-router";

function VerifyEmail() {
  return (
    <View style={styles.container}>
      <Header
        icon={
          <MaterialCommunityIcons
            name="email-newsletter"
            size={52}
            color="#000000"
          />
        }
        title={"Verify your email"}
        subTitle={"We've sent a 6-digit code to\n user@gmail.com"}
      />

      <View style={styles.digits}>
        <Digit />
        <Digit />
        <Digit />
        <Digit />
        <Digit />
        <Digit />
      </View>

      <View
        style={{
          top: 144,
          alignSelf: "center",
          color: "#666666",
          fontFamily: "Poppins",
          fontSize: 12,
          fontWeight: 400,
        }}
      >
        <Text>Didn’t recieve code? Resend in 00:45</Text>
      </View>

      <View style={{ top: 374, marginHorizontal: 18 }}>
        <Button
          title={"Verify & Continue"}
          onPress={() => {
            router.push("./auth/account-created");
          }}
        />
      </View>
    </View>
  );
}

export default VerifyEmail;

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
  digits: {
    top: 112,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 18,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
