import { View, Text } from "react-native";

function Line({caption}) {
  return (
    <View style={{alignSelf: "center"}}>
        <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 15,
        marginBottom: 12,
        paddingHorizontal: 20,
        marginHorizontal: 18,
      }}
    >
      <View style={{ borderWidth: 1, borderColor: "#000000", width: "35%" }} />
      <Text style={{ fontWeight: "semibold" }}>{caption}</Text>
      <View style={{ borderWidth: 1, borderColor: "#000000", width: "35%" }} />
    </View>
    </View>
  );
}

export default Line;
