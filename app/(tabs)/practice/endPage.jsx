import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import BackButton from "../../../components/BackButton";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EndPage() {
  return (
    <View style={styles.container}>
      <BackButton />

      <View
        style={{
          top: 92,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{color: "#2F6FED", fontSize: 14, fontWeight: 500}}>End Practice</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <MaterialCommunityIcons
            name="timer-sand-empty"
            size={24}
            color="black"
          />
          <Text style={{color: "#020712", fontSize: 16, fontWeight: 600, fontFamily: "Poppins"}}>14:32</Text>
        </View>
      </View>

      <View style={{ top: 112, marginVertical: 24, gap: 32 }}>
        <Text style={{textAlign: "justify"}}>Question 25</Text>
        <Text>
          A maize plant develops yellow leaves despite receiving enough water
          and sunlight. A soil test reveals a deficiency of nitrogen, an
          essential nutrient needed for chlorophyll production. Which process
          will be most directly affected?
        </Text>
      </View>

      <View style={{ top: 124 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#1458E1",
            padding: 12,
            marginBottom: 12
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              
            }}
          >
            <Text style={{color: "#515B6E"}}>A</Text>
            <Text style={{color: "#515B6E"}}>Photosynthesis due to reduced chlorophyll production</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#1458E1",
            padding: 12,
            marginBottom: 12
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              
            }}
          >
            <Text style={{color: "#515B6E"}}>B</Text>
            <Text style={{color: "#515B6E"}}>Germination due to reduced seed viability</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#1458E1",
            padding: 12,
            marginBottom: 12
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              
            }}
          >
            <Text style={{color: "#515B6E"}}>C</Text>
            <Text style={{color: "#515B6E"}}>Photosynthesis due to reduced chlorophyll production</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#1458E1",
            padding: 12,
            marginBottom: 12
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              
            }}
          >
            <Text style={{color: "#515B6E"}}>D</Text>
            <Text style={{color: "#515B6E"}}>Germination due to reduced seed viability</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          top: 156,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 4,
            backgroundColor: "#bbcbec",
          }}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text>25 of 25</Text>
        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 4,
            backgroundColor: "#2F6FED",
            color: "#FFFFFF",
          }}
        >
          <Text style={{color: "#fff"}}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 18,
  },
});
