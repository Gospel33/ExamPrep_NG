import { View, Text } from "react-native";

function Line({caption, width = "35%"}) {
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
      <View style={{ borderWidth: 1, borderColor: "#000000", width: width }} />
      <Text style={{ fontWeight: "semibold" }}>{caption}</Text>
      <View style={{ borderWidth: 1, borderColor: "#000000", width: width }} />
    </View>
    </View>
  );
}

export default Line;
