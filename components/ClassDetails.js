import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,Dimensions, Image
} from "react-native";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs, deleteDoc, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');


const ClassDetails = ({ route }) => {
  const { class_id } = route.params;
  const { class_name } = route.params;
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [showContent2, setShowContent2] = useState(false);
  const [inputText, setInputText] = useState("");
  const [inputText2, setInputText2] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      const q = query(
        collection(db, "Courses"),
        where("class_id", "==", class_id),
        where("t_id", "==", auth.currentUser.uid)  
      );
      const querySnapshot = await getDocs(q);
      const names = querySnapshot.docs.map((doc) => doc.data().course_name);
      setCourses(names);
    };

    const getStudents = async () => {
      const q = query(
        collection(db, "Students"),
        where("class_id", "==", class_id)
      );
      const querySnapshot = await getDocs(q);
      const students = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "student",
        ...doc.data(),
      }));
      setStudents(students);
    };
    getCourses();
    getStudents();
  }, []);

  const handleDeleteStudent = async (student) => {
    Alert.alert(
      "מחיקת סטודנט",
      "את/ה בטוח/ה שאת/ה רוצה למחוק את התלמיד/ה הנבחרת ?",
      [
        {
          text: "לא",
          style: "cancel",
        },
        {
          text: "כן",
          onPress: async () => {
            const q = query(
              collection(db, "Students"),
              where("student_name", "==", student.student_name),
              where("class_id", "==", class_id),
              where("t_id", "==", auth.currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            const studentDocs = querySnapshot.docs.map((doc) => doc.ref);
            await Promise.all(studentDocs.map(deleteDoc));

            const classRef = doc(collection(db, "Classes"), class_id);
            await updateDoc(classRef, {
              numOfStudents: increment(-1)
            });

            const updatedStudents = students.filter((s) => s.id !== student.id);
            setStudents(updatedStudents);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddCourse = async () => {
    if (inputText === "") {
      Alert.alert("שגיאה", "הכנס/י שם המקצוע");
    } else {
      const courseRef = doc(collection(db, "Courses"));
      await setDoc(courseRef, {
        course_name: inputText,
        class_id,
        t_id: auth.currentUser.uid,
      });

      const classRef = doc(collection(db, "Classes"), class_id);
      await updateDoc(classRef, {
        numOfCourses: increment(1),
      });

      setCourses([...courses, inputText]);
      setInputText("");
      setShowContent(false)
    }
  };

  const handleAddStudent = async () => {
    if (inputText2 === "") {
      Alert.alert("שגיאה", "הכנס/י שם התלמיד/ה");
    } else {
      const studentRef = doc(collection(db, "Students"));
      await setDoc(studentRef, {
        student_name: inputText2,
        class_id,
        t_id: auth.currentUser.uid,
      });

      const classRef = doc(collection(db, "Classes"), class_id);
      await updateDoc(classRef, {
        numOfStudents: increment(1),
      });

      const newStudent = {
        id: studentRef.id,
        type: "student",
        student_name: inputText2,
      };

      setStudents([...students, newStudent]);
      setInputText2("");
      setShowContent2(false)

    }
  };
 
  const handleRemoveCourse = async (item) => {
    try {
      Alert.alert(
        "מחיקת מקצוע ",
        "את/ה בטוח/ה שאת/ה רוצה למחוק את המקצוע הנבחר ?",
        [
          {
            text: "לא",
            style: "cancel",
          },
          {
            text: "כן",
            onPress: async () => {
              const q = query(
                collection(db, "Courses"),
                where("course_name", "==", item),
                where("t_id", "==", auth.currentUser.uid)
              );
              const querySnapshot = await getDocs(q);
              const courseDocs = querySnapshot.docs.map((doc) => doc.ref);
              await Promise.all(courseDocs.map(deleteDoc));
              const updatedCourses = courses.filter((c) => c !== item);
              setCourses(updatedCourses);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }
  };
  
  return (
    <View style={styles.container}>
    <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={styles.title}>
      <Text style={styles.pageTitle}>הכיתות שלי: </Text>
    </View>

      <Text style={[styles.pageTitle, {textDecorationLine: "underline",fontSize:30}]}>{class_name}</Text>
      <ScrollView style={styles.scrollContainer}>
        {/* Course List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מקצועות לימוד:</Text>
          
          {courses.sort((a, b) => a.localeCompare(b)).map((course, index) => (
  <View key={index} style={styles.itemContainer}>
    <TouchableOpacity
      onPress={() => handleRemoveCourse(course)}
      style={styles.itemTextContainer}
    >
      <MaterialCommunityIcons
        name="delete"
        size={24}
        color="#AD8E70"
      />
    </TouchableOpacity>
    <Text style={styles.itemText}>{course}</Text>
  </View>
))}

  
  {showContent && (
  <View style={styles.addItem}>
    <TouchableOpacity onPress={handleAddCourse} style={styles.addButton}>
      <Text style={styles.buttonText}>הוסיף/י</Text>
    </TouchableOpacity>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="הכנס/י שם המקצוע"
        value={inputText}
        onChangeText={setInputText}
      />
    </View>
  </View>
)}
          <TouchableOpacity style={styles.button} onPress={() => setShowContent(!showContent)}>
          <Text style={styles.buttonText}>הוספת מקצוע </Text>
        </TouchableOpacity>
        </View>

        {/* Student List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>תלמידים: </Text>
          {students.sort((a, b) => a.student_name.localeCompare(b.student_name)).map((student, index) => (
  <View key={index} style={styles.itemContainer}>
    <TouchableOpacity
      onPress={() => handleDeleteStudent(student)}
      style={styles.itemTextContainer}
    >
      <MaterialCommunityIcons
        name="delete"
        size={24}
        color="#AD8E70"
      />
    </TouchableOpacity>
    <Text style={styles.itemText}>{student.student_name}</Text>
  </View>
))}


{showContent2 && (
  <View style={styles.addItem}>
    <TouchableOpacity onPress={handleAddStudent} style={styles.addButton}>
      <Text style={styles.buttonText}>הוסיף/י</Text>
    </TouchableOpacity>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="הכנס/י שם תלמיד/ה"
        value={inputText2}
        onChangeText={setInputText2}
      />
    </View>
  </View>
)}
        
      
        <TouchableOpacity style={styles.button} onPress={() => setShowContent2(!showContent2)}>
          <Text style={styles.buttonText}>הוספת תלמיד/ה </Text>
        </TouchableOpacity>

        </View>

        <Text>{"\n\n\n\n\n\n"}</Text>

           </ScrollView>

              <Navbar />


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
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
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

  itemTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pageTitle: {
    color: '#AD8E70',
      fontSize: 48,
    fontWeight: 'bold',
    padding: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  scrollContainer: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle:{
    fontSize: 24,
    textAlign: "right",
    fontWeight: 'bold',
  },
  addItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 20,
    marginRight: 20,
  },
  addItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 20,
    marginRight: 20,
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#AD8E70",
    height: 40,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});

export default ClassDetails;
