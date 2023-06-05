import {
  View,
  Text,ScrollView,
  StyleSheet, Image,
  TouchableOpacity,Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";
import { FontAwesome } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";

const { width } = Dimensions.get('window');

const ChooseCourse = ({ route }) => {
  const { reported, className, classId } = route.params;
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);

  function handleButtonClick(item) {
    if (reported === "Scores") {
      navigation.navigate("Scores", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else if (reported === "Presence") {
      navigation.navigate("Presence", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else if (reported === "FriendStatus") {
      navigation.navigate("FriendStatus", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else if (reported === "Mood") {
      navigation.navigate("Mood", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else if (reported === "Appearances") {
      navigation.navigate("Appearances", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else if (reported === "Diet") {
      navigation.navigate("Diet", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else if (reported === "myChoice1") {
      navigation.navigate("MyChoice1", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else if (reported === "myChoice2") {
      navigation.navigate("MyChoice2", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    } else {
      navigation.navigate("Events", {
        className: className,
        reported: reported,
        courseName: item.course_name,
        classId: classId,
        course_id: item.id,
      });
    }
  }

  useEffect(() => {
    const getCourses = async () => {
      const q = query(
        collection(db, "Courses"),
        where("class_id", "==", classId),
        where("t_id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
     
      const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "courses",
        ...doc.data(),
      }));
      setCourses(courses);
    
    };
    getCourses();
  }, [className]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => handleButtonClick(item)}>
          <Text style={styles.courseName}>{item.course_name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
    <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={styles.title}>
    <Text style={[styles.pageTitle]}>{className}- מקצועות לימוד</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
      <Text style={styles.subTitle}> בחר/י את המקצוע הרצוי</Text>
<View>
  
  {courses.map((item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() =>
        handleButtonClick(item)
      }
    >
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.course_name}</Text>
      </View>
    </TouchableOpacity>
  ))}
</View>
</ScrollView>
<Navbar/>
      
    </View>
  );
};

export default ChooseCourse;

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
});