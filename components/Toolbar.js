import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const Toolbar = (props) => {
  const navigation = useNavigation();
  const [selectedCell, setSelectedCell] = useState(1);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("FullLogin");
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }
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
      navigation.navigate("Profile"); //
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
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.cell, selectedCell === 0 ? styles.selectedCell : null]}
        onPress={() => handleCellPress(0)}
      >
        <Text style={styles.cellText}> מידע</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cell, selectedCell === 1 ? styles.selectedCell : null]}
        onPress={() => handleCellPress(1)}
      >
        <Text style={styles.cellText}>דיווח</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cell, selectedCell === 2 ? styles.selectedCell : null]}
        onPress={() => handleCellPress(2)}
      >
        <Text style={styles.cellText}>נתונים</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cell, selectedCell === 3 ? styles.selectedCell : null]}
        onPress={() => handleCellPress(3)}
      >
        <Text style={styles.cellText}>גלריה</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cell, selectedCell === 4 ? styles.selectedCell : null]}
        onPress={() => handleCellPress(4)}
      >
        <Text style={styles.cellText}>הכיתות שלי</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cell, selectedCell === 5 ? styles.selectedCell : null]}
        onPress={() => handleCellPress(5)}
      >
        <Text style={styles.cellText}>איזור אישי</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.text} onPress={handleLogout}>
        <Text
          style={[
            styles.text,
            { top: 28, fontSize: 18, textDecorationLine: "underline" },
          ]}
        >
          התנתק
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ccc",
    padding: 10,
  },
  cell: {
    flex: 1,
    backgroundColor: "#fff",
    // padding: 10,
    borderRadius: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCell: {
    backgroundColor: "#add8e6",
  },
  cellText: {
    fontSize: 16,
  },
});

export default Toolbar;
