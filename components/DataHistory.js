import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";

const { width } = Dimensions.get('window');

const DataHistory = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
    <View>
    <Image
          source={require("../assets/miniLogo-removebg-preview.png")}
        />
    </View>
  <View style={styles.title}>
    <Text style={styles.pageTitle}>היסטורית דיווחים</Text>
  </View>

      <View>

        <View style={styles.block}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => navigation.navigate("ClassData")}
          >
            <Text style={styles.buttonText}> לפי כיתה</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.block}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => navigation.navigate("StudentData")}
          >
            <Text style={styles.buttonText}>לפי תלמיד/ה </Text>
          </TouchableOpacity>
        </View>

      </View>
      <Navbar/>
    </View>
  );
};

export default DataHistory;

const styles = StyleSheet.create({ 
  container: {
  flex: 1,
  backgroundColor: "#F2E3DB",
  alignItems: "center",
  justifyContent: "center",
},  
title: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
},
pageTitle: {
  color: "#AD8E70",
  fontSize: 30,
  fontWeight: "bold",
  padding: 10,
},
  button: {
    width: width * 0.4,
    height: 65,
    justifyContent: "center",
    backgroundColor: "#F1DEC9",
    borderWidth: 2,
    borderColor: "#F1DEC9",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    fontSize: 24,
    color: "#AD8E70",
  }

  
});
