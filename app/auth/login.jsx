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
import { useState } from "react";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import OutlineButton from "../../components/OutlineButton";
import Line from "../../components/Line";
import { router } from "expo-router";

function Login() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        title={"Welcome Back"}
        subTitle={"Login to Continue"}
        showAvatar={true}
      />

      <View style={styles.fieldsContainer}>
        <InputField
          icon={<Entypo name="mail" size={18} color="black" />}
          placeholder={"Email Address"}
        />

        <InputField
          icon={<FontAwesome name="lock" size={18} color="black" />}
          placeholder={"*************"}
          iconName={"password"}
          secureTextEntry={true}
        />
      </View>

      <View
        style={{
          marginTop: 56,
          flexDirection: "row",
          marginHorizontal: 18,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
            Remember Me
          </Text>
        </View>

        <View>
          <Pressable>
            <Text
              style={{
                fontSize: 12,
                textDecorationLine: "underline",
                fontWeight: 400,
                fontFamily: "Poppins",
              }}
            >
              forgot password
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.action}>
        <Button title={"Login"} />
        <Line caption={"or"} width={"53%"} />

        <OutlineButton title={"Continue with Google"} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.accountAction}>Don{`'`}t have an account? </Text>
          <Pressable
            style={{ alignItems: "center" }}
            onPress={() => {
              router.push("./auth/sign-up");
            }}
          >
            <Text
              style={[
                styles.accountAction,
                { textDecorationLine: "underline" },
              ]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default Login;

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
    top: 28,
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
  },

  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
