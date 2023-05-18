import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { RadioButton } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

const Events = ({ route }) => {
  const navigation = useNavigation();
  const { className } = route.params;
  const { courseName } = route.params;
  const { classId } = route.params;
  const { course_id } = route.params;

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudents = async () => {
      const q = query(
        collection(db, "Students"),
        where("class_id", "==", classId)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setStudents(data);
    };
    getStudents();
  }, []);

  const handlePress = (id, name) => {
    navigation.navigate("SpicelEvent", {
      studentId: id,
      studentName: name,
      className: className,
      courseName: courseName,
      classId: classId,
      course_id: course_id,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id, item.student_name)}>
      <View style={{ padding: 10 }}>
        <Text>{item.student_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[{ alignItems: "center" }]}>
      <Toolbar />

      <View style={styles.title}>
        <Text style={styles.pageTitle}> {className} </Text>
      </View>

      <Text style={styles.subTitle}>בחר/י את התלמיד/ה הרצוי</Text>

      <Text
        style={[
          {
            textAlign: "right",
            fontSize: 20,
            fontWeight: "bold",
            textDecorationLine: "underline",
          },
        ]}
      >
        רשימת תלמידים:
      </Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  back: {
    padding: "30%",
  },
  subTitle: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "right",
  },
  pageTitle: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "center",
  },
});
