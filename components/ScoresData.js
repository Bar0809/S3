import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, SectionList,} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";


const ScoresData = () => {
  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [scoresDates, setScoresDates] = useState([]);
  const [scoresIds, setScoresIds] = useState([]);
  const [scoresStudentsForShow, setScoresStudentsForShow] = useState([]);
  const [resultObject, setResultObject] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  
  function parseDateString(inputString) {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

    const match = inputString.match(dateRegex);
    if (!match) {
      return false;
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
      return false;
    }

    if (month > 11) {
      return false;
    }

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (day > lastDayOfMonth) {
      return false;
    }

    const currentDate = new Date();
    const minDate = new Date("2023-01-01");
    if (date < minDate || date > currentDate) {
      Alert.alert('', 'לא ניתן להכניס תאריך עתידי')
      return false;
    }

    return true;
  }

  const handleChangeStartDate = (text) => {
    setStartDateString(text);
    setStartDate(parseDateString(text, "dd/mm/yyyy"));
    setValidDate(parseDateString(text));
  };

  const handleChangeEndDate = (text) => {
    setEndDateString(text);
    setEndDate(parseDateString(text, "dd/mm/yyyy"));
    setValidDateTwo(parseDateString(text));
  };

  const handleExportData = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    let querySnapshot;
  
    if (startDate && endDate) {
      try {
        const scoresRef = collection(db, "Scores");
        const q = query(
          scoresRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
        );
        querySnapshot = await getDocs(q);
        const scores = [];
  
        querySnapshot.forEach((doc) => {
          scores.push(doc.id);
        });
  
        setScoresIds(scores);
  
        const scoresDates = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const docRef = doc.ref;
            const docSnapshot = await getDoc(docRef);
            const scoresValue = docSnapshot.data().date.toDate();
            const day = scoresValue.getDate().toString().padStart(2, "0");
            const month = (scoresValue.getMonth() + 1).toString().padStart(2, "0");
            const year = scoresValue.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            if (!scoresDates.includes(formattedDate)) {
              scoresDates.push(formattedDate);
            }
          })
        );
  
        setScoresDates(scoresDates);
      } catch (error) {
        console.error("Error exporting data:", error);
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      }
    }
  };
  

  const check = async (clickedDate) => {
    if (clickedDate === selectedDate) {
      setSelectedDate(null); 
    } else {
      setSelectedDate(clickedDate); 
    }

    const dateParts = clickedDate.split("/");
    const dateObject = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const timestamp = dateObject.getTime() / 1000;
    const studentNames = [];

    try {
      const scoresRef = collection(db, "Scores");
      const scoresQueries = scoresIds.map((temp) =>
        query(scoresRef, where("__name__", "==", temp))
      );
      
      const scoresQuerySnapshots = await Promise.all(
        scoresQueries.map((q) => getDocs(q))
      );

      scoresQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            studentNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().exercise_name,
              doc.data().score,
              doc.data().note,
            ]);
          }
        });
      });

      setScoresStudentsForShow(studentNames);

      const result = scoresStudentsForShow.reduce(
        (acc, [student, course, exercise, score, note]) => {
          if (!acc[course]) {
            acc[course] = {};
          }
          if (!acc[course][exercise]) {
            acc[course][exercise] = [];
          }
          acc[course][exercise].push({ student, score, note });
          return acc;
        },
        {}
      );

      setResultObject(result);
    } 
    
    catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View>
        <View key={scoresDates.length}>
          <Toolbar />
          <Text style={{ fontSize: 20, padding: 10 }}>היסטוריית ציונים: </Text>
          <View>
            <Text>מתאריך: </Text>
            <TextInput
              style={[styles.input, { textAlign: "right" }]}
              value={startDateString}
              onChangeText={handleChangeStartDate}
              placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)"
            />
            {validDate ? (
              <Text style={{ color: "green" }}>Correct date</Text>
            ) : (
              <Text style={{ color: "red" }}>Incorrect date</Text>
            )}

            <Text>עד תאריך: </Text>
            <TextInput
              style={[styles.input, { textAlign: "right" }]}
              value={endDateString}
              onChangeText={handleChangeEndDate}
              placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)"
            />
            {validDateTwo ? (
              <Text style={{ color: "green" }}>Correct date</Text>
            ) : (
              <Text style={{ color: "red" }}>Incorrect date</Text>
            )}

            <TouchableOpacity onPress={handleExportData}>
              <Text style={styles.continueButtonText}>הוצא נתונים</Text>
            </TouchableOpacity>

          
          </View>

          

          {scoresDates.map((item) => (
            <TouchableOpacity onPress={() => check(item)} key={item}>
              <View style={styles.dateItem}>
                <Text style={styles.dateText}>{item}</Text>
              </View>
              {selectedDate === item && (
                <View>
                  {Object.entries(resultObject).map(
                    ([courseName, exercises]) => (
                      <View key={courseName}>
                        <Text style={{ fontWeight: "bold" }}>
                          Course: {courseName}
                        </Text>
                        {Object.entries(exercises).map(
                          ([exerciseName, scores]) => (
                            <View key={exerciseName}>
                              <Text style={{ fontWeight: "bold" }}>
                                Exercise: {exerciseName}
                              </Text>
                              {scores.map(({ student, score, note }, index) => (
                                <Text key={index}>
                                  - {student}: {score}
                                  {note ? ` (${note})` : ""}
                                </Text>
                              ))}
                            </View>
                          )
                        )}
                      </View>
                    )
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ScoresData;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  continueButtonText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
  dateItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 12,
    borderRadius: 10,
  },
});
