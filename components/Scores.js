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
import { db, auth } from "./firebase";
import { RadioButton } from "react-native-paper";

const Scores = ({ route }) => {
  const navigation = useNavigation();
  const { classId } = route.params;
  const { course_id } = route.params;
  const { className } = route.params;
  const { courseName } = route.params;

  const [scores, setScores] = useState([]);
  const [students, setStudents] = useState([]);
  const [dateString, setDateString] = useState("");
  const [freeText, setFreeText] = useState([]);
  const [validDate, setValidDate] = useState(false);
  const [exerciseName, setExerciseName] = useState("");

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

  const createReport = async () => {
    const selectedValuesArray = Object.values(scores);

    if (selectedValuesArray.length < students.length) {
      Alert.alert("שגיאה", "חסר שדות");
      return;
    }

    const allSelected = selectedValuesArray.every((val) => val !== undefined);

    if (!validDate) {
      Alert.alert("שגיאה", "התאריך שהוזן לא תקין");
      return;
    }

    if (!validDate || !allSelected) {
      Alert.alert("שגיאה", "חסר שדות");
      return;
    }

    // Set empty strings for undefined freeText values
    for (let i = 0; i < students.length; i++) {
      if (freeText[i] === undefined) {
        freeText[i] = "";
      }
    }

    // Check if a document with the same date and course_id exists
    const q = query(
      collection(db, "Scores"),
      where("date", "==", dateString),
      where("course_id", "==", course_id)
    );
    const querySnapshot = await getDocs(q);
    const startDateArray = dateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    if (querySnapshot.size > 0) {
      Alert.alert(
        "Add report",
        "Note that there is an attendance report for this course on the above date. Do you want to continue?",
        [
          {
            text: "No",
            onPress: () => navigation.navigate("HomePage"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const scoresData = students.map((student, i) => {
                return {
                  course_id: course_id,
                  class_id: classId,
                  date: startDateTime,
                  score: selectedValuesArray[i],
                  s_id: student.id,
                  note: freeText[i],
                  exercise_name: exerciseName,
                  t_id: auth.currentUser.uid,
                  class_name: className,
                  courseName: courseName,
                  student_name: student.student_name,
                };
              });

              try {
                await Promise.all(
                  scoresData.map((data) =>
                    addDoc(collection(db, "Scores"), data)
                  )
                );

                Alert.alert("", 'דו"ח הציונים הוגש בהצלחה!');
                navigation.navigate("HomePage");
              } catch (e) {
                Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      const scoresData = students.map((student, i) => {
        return {
          course_id: course_id,
          class_id: classId,
          date: startDateTime,
          score: selectedValuesArray[i],
          s_id: student.id,
          note: freeText[i],
          exercise_name: exerciseName,
          t_id: auth.currentUser.uid,
          class_name: className,
          courseName: courseName,
          student_name: student.student_name,
        };
      });

      try {
        await Promise.all(
          scoresData.map((data) => addDoc(collection(db, "Scores"), data))
        );

        Alert.alert("", 'דו"ח הציונים הוגש בהצלחה!');

        navigation.navigate("HomePage");
      } catch (e) {
        Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
      }
    }
  };

  const handleChangeDate = (text) => {
    setDateString(text);
    setValidDate(parseDateString(text, "dd/mm/yyyy"));
  };

  const handleChangeString = (text) => {
    setExerciseName(text);
  };

  function parseDateString(inputString) {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = inputString.match(dateRegex);

    if (!match) {
      return null;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(match[3], 10);

    // Check if the date is valid
    const date = new Date(year, month, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    // Check if the month is valid
    if (month > 11) {
      return null;
    }

    // Check if the day is valid for the given month and year
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (day > lastDayOfMonth) {
      return null;
    }

    // Check if the date is within the desired range
    const currentDate = new Date();
    const minDate = new Date("2023-01-01");
    if (date < minDate || date > currentDate) {
      return null;
    }

    return date;
  }

  const handleChangeText = (text, index) => {
    const newFreeText = [...freeText];
    newFreeText[index] = text;
    setFreeText(newFreeText);
  };

  const handleScoreChange = (text, index) => {
    const newScore = [...scores];
    newScore[index] = text;
    setScores(newScore);
  };

  return (
    <View>
      <Toolbar />
      <View style={styles.report}>
        <Text style={{ fontSize: 20, padding: 10 }}> צור/י דיווח חדש</Text>
        <Ionicons name="create-outline" size={24} color="black" />
      </View>

      <View>
        <Text>תאריך</Text>
        <TextInput
          style={[styles.input, { textAlign: "right" }]}
          value={dateString}
          onChangeText={handleChangeDate}
          placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)"
        />
        {validDate ? (
          <Text style={{ color: "green" }}>Correct date</Text>
        ) : (
          <Text style={{ color: "red" }}>Incorrect date</Text>
        )}
      </View>

      <Text>שם המטלה</Text>
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        value={exerciseName}
        placeholder="הכנס/י שם המטלה/מבחן"
        onChangeText={handleChangeString}
      />

      <View>
        <View
          style={[{ flexDirection: "row", justifyContent: "space-around" }]}
        >
          <Text
            style={[{ textAlign: "right", fontWeight: "bold", fontSize: 16 }]}
          >
            הערות -לא חובה
          </Text>
          <Text
            style={[{ textAlign: "right", fontWeight: "bold", fontSize: 16 }]}
          >
            ציון{" "}
          </Text>
          <Text
            style={[{ textAlign: "right", fontWeight: "bold", fontSize: 16 }]}
          >
            שם התלמיד/ה
          </Text>
        </View>

        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            const i = index;
            return (
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.student_name}</Text>
                <TextInput
                  style={[styles.inputFreeText, { textAlign: "right" }]}
                  onChangeText={(text) => handleScoreChange(text, i)}
                  value={scores[i]}
                ></TextInput>
                <TextInput
                  style={[styles.inputFreeText, { textAlign: "right" }]}
                  onChangeText={(text) => handleChangeText(text, i)}
                  value={freeText[i]}
                ></TextInput>
              </View>
            );
          }}
        />
      </View>
      <TouchableOpacity style={[styles.butt]} onPress={createReport}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginLeft: 5 }}>צור דיווח</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Scores;

const styles = StyleSheet.create({
  report: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "right",
    justifyContent: "flex-end",
  },

  container: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    marginBottom: 16,
    justifyContent: "space-around",
  },
  name: {
    fontWeight: "bold",
    marginRight: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginRight: 16,
  },
  radioButtonItem: {
    height: 24,
    width: 24,
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
    width: 100,
  },
  back: {
    padding: "30%",
  },
  inputFreeText: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 120,
    backgroundColor: "white",
  },
});
