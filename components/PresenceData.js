import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  SectionList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Toolbar from "./Toolbar";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./firebase";

const PresenceData = () => {
  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [presenceDates, setPresenceDates] = useState([]);
  const [lateIds, setLateIds] = useState([]);
  const [absentIds, setAbsentIds] = useState([]);
  const [showLateStudents, setShowLateStudents] = useState(false);
  const [showAbsentStudents, setShowAbsentStudents] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [clickedDate, setClickedDate] = useState(null);
  const [lateStudentsByCourse, setLateStudentsByCourse] = useState({});
  const [absentStudentsByCourse, setAbsentStudentsByCourse] = useState({});
  const [latePercentage, setLatePercentage] = useState(0);
  const [absentPercentage, setAbsentPercentage] = useState(0);
  const [show, setShow] = useState(false);
  const [numOfStudents, setNumOfStudents] = useState(0);

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
      Alert.alert("", "לא ניתן להכניס תאריך עתידי");
      return false;
    }

    return true;
  }

  const handleChangeStartDate = (text) => {
    setStartDateString(text);
    const startDateArray = text.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    setStartDate(startDateTime);
    setValidDate(parseDateString(text));
  };

  const handleChangeEndDate = (text) => {
    setEndDateString(text);
    const endDateArray = text.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);
    setEndDate(endDateTime);
    setValidDateTwo(parseDateString(text));
  };

  function countDays(startDate, endDate) {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new Error("startDate and endDate must be Date objects");
    }
    const oneDay = 24 * 60 * 60 * 1000;

    startDate.setHours(0, 0, 0, 0);

    endDate.setHours(23, 59, 59, 999);

    const diffDays = Math.round((endDate - startDate) / oneDay);
    return diffDays;
  }

  const check = async (clickedDate) => {
    if (clickedDate === selectedDate) {
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }

    setClickedDate(clickedDate);

    const dateParts = clickedDate.split("/");
    const dateObject = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const timestamp = dateObject.getTime() / 1000;
    const lateStudentsNames = [];
    const absentStudentsNames = [];

    try {
      const presenceRef = collection(db, "Presence");
      const presenceQueries = lateIds.map((temp) =>
        query(presenceRef, where("__name__", "==", temp))
      );
      const presenceQuerySnapshots = await Promise.all(
        presenceQueries.map((q) => getDocs(q))
      );

      presenceQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            lateStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
            ]);
          }
        });
      });

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
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }

    try {
      const presenceRef = collection(db, "Presence");
      const presenceQueries = absentIds.map((temp) =>
        query(presenceRef, where("__name__", "==", temp))
      );
      const presenceQuerySnapshots = await Promise.all(
        presenceQueries.map((q) => getDocs(q))
      );

      presenceQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            absentStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
            ]);
          }
        });
      });

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
      setAbsentStudentsByCourse(absentStudentsByCourse);
      setShowAbsentStudents(true);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }
  };

  const handleExportData = async () => {
    const startDateArray = startDateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
    const endDateArray = endDateString.split("/");
    const endDateISO = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const endDateTime = new Date(endDateISO);

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      Alert.alert("Invalid date format");
      return;
    }
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const lateIdst = [];
        const absentIdst = [];

        const presenceRef = collection(db, "Presence");
        const q = query(
          presenceRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid)
        );
        querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          if (doc.data().presence === "late") {
            lateIdst.push(doc.id);
          }
          if (doc.data().presence === "absent") {
            absentIdst.push(doc.id);
          }
        });

        setAbsentIds(absentIdst);
        setLateIds(lateIdst);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      }

      const dates = [];
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
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

            if (!dates.includes(formattedDate)) {
              dates.push(formattedDate);
            }
          }
        })
      );
      setPresenceDates(dates);
      const classId = querySnapshot.docs[0].data().class_id;
      const classDoc = await getDoc(doc(db, "Classes", classId));
      const num = classDoc.data().numOfStudents || 1;
      setNumOfStudents(num);
      const days = countDays(startDate, endDate);
      const temp = (lateIds.length * 100) / (numOfStudents * days);
      setLatePercentage(temp.toFixed(2));
      const temp1 = (absentIds.length * 100) / (numOfStudents * days);
      setAbsentPercentage(temp1.toFixed(2));
      setShow(true);
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

            <TouchableOpacity onPress={handleExportData}>
              <Text style={styles.continueButtonText}>הוצא נתונים</Text>
            </TouchableOpacity>
          </View>

          {presenceDates.map((item) => (
            <TouchableOpacity onPress={() => check(item)} key={item}>
              <View style={styles.dateItem}>
                <Text style={styles.dateText}>{item}</Text>
              </View>
              {selectedDate === item && (
                <View>
                  {Object.entries(lateStudentsByCourse).length > 0 && (
                    <View>
                      <Text></Text>
                      <Text style={styles.sectionTitle}>תלמידים מאחרים:</Text>
                      {Object.entries(lateStudentsByCourse).map(
                        ([courseName, students]) => (
                          <View key={courseName}>
                            <Text style={{ fontWeight: "bold" }}>
                              {courseName}
                            </Text>
                            {students.map((item) => (
                              <Text key={item}>{item}</Text>
                            ))}
                          </View>
                        )
                      )}
                    </View>
                  )}

                  {Object.entries(absentStudentsByCourse).length > 0 && (
                    <View>
                      <Text></Text>
                      <Text style={styles.sectionTitle}>תלמידים חסרים:</Text>
                      {Object.entries(absentStudentsByCourse).map(
                        ([courseName, students]) => (
                          <View key={courseName}>
                            <Text style={{ fontWeight: "bold" }}>
                              {courseName}
                            </Text>
                            {students.map((item) => (
                              <Text key={item}>{item}</Text>
                            ))}
                          </View>
                        )
                      )}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}

          {show === true && (
            <View>
              <Text style={styles.percentageData}>
                בטווח התאריכים הנ"ל ישנם
                {latePercentage}% מאחרים
              </Text>

              <Text style={styles.percentageData}>
                בטווח התאריכים הנ"ל ישנם
                {absentPercentage}% מחסרים
              </Text>
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
  percentageData: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
