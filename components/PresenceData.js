import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  SectionList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const PresenceData = () => {
  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [presenceDates, setPresenceDates] = useState([]);

  // const [lateStudents, setLateStudents] = useState([]);
  // const [absentStudents, setAbsentStudents] = useState([]);

  const [lateIds, setLateIds] = useState([]);
  const [absentIds, setAbsentIds] = useState([]);
  const [showLateStudents, setShowLateStudents] = useState(false);
  const [showAbsentStudents, setShowAbsentStudents] = useState(false);
  const [lateStudentsForShow, setLateStudentsForShow] = useState([]);
  const [absentStudentsForShow, setAbsenteStudentsForShow] = useState([]);
  const [lateStudentsByCourse, setLateStudentsByCourse] = useState({});
  const [absentStudentsByCourse, setAbsentStudentsByCourse] = useState({});

  function parseDateString(inputString) {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

    const match = inputString.match(dateRegex);

    if (!match) {
      return false;
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
      return false;
    }

    // Check if the month is valid
    if (month > 11) {
      return false;
    }

    // Check if the day is valid for the given month and year
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (day > lastDayOfMonth) {
      return false;
    }

    // Check if the date is within the desired range
    const currentDate = new Date();
    const minDate = new Date("2023-01-01");
    if (date < minDate || date > currentDate) {
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

  const check = async (clickedDate) => {
    const dateParts = clickedDate.split("/");
    const dateObject = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const timestamp = dateObject.getTime() / 1000;
    const lateStudentsNames = [];
    const absentStudentsNames = [];

    try {
      const presenceRef = collection(db, "Presence");
      for (const temp of lateIds) {
        const q = query(presenceRef, where("__name__", "==", temp));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds)
            lateStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
            ]);
        });
      }

      setLateStudentsForShow(lateStudentsNames);
      const lateStudentsByCourse = lateStudentsNames.reduce(
        (acc, [studentName, courseName]) => {
          if (!acc[courseName]) {
            acc[courseName] = [];
          }
          acc[courseName].push(studentName);
          return acc;
        },
        {}
      );
      setLateStudentsByCourse(lateStudentsByCourse);
      setShowLateStudents(true);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }

    try {
      const presenceRef = collection(db, "Presence");
      for (const temp1 of absentIds) {
        const q = query(presenceRef, where("__name__", "==", temp1));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds)
            absentStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
            ]);
        });
      }
      const absentStudentsByCourse = absentStudentsNames.reduce(
        (acc, [studentName, courseName]) => {
          if (!acc[courseName]) {
            acc[courseName] = [];
          }
          acc[courseName].push(studentName);
          return acc;
        },
        {}
      );
      setAbsenteStudentsForShow(absentStudentsNames);
      setAbsentStudentsByCourse(absentStudentsByCourse);
      setShowAbsentStudents(true);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }
  };

  useEffect(() => {}, [presenceDates]);

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
        const presenceRef = collection(db, "Presence");
        const q = query(
          presenceRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime)
        );
        querySnapshot = await getDocs(q);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
      }

      const lateIdst = [];
      const absentIdst = [];

      querySnapshot.forEach((doc) => {
        const presence = doc.data().presence;
        if (presence === "late") {
          lateIdst.push(doc.id);
        } else if (presence === "absent") {
          absentIdst.push(doc.id);
        }
      });

      setAbsentIds(absentIdst);
      setLateIds(lateIdst);

      const presenceDates = [];
      querySnapshot.forEach(async (doc) => {
        const presence = doc.data().presence;
        if (presence === "late" || presence === "absent") {
          const docRef = doc.ref;
          const docSnapshot = await getDoc(docRef);
          const presenceValue = docSnapshot.data().date.toDate();
          const day = presenceValue.getDate().toString().padStart(2, "0");
          const month = (presenceValue.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = presenceValue.getFullYear();
          const formattedDate = `${day}/${month}/${year}`;
          
          if (!presenceDates.includes(formattedDate)) {
            presenceDates.push(formattedDate);
          }
        }
        setPresenceDates(presenceDates);
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View>
        <View key={presenceDates.length}>
          <Toolbar />
          <Text style={{ fontSize: 20, padding: 10 }}>היסטוריית נוכחות: </Text>
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

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleExportData}
            >
              <Text style={styles.continueButtonText}>הוצא נתונים</Text>
            </TouchableOpacity>
          </View>
          {presenceDates.map((item) => (
            <TouchableOpacity onPress={() => check(item)} key={item}>
              <View style={styles.dateItem}>
                <Text style={styles.dateText}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {showLateStudents && (
            <View>
              <Text style={styles.sectionTitle}>Late Students:</Text>
              {Object.entries(lateStudentsByCourse).map(
                ([courseName, students]) => (
                  <View key={courseName}>
                    <Text style={{ fontWeight: "bold" }}>{courseName}</Text>
                    {students.map((item) => (
                      <Text key={item}>{item}</Text>
                    ))}
                  </View>
                )
              )}
            </View>
          )}

          {showAbsentStudents && (
            <View>
              <Text style={styles.sectionTitle}>Absent Students:</Text>
              {Object.entries(absentStudentsByCourse).map(
                ([courseName, students]) => (
                  <View key={courseName}>
                    <Text style={{ fontWeight: "bold" }}>{courseName}</Text>
                    {students.map((item) => (
                      <Text key={item}>{item}</Text>
                    ))}
                  </View>
                )
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default PresenceData;

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
