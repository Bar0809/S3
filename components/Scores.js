import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,  ScrollView, Image, Dimensions
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { AntDesign } from '@expo/vector-icons';
import Navbar from "./Navbar";


const { width } = Dimensions.get('window');

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

    for (let i = 0; i < students.length; i++) {
      if (freeText[i] === undefined) {
        freeText[i] = "";
      }
    }

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
        "הוספת דיווח ",
        "שימו לב, יש רשימת ציונים בתאריך זה למקצוע זה. האם ברצונכם להמשיך?",
        [
          {
            text: "לא",
            onPress: () => navigation.navigate("HomePage"),
            style: "cancel",
          },
          {
            text: "כן",
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
    const month = parseInt(match[2], 10) - 1; 
    const year = parseInt(match[3], 10);

    const date = new Date(year, month, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    if (month > 11) {
      return null;
    }

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (day > lastDayOfMonth) {
      return null;
    }

    const currentDate = new Date();
    const minDate = new Date("2023-01-01");
    if (date < minDate ) {
      Alert.alert("", "לא ניתן להכניס תאריך קטן מה- 01/01/2023");
      return false;
    }

    if ( date > currentDate) {
      Alert.alert("", "לא ניתן להכניס תאריך עתידי");
      return false;
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
    <View style={styles.container}>
    <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={[styles.title,]}>
  <Text style={styles.pageTitle}> דיווח ציונים</Text>
</View>

<View style={styles.title}>
<Text style={[styles.pageTitle , {color:'black' ,fontSize: 22,lineHeight: 14,}]}>{className} - {courseName}</Text>
</View>

    <ScrollView showsVerticalScrollIndicator={false} horizontal={false} >
      <View style={styles.container}>
        <View >
          {/* <Text style={styles.subTitle}>תאריך</Text> */}
          <TextInput
  style={[styles.input, { flex: 1 }]}
  value={dateString}
  onChangeText={handleChangeDate}
  placeholder="הכנס/י תאריך מהצורה (DD/MM/YYYY)"
/>
          {dateString && !validDate && (
            <Text style={{ color: "red" }}>ערך לא תקין</Text>
          )}

                  {validDate && (<AntDesign name="check" size={24} color="green" />)}

        </View>

        
      </View>

      <Text style={[{lineHeight: 14,}]}></Text>

      <View style={styles.container}>
      <View >
        {/* <Text style={styles.subTitle}>שם המטלה</Text> */}
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={exerciseName}
          placeholder="הכנס/י שם המטלה/מבחן"
          onChangeText={handleChangeString}
        />
      </View>
      </View>

      <Text>{"\n"}</Text>


      
      <View style={styles.tableContainer}>
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>הערות - לא חובה</Text>
       <Text style={styles.tableHeaderText}>ציון</Text>
      <Text style={styles.tableHeaderText}>שם התלמיד/ה</Text>
    </View>

    {students.map((item, index) => {
      const i = index;
      return (
        <View style={styles.studentRow} key={item.id.toString()}>
          <View style={styles.radioButtonContainer}>
          <TextInput
            style={[styles.inputFreeText, {textAlign:'right'}]}
            onChangeText={(text) => handleChangeText(text, i)}
            value={freeText[i]}
          />
          <TextInput 
            style={[styles.gradeInput]}
            onChangeText={(text) => handleScoreChange(text, i)}
            value={scores[i]}
          />
          <Text style={styles.name}>{item.student_name}</Text>
        </View>
        </View>
      );
    })}
  </View>

      <TouchableOpacity style={styles.button} onPress={createReport}>
      <Text style={styles.buttonText}> שלח/י דיווח</Text>
      </TouchableOpacity>
      <Text>{"\n\n\n\n\n\n"}</Text>

    </ScrollView>
    <Navbar />
  </View>
);
};  

export default Scores;

const styles = StyleSheet.create({
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gradeInput: {
    width: 80,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "white",
    marginLeft: 8, 
  },
  inputFreeText: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 120,
    backgroundColor: "white",
  },
report: {
  flexDirection: "row",
  alignItems: "center",
  textAlign: "right",
  justifyContent: "flex-end",
},


nameContainer: {
  flexDirection: "row-reverse",
  justifyContent: "flex-end",
  marginBottom: 16,
  justifyContent: "space-around",
},
name: {
  flex: 1,
  fontWeight: "bold",
  textAlign: "right",
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
    fontSize: 30,
    fontWeight: "bold",
    padding: 10,


},

subTitle: {
  fontSize: 24,
  textAlign: "right",
  fontWeight: "bold",
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
tableContainer: {
  width: '90%',
  marginBottom: 16,
  marginLeft: '5%',
  marginRight: '5%',}
  ,
tableHeader: {
flexDirection: "row",
justifyContent: "space-around",
alignItems: "center",
marginBottom: 8,
},
tableHeaderText:{
  textAlign: "right",
   fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: 'underline'
},
});
