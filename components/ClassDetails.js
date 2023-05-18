import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

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
        where("class_id", "==", class_id)
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
      "Delete Student",
      "Are you sure you want to delete this student?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
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
            const updatedStudents = students.filter((s) => s.id !== student.id);
            setStudents(updatedStudents);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRemoveCourse = async (item) => {
    try {
      Alert.alert(
        "Delete Student",
        "Are you sure you want to delete this course?",
        [
          {
            text: "No",
            onPress: () => Alert.alert("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const q = query(
                collection(db, "Courses"),
                where("course_name", "==", item),
                where("t_id", "==", auth.currentUser.uid)
              );
              const querySnapshot = await getDocs(q);
              const coursetDocs = querySnapshot.docs.map((doc) => doc.ref);
              await Promise.all(coursetDocs.map(deleteDoc));
              const updatedCourses = courses.filter((s) => s.class_name !== id);
              setCourses(updatedCourses);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }
  };

  const handlePressCourses = () => {
    setShowContent(!showContent);
  };

  const handlePressStudents = () => {
    setShowContent2(!showContent2);
  };

  const handleAddCourse = async () => {
    try {
      const courseName = inputText.trim();
      if (courseName.length > 0) {
        const courseRef = doc(collection(db, "Courses"));
        await setDoc(courseRef, {
          class_id: class_id,
          course_name: courseName,
          t_id: auth.currentUser.uid,
        });
        const newCourses = [...courses, courseName];
        setCourses(newCourses);
        setInputText("");
        handlePressCourses();
      }
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }
  };

  const handleAddStudent = async (textInput) => {
    try {
      const studentName = inputText2;
      if (studentName.length > 0) {
        const studentRef = doc(collection(db, "Students"));
        await setDoc(studentRef, {
          student_name: studentName,
          t_id: auth.currentUser.uid,
        });
        const newStudents = [...students, studentName];
        setStudents(newStudents);
        setInputText2("");
        handlePressStudents();
      }
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === "student") {
      return (
        <View style={styles.listItem}>
          {item.type === "student" && (
            <TouchableOpacity onPress={() => handleDeleteStudent(item)}>
              <Text
                style={[
                  {
                    textAlign: "right",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  },
                ]}
              >
                הסר
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[{ paddingLeft: 70 }]}>{item.student_name}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.listItem}>
          <TouchableOpacity onPress={() => handleRemoveCourse(item)}>
            <Text
              style={[
                {
                  textAlign: "right",
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                },
              ]}
            >
              הסר
            </Text>
          </TouchableOpacity>

          <Text style={[{ paddingLeft: 70 }]}>{item}</Text>
        </View>
      );
    }
  };

  return (
    <View style={[{ alignItems: "center" }]}>
      <Toolbar />

      <View style={styles.title}>
        <Text style={styles.pageTitle}> {class_name} </Text>
        <FontAwesome
          name="users"
          size={30}
          color="black"
          style={[{ paddingLeft: -50 }]}
        />
      </View>

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
        מקצועות הלימוד:
      </Text>

      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.button} onPress={handlePressCourses}>
        <MaterialCommunityIcons
          style={styles.icon}
          name="plus"
          size={24}
          color="black"
        />
        <Text style={styles.buttonText}>הוסף קורס</Text>
      </TouchableOpacity>

      {showContent && (
        <>
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            placeholder="  שם המקצוע:"
            onChangeText={(text) => setInputText(text)}
            value={inputText}
          />

          <TouchableOpacity style={[styles.butt]} onPress={handleAddCourse}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginLeft: 5 }}>הוסף/י מקצוע</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.button} onPress={handlePressStudents}>
        <MaterialCommunityIcons
          style={styles.icon}
          name="plus"
          size={24}
          color="black"
        />
        <Text style={styles.buttonText}>הוסף תלמיד/ה</Text>
      </TouchableOpacity>

      {showContent2 && (
        <>
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            placeholder="  שם התלמיד/ה:"
            onChangeText={(text) => setInputText2(text)}
            value={inputText2}
          />

          <TouchableOpacity style={[styles.butt]} onPress={handleAddStudent}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginLeft: 5 }}>הוסף/י תלמיד/ה</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ClassDetails;

const styles = StyleSheet.create({
  title: {
    alignItems: "center",
    flexDirection: "row",
  },
  pageTitle: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  icon: {
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
  },
  butt: {
    backgroundColor: "#90EE90",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});
