import { View, Text, StyleSheet, Platform, StatusBar, ScrollView, FlatList } from "react-native";
import Subject from "../../components/Subject";

const subjects = [
    {
        id: 1, name: "English"
    },
    {
        id: 2, name: "Maths"
    },
    {
        id: 3, name: "Biology"
    },
    {
        id: 4, name: "Physics"
    },
    {
        id: 5, name: "Chemistry"
    },
    {
        id: 6, name: "Government"
    }
]

function Register() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.caption}>Sign-up</Text>
        <Text style={styles.subCaption}>Select your JAMB combinations</Text>
      </View>

      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={styles.lineLeft}/><View style={styles.lineRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.subjectsContainer}>
        <FlatList
            data={subjects}
            renderItem={(subject) => <Subject label={subject.name} />}
            keyExtractor={subject => subject.id}
        />
      </ScrollView>
    </View>
  );
}

export default Register;

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

  lineLeft: {
    width: "45%",
    top: 222,
    borderWidth: 1,
    borderColor: "#2F6FED",
    alignSelf: "center",
    justifyContent: "center",
  },

  lineRight: {
    width: "45%",
    top: 222,
    borderWidth: 1,
    borderColor: "#f2eaea",
    alignSelf: "center",
    justifyContent: "center",
  },

  subjectsContainer: {
    marginTop: 14,
    paddingHorizontal: 10
  }

});
