import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal,ScrollView,Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;


const Navbar = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
  };
  

  return (

    <View style={styles.container}>
      <View>
        <StatusBar style="light" />
      </View>

      <View style={styles.NavContainer}>
        <View style={styles.NavBar}>
          <Pressable
            onPress={() => navigation.navigate("MyClasses")}
            style={styles.IconBehave}
            android_ripple={{ borderless: true, radius: 50 }}
          >
            <Ionicons name="people-outline" size={24} color="black" />
            <TouchableOpacity
              onPress={() => navigation.navigate("MyClasses")}
              style={styles.NavItem}
            >
              <Text>כיתות</Text>
            </TouchableOpacity>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("DataHistory")}
            style={styles.IconBehave}
            android_ripple={{ borderless: true, radius: 50 }}
          >
            <MaterialIcons name="history" size={24} color="black" />
            <TouchableOpacity
              onPress={() => navigation.navigate("DataHistory")}
              style={styles.NavItem}
            >
              <Text>היסטוריה</Text>
            </TouchableOpacity>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("HomePage")}
            style={styles.IconBehave}
            android_ripple={{ borderless: true, radius: 50 }}
          >
            <Octicons name="report" size={24} color="black" />
            <TouchableOpacity
              onPress={() => navigation.navigate("HomePage")}
              style={styles.NavItem}
            >
              <Text>דיווח</Text>
            </TouchableOpacity>
          </Pressable>

          <Pressable
            onPress={toggleModal}
            style={styles.IconBehave}
            android_ripple={{ borderless: true, radius: 50 }}
          >
            <Feather name="menu" size={24} color="black" />
            <TouchableOpacity onPress={toggleModal}>
              <Text>תפריט</Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </View>

      <Modal visible={showModal} animationType="slide" style={styles.allTheModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={[
              styles.cell,
            ]}
            onPress={() => {
              navigation.navigate("Profile");
              toggleModal();
            }}          >
            <Text style={styles.cellText}> איזור אישי</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cell]}
            onPress={() =>{ navigation.navigate("SetRules"); toggleModal();}}
          >
            <Text style={styles.cellText}>הגדרת רמזור</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cell,
            ]}
            onPress={() => {navigation.navigate("MyClasses"); toggleModal();}}
          >
            <Text style={styles.cellText}>הכיתות שלי</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cell,
            ]}
            onPress={() => {navigation.navigate("HomePage"); toggleModal();} }
          >
            <Text style={styles.cellText}>דיווחים</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cell,
            ]}
            onPress={() => {navigation.navigate("DataHistory"); toggleModal();}}
          >
            <Text style={styles.cellText}> היסטוריה</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cell,
            ]}
            onPress={() => {navigation.navigate("Gallery"); toggleModal();}}
          >
            <Text style={styles.cellText}>גלריה </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cell,
            ]}
            onPress={() => {navigation.navigate("HomePage"); toggleModal();}}
          >
            <Text style={styles.cellText}>מידע - לעדכן </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal}>
          <Text style={styles.modalCloseButtonText}>✕</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
  NavContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 20,
  },
  NavBar: {
    flexDirection: "row",
    backgroundColor: "#A4907C",
    width: "90%",
    justifyContent: "space-evenly",
    borderRadius: 40,
  },
  IconBehave: {
    padding: 14,
  },
  
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: screenWidth * 0.7, 
    marginLeft: screenWidth * 0.15, 
  
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalCloseButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  
  },
  cell: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCell: {
    backgroundColor: "#add8e6",
  },
  cellText: {
    fontSize: 20,
    fontWeight: "bold",
    color:"#482121",
    fontWeight:'bold'
  },
  
});

export default Navbar;
