import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { RadioButton } from "react-native-paper";
import Navbar from "./Navbar";

const { width } = Dimensions.get('window');

const SelectCategory = ({ route }) => {
  const { className, classId } = route.params;
  const [category, setCategory] = useState(false);
  const navigation = useNavigation();
  const [eventType, setEventType] = useState("");
  const [myChoice1, setMyChoice1] = useState("");
  const [myChoice2, setMyChoice2] = useState("");

  useEffect(() => {
    const getMyReportsType = async () => {
      const q = query(
        collection(db, "users"),
        where("t_id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        return;
      }
      setCategory(true);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setMyChoice1(data.myChoice1);
        setMyChoice2(data.myChoice2);
      });
    };

    getMyReportsType();
  }, []);

  function handleButtonClick() {
    if (eventType === "Presence") {
      navigation.navigate("PresenceData", {
        className: className,
        classId: classId,
        category: eventType,
      });
    } else if (eventType === "Scores") {
      navigation.navigate("ScoresData", {
        className: className,
        classId: classId,
        category: eventType,
      });
    } else if (eventType === "Mood" || eventType === "FriendStatus") {
      navigation.navigate("MoodsData", {
        className: className,
        classId: classId,
        category: eventType,
      });
    } else if (eventType === "Diet" || eventType === "Appearances") {
      navigation.navigate("DietNAppearData", {
        className: className,
        classId: classId,
        category: eventType,
      });
    } else if (eventType === "MyChoice1" || eventType === "MyChoice2") {
      navigation.navigate("MyChoicesData", {
        className: className,
        classId: classId,
        category: eventType,
      });
    } else {
      navigation.navigate("EventsData", {
        className: className,
        classId: classId,
        category: eventType,
      });
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>
      <View style={styles.title}>
        <Text style={styles.pageTitle}>היסטורית דיווחים לפי כיתה</Text>
      </View>
      <Text style={styles.subTitle}> בחר/י את הקטגוריה הרצויה</Text>
      <ScrollView showsVerticalScrollIndicator={false} horizontal={false} style={styles.scrollContainer}>
        <View style={styles.radioContainer}>
          <View style={styles.radioRow}>
            <RadioButton.Android
              value="Presence"
              status={eventType === "Presence" ? "checked" : "unchecked"}
              onPress={() => setEventType("Presence")}
            />
            <Text style={styles.radioLabel}>נוכחות</Text>
          </View>
  
          <View style={styles.radioRow}>
            <RadioButton.Android
              value="Scores"
              status={eventType === "Scores" ? "checked" : "unchecked"}
              onPress={() => setEventType("Scores")}
            />
            <Text style={styles.radioLabel}>ציונים</Text>

          </View>
  
          <View style={styles.radioRow}>
            <RadioButton.Android
              value="Mood"
              status={eventType === "Mood" ? "checked" : "unchecked"}
              onPress={() => setEventType("Mood")}
            />
            <Text style={styles.radioLabel}>מצב רוח</Text>
          </View>
  
          <View style={styles.radioRow}>
            <RadioButton.Android
              value="FriendStatus"
              status={eventType === "FriendStatus" ? "checked" : "unchecked"}
              onPress={() => setEventType("FriendStatus")}
            />
            <Text style={styles.radioLabel}>מצב חברתי</Text>
          </View>
  
          <View style={styles.radioRow}>
            <RadioButton.Android
              value="Diet"
              status={eventType === "Diet" ? "checked" : "unchecked"}
              onPress={() => setEventType("Diet")}
            />
            <Text style={styles.radioLabel}>תזונה</Text>
          </View>
  
          <View style={styles.radioRow}>

            <RadioButton.Android
              value="Appearances"
              status={eventType === "Appearances" ? "checked" : "unchecked"}
              onPress={() => setEventType("Appearances")}
            />
            <Text style={styles.radioLabel}>נראות</Text>

          </View>
  
          <View style={styles.radioRow}>

            <RadioButton.Android
              value="Events"
              status={eventType === "Events" ? "checked" : "unchecked"}
              onPress={() => setEventType("Events")}
            />
      <Text style={styles.radioLabel}>אירועים</Text>

          </View>
  
          {category && (
            <View style={styles.radioRow}>

              <RadioButton.Android
                value="MyChoice1"
                status={eventType === "MyChoice1" ? "checked" : "unchecked"}
                onPress={() => setEventType("MyChoice1")}
              />
              <Text style={styles.radioLabel}>{myChoice1}</Text>

            </View>
          )}
  
          {category && (
            <View style={styles.radioRow}>
              <RadioButton.Android
                value="MyChoice2"
                status={eventType === "MyChoice2" ? "checked" : "unchecked"}
                onPress={() => setEventType("MyChoice2")}
              />
               <Text style={styles.radioLabel}>{myChoice2}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>המשך</Text>
        </TouchableOpacity>
        <Text>{"\n\n\n\n\n\n"}</Text>
      </ScrollView>
      <Navbar />
    </View>
  );
  
  

   }
export default SelectCategory;

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
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textAlign: "center",
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
  },
  subTitle: {
    fontSize: 20,
    textAlign: "right",
    fontWeight: "bold",
  },
  radioButtonItem: {
    textAlign: "right",
    fontWeight: "bold",
  },
  radioContainer: {
    marginTop: 20,
  },
  radioRow: {
    flexDirection: "row-reverse",
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioLabel: {
    marginLeft: 5,
  },
});

