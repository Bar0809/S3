import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar";

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
        <Text style={styles.itemText}>{item.student_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
        <Text style={[styles.pageTitle]}>{className} - אירועים מיוחדים</Text>
      </View>

      <Text style={styles.subTitle}> בחר/י את התלמיד/ה הרצוי/ה</Text>
      <ScrollView style={styles.scrollContainer}>
        <View>
          {students.map((student) => (
            <View key={student.id} style={styles.itemContainer}>
              {renderItem({ item: student })}
            </View>
          ))}
        </View>
      </ScrollView>
      <Text>{"\n\n\n\n\n\n"}</Text>

      <Navbar />
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 20,
    marginRight: 20,
  },
  itemText: {
    fontSize: 20,
    textAlign: "right",
  },

  title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "#AD8E70",
    fontSize: 36,
    fontWeight: "bold",
    padding: 10,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 24,
    textAlign: "right",
    fontWeight: "bold",
  },
  scrollContainer: {
    // flex: 1,
    height: "80%",
    width: "100%",
  },
});
