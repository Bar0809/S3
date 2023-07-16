import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const Toolbar = ({  }) => {
  const navigation = useNavigation();
  const [selectedCell, setSelectedCell] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("FullLogin");
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }
  };
  const handleSidebarButtonPress = () => {
    setShowSidebar(true);
  };

  const handleSidebarClose = () => {
    setShowSidebar(false);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        // console.log('User is signed in.');
      } else {
        // No user is signed in.
        // console.log('No user is signed in.');
      }
    });
    return unsubscribe;
  }, []);

  const handleCellPress = (cellIndex) => {
    setSelectedCell(cellIndex);
    if (cellIndex === 0) {
      navigation.navigate("SetRules"); //
      setSelectedCell(0);
    }
    if (cellIndex === 1) {
      navigation.navigate("HomePage");
      setSelectedCell(1);
    }
    if (cellIndex === 2) {
      navigation.navigate("DataHistory");
      setSelectedCell(2);
    }
    if (cellIndex === 3) {
      navigation.navigate("Gallery");
      setSelectedCell(3);
    }
    if (cellIndex === 4) {
      navigation.navigate("MyClasses");
      setSelectedCell(4);
    }
    if (cellIndex === 5) {
      navigation.navigate("Profile");
      setSelectedCell(5);
    }
  };

  return (
      <View style={styles.toolbar}>
        <View style={styles.toolbarContent}>
          <Image
            source={require("../assets/miniLogo-removebg-preview.png")}
          />
          <Text style={styles.toolbarTitle}>Home Page</Text>
          <TouchableOpacity onPress={handleSidebarButtonPress}>
            <Text>☰</Text>
          </TouchableOpacity>
        </View>
        {/* Rest of the toolbar content */}
      </View>
  
);
};


const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Toolbar;
