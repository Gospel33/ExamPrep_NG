import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Pressable,
} from "react-native";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { Checkbox } from "expo-checkbox";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import OutlineButton from "../../components/OutlineButton";
import Line from "../../components/Line";
import { useState } from "react";
import { router } from "expo-router";

function SignUp() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={styles.container}>
      <Header title={"Create Account"} subTitle={"Let's get you started"} showAvatar={true}/>

      <View style={styles.fieldsContainer}>
        <InputField
          icon={<Entypo name="user" size={18} color="black" />}
          placeholder={"Full Name"}
        />
        <InputField
          icon={<Entypo name="mail" size={18} color="black" />}
          placeholder={"Email"}
        />

        <InputField
          icon={<FontAwesome name="lock" size={18} color="black" />}
          placeholder={"Password"}
          iconName={"password"}
          secureTextEntry={true}
        />
        <InputField
          icon={<FontAwesome name="lock" size={18} color="black" />}
          placeholder={"Confirm Password"}
          iconName={"confirm-password"}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.termsContainer}>
        <Checkbox
          size={12}
          color="#D9D9D9"
          style={{ borderRadius: 5 }}
          value={isChecked}
          onValueChange={() => setIsChecked(!isChecked)}
        />
        <Text
          style={{
            fontFamily: "Inter",
            size: 12,
            fontWeight: 500,
            color: "#666666",
          }}
        >
          I agree to the
          <Text
            style={{
              fontFamily: "Inter",
              size: 12,
              fontWeight: 500,
              color: "#666666",
              lineHeight: 20,
              textDecorationLine: "underline",
            }}
          >
            Terms & Condition
          </Text>
        </Text>
      </View>
      <View style={styles.action}>
        <Button title={"Sign Up"} onPress={() => {
          router.push("./auth/verify-email")
        }}/>
        <Line caption={"or "} width="53%"/>
        <OutlineButton
          title={"Continue with Google"}
          icon={<Entypo name="user" size={18} color="black" />}
        />
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
          <Text style={styles.accountAction}>
            Already have an account? {" "}
          </Text>
          <Pressable
              onPress={() => {
                router.push("/auth/login");
              }}
            >
              <Text style={[styles.accountAction, {textDecorationLine: "underline"}]}>Log in</Text>
            </Pressable>
        </View>
      </View>
    </View>
  );
}

export default SignUp;

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

  fieldsContainer: {
    top: 42,
    gap: 12,
    marginHorizontal: 18,
  },

  action: {
    top: 56,
    marginHorizontal: 18,
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },

  accountAction: {
    color: "#666666",
    fontFamily: "Poppins",
    fontSize: 12,
    fontWeight: 400,
    alignItems: "center",
  },

  termsContainer: {
    top: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    marginHorizontal: 18,
  },
});
