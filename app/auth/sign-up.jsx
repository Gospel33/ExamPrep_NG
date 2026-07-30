import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { Checkbox } from "expo-checkbox";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import OutlineButton from "../../components/OutlineButton";
import Line from "../../components/Line";
import { useState } from "react";

function SignUp() {

  const [isChecked, setIsChecked] = useState(false);
  return (
    <View style={styles.container}>
      <Header title={"Create Account"} subTitle={"Let's get you started"} />

      {/* <View style={styles.line} /> */}

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
          size={16}
          color="#D9D9D9"
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
              textDecorationLine: "underline"
            }}
          >
            Terms & Condition
          </Text>
        </Text>
      </View>
      <View style={styles.action}>
        <Button title={"Sign Up"} />
        <Line caption={"or continue with"} />
        <OutlineButton title={"Continue with Google"} icon={<Entypo name="user" size={18} color="black" />}/>
        <View>
          <Text style={styles.accountAction}>
            Already have an account? Log in
          </Text>
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

  // line: {
  //   width: "90%",
  //   top: 28,
  //   borderWidth: 1,
  //   borderColor: "#f2eaea",
  //   alignSelf: "center",
  //   justifyContent: "center",
  // },

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
