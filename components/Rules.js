import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Toolbar from "./Toolbar";
import Presence from "./Presence";
import Scores from "./Scores";
import Diet from "./Diet";
import Events from "./Events";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";

const Rules = () => {
  const functions = require("firebase-functions");
  const admin = require("firebase-admin");
  admin.initializeApp();

  const [sensitivity, setSensitivity] = useState("");

  useEffect(() => {
    const teacherRef = doc(collection(db, "Teachers"), auth.currentUser.uid);
    getDoc(teacherRef)
      .then((doc) => {
        const data = doc.data();
        setSensitivity(data.sensitivity);
      })
      .catch((error) => {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      });
  }, []);

  exports.checkConditions = functions.firestore
    .document("{collection}/{docId}")
    .onWrite((change, context) => {
      const collection = context.params.collection;
      const docId = context.params.docId;
      const newValue = change.after.data();
      const previousValue = change.before.data();

      if (sensitivity === "high") {
      }

      if (collection === "Appearances" && newValue.appearances === "bed") {
        // Check if there are more than 2 reports in the Appearances collection that received the bed field
        admin
          .firestore()
          .collection("Appearances")
          .where("appearances", "==", "bed")
          .get()
          .then((snapshot) => {
            if (snapshot.size > 2) {
              // Send a notification to the user
              sendNotification();
            }
          });
      }

      if (collection === "Presence" && newValue.presence === "late") {
        // Check if there are at least 3 reports in the Presence collection that received the late field
        admin
          .firestore()
          .collection("Presence")
          .where("presence", "==", "late")
          .get()
          .then((snapshot) => {
            if (snapshot.size >= 3) {
              // Send a notification to the user
              sendNotification();
            }
          });
      }

      if (collection === "Events" && newValue.type === "negative") {
        // Check if there is at least one report in the Events collection that received the negative field
        admin
          .firestore()
          .collection("Events")
          .where("type", "==", "negative")
          .get()
          .then((snapshot) => {
            if (snapshot.size >= 1) {
              // Send a notification to the user
              sendNotification();
            }
          });
      }

      // Define other conditions for the other collections

      function sendNotification() {
        // Get the user's device token from the Firestore
        const userId = newValue.userId;
        admin
          .firestore()
          .collection("Users")
          .doc(userId)
          .get()
          .then((doc) => {
            const token = doc.data().token;

            // Use the Firebase Cloud Messaging API to send a notification to the user
            // See https://firebase.google.com/docs/cloud-messaging for more information
          });
      }
    });

  return (
    <View>
      <Toolbar />

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("HomePage")}
      >
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text>חזור</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Rules;

const styles = StyleSheet.create({});
