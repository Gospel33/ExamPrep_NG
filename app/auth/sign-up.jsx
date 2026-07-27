import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function SignUp() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.caption}>Sign-up</Text>
        <Text style={styles.subCaption}>Let{`'`}s get you started</Text>
      </View>

      <View style={styles.line} />

      <View style={styles.fieldsContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <InputField
              label={"First Name"}
              placeholder={"First Name"}
              style={{ alignSelf: "stretch" }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              label={"Last Name"}
              placeholder={"Last Name"}
              style={{ alignSelf: "stretch" }}
            />
          </View>
        </View>
        <InputField label={"Email"} placeholder={"Email"} />

        <InputField
          label={"Create Password"}
          placeholder={"*************"}
          iconName={"password"}
          secureTextEntry={true}
        />
        <InputField
          label={"Confirm Password"}
          placeholder={"*************"}
          iconName={"confirm-password"}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.action}>
        <Button title={"Continue"} />
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
    borderWidth: 2,
    borderColor: "blue",
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

  titleContainer: {
    top: 216,
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },

  caption: {
    fontFamily: "Poppins",
    fontWeight: 600,
    fontStyle: "normal",
    fontSize: 22,
    color: "#333333",
  },

  subCaption: {
    fontFamily: "Poppins",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: 14,
    color: "#666666",
  },

  line: {
    width: "90%",
    top: 222,
    borderWidth: 1,
    borderColor: "#f2eaea",
    alignSelf: "center",
    justifyContent: "center",
  },

  fieldsContainer: {
    top: 238,
    gap: 12,
    marginHorizontal: 18,
  },

  action: {
    top: 252,
    marginHorizontal: 18,
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },

  accountAction: {
    color: "#2F6FED",
    fontFamily: "Poppins",
    fontSize: 14,
    fontWeight: 500,
  },
});
