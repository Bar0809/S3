import {
  View,
  Text,
  StyleSheet, Image,ScrollView,
  TouchableOpacity,Dimensions
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { db, auth } from "./firebase";
import Navbar from "./Navbar";

const ChooseStudentForHistory = ({ route }) => {
  const { className } = route.params;
  const { classId } = route.params;

  const [students, setStudents] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    const getStudents = async () => {
      const q = query(
        collection(db, "Students"),
        where("class_id", "==", classId),
        where("t_id", "==", auth.currentUser.uid),
        orderBy("student_name") 
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
  

  const onPressStudent = (student) => {
    navigation.navigate("HistoryForStudent", {
      student_name: student.student_name,
      s_id: student.id,
    });
  };

  return (
    <View style={styles.container}>
    <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={styles.title}>
      <Text style={styles.pageTitle}> היסטוריה לפי תלמיד/ה </Text>
    </View>

    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <Text style={styles.subTitle}> בחר/י את התלמיד/ה הרצוי/ה</Text>

<View>
      {students.map((item, index) => (
          <View key={item + index} style={styles.itemContainer}>
  <TouchableOpacity key={item.id.toString()} onPress={() => onPressStudent(item)} >
      <Text style={styles.itemText}>{item.student_name}</Text>
  </TouchableOpacity>
  </View>
))}

</View>

    </ScrollView>

    <Navbar />
  </View>
    
  );
};

export default ChooseStudentForHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
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
    fontSize: 22,
    textAlign: "right",
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
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
  
  },
  subTitle: {
    fontSize: 24,
    textAlign: "right",
    fontWeight: "bold",
  },
});