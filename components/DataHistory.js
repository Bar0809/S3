import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toolbar from "./Toolbar";

const DataHistory = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.all}>
      <Toolbar />

      <View>
        <View style={styles.title}>
          <Text style={styles.pageTitle}>הנתונים שלי : </Text>
        </View>

        <View style={styles.block}>
          <TouchableOpacity
            style={[styles.butt]}
            onPress={() => navigation.navigate("ClassData")}
          >
            <Text style={styles.text}> לפי כיתה</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.block}>
          <TouchableOpacity
            style={[styles.butt]}
            onPress={() => navigation.navigate("StudentData")}
          >
            <Text style={styles.text}>לפי תלמיד/ה </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.circle}
          onPress={() => navigation.navigate("HomePage")}
        >
          <MaterialIcons name="navigate-next" size={24} color="black" />
          <Text>הקודם</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DataHistory;

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
    padding: 10,
  },

  butt: {
    borderRadius: 20,
    width: 200,
    height: 65,
    marginHorizontal: 30,
    borderWidth: 1,
    backgroundColor: "#c7d9fe",
  },
  all: {
    // flex:1,
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    textAlign: "center",
    padding: 10,
  },
  block: {
    padding: 20,
  },
});
