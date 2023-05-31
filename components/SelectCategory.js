import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Toolbar from "./Toolbar";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import MyChoice1 from "./MyChoice1";
import { RadioButton } from "react-native-paper";

const SelectCategory = ({ route }) => {
  const { className, classId } = route.params;
  const [category, setCategory] = useState([]);
  const navigation = useNavigation();
  const [myChoice1, setMyChoice1] = useState("");
  const [myChoice2, setMyChoice2] = useState("");
  const [checked, setChecked] = useState("");

  useEffect(() => {
    const getMyReportsType = async () => {
      const q = query(
        collection(db, "users"),
        where("t_id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setMyChoice1(data.myChoice1);
        setMyChoice2(data.myChoice2);
      });
    };

    getMyReportsType(); // Call the function here
  }, []);

  function handleButtonClick() {
    if (checked === "Scores") {
      navigation.navigate("ScoresData", {
        className: className,
        classId: classId,
        category: checked,
      });
    } else if (checked === "Presence") {
      navigation.navigate("PresenceData", {
        className: className,
        classId: classId,
        category: checked,
      });
    } else if (checked === "FriendStatus" || checked === "Mood") {
      navigation.navigate("MoodsData", {
        className: className,
        classId: classId,
        category: checked,
      });
    } else if (checked === "Appearances" || checked === "Diet") {
      navigation.navigate("DietNAppearData", {
        className: className,
        classId: classId,
        category: checked,
      });
    } else if (checked === "MyChoice1" || checked === "MyChoice2") {
      navigation.navigate("MyChoicesData", {
        className: className,
        classId: classId,
        category: checked,
      });
    } else if (checked === "Appearances" || checked === "Diet") {
      navigation.navigate("DietNAppearData", {
        className: className,
        classId: classId,
        category: checked,
      });
    } else {
      navigation.navigate("EventsData", {
        className: className,
        classId: classId,
        category: checked,
      });
    }
  }

  return (
    <View>
      <Toolbar />
      <Text style={styles.subTitle}> בחר/י את הקטגוריה הרצויה</Text>

      <RadioButton.Group
        onValueChange={(value) => setChecked(value)}
        value={checked}
      >
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label="נוכחות"
            value="Presence"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label=" ציונים"
            value="Scores"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label="מצב רוח "
            value="Mood"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label="מצב חברתי"
            value="FriendStatus"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label=" תזונה"
            value="Diet"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label="נראות "
            value="Appearances"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label="אירועים מיוחדים "
            value="Events"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label={myChoice1}
            value="MyChoice1"
            style={styles.radioButtonItem}
          />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item
            label={myChoice2}
            value="MyChoice2"
            style={styles.radioButtonItem}
          />
        </View>
      </RadioButton.Group>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleButtonClick}
      >
        <Text style={styles.continueButtonText}>המשך</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  subTitle: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "right",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  radioButtonItem: {
    textAlign: "right",
  },
});
