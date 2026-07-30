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
// import { Checkbox } from "expo-checkbox";

// import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import OutlineButton from "../../components/OutlineButton";
import Line from "../../components/Line";

function Login() {
  return (
    <View style={styles.container}>
      <Header title={"Welcome Back"} subTitle={"Login to Continue"} />

      <View style={styles.fieldsContainer}>
        <InputField
          icon={<Fontisto name="email" size={18} color="#4f5351" />}
          placeholder={"Email Address"}
        />

        <InputField
          icon={<EvilIcons name="lock" size={22} color="#4f5351" />}
          placeholder={"*************"}
          iconName={"password"}
          secureTextEntry={true}
        />
      </View>

      <View>
        <View>
          <Text>Remember Me</Text>
        </View>

        <View>
          <Pressable>
            <Text>forgot password</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.action}>
        <Button title={"Login"} />
        <Line caption={"or continue with"} />

        <OutlineButton title={"Continue with Google"} />
        <View>
          <Text style={styles.accountAction}>
            Already have an account? Log in
          </Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 72,
  },
});
