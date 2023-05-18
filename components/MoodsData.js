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
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Entypo } from "@expo/vector-icons";

const MoodsData = ({ route }) => {
  const { category } = route.params;

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [dates, setDates] = useState([]);
  const [displayBed, setDisplayBed] = useState([]);
  const [displayMedium, setDisplayMedium] = useState([]);
  const [mediumResult, setMediumResult] = useState([]);
  const [bedResult, setBedResult] = useState([]);
  const [mediumIds, setMediumIds] = useState([]);
  const [bedIds, setBedIds] = useState([]);
  const [showMedium, setShowMedium] = useState(false);
  const [showBed, setShowBed] = useState(false);

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
        const categoryRef = collection(db, category);
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime)
        );
        querySnapshot = await getDocs(q);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
      }
      const mediumIdst = [];
      const bedIdst = [];
      if (category === "Mood") {
        querySnapshot.forEach((doc) => {
          if (doc.data().mood === "medium") {
            mediumIdst.push(doc.id);
          } else if (doc.data().mood === "bed") {
            bedIdst.push(doc.id);
          }
          setMediumIds(mediumIdst);
          setBedIds(bedIdst);
          const moodsDates = [];
          querySnapshot.forEach(async (doc) => {
            if (doc.data().mood === "medium" || doc.data().mood === "bed") {
              const docRef = doc.ref;
              const docSnapshot = await getDoc(docRef);
              const moodsValue = docSnapshot.data().date.toDate();
              const day = moodsValue.getDate().toString().padStart(2, "0");
              const month = (moodsValue.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = moodsValue.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;
              if (!moodsDates.includes(formattedDate)) {
                moodsDates.push(formattedDate);
              }
            }
            setDates(moodsDates);
          });
        });
      } else if (category === "FriendStatus") {
        querySnapshot.forEach((doc) => {
          if (doc.data().friendStatus === "medium") {
            mediumIdst.push(doc.id);
          } else if (doc.data().friendStatus === "bed") {
            bedIdst.push(doc.id);
          }
          setMediumIds(mediumIdst);
          setBedIds(bedIdst);
          const moodsDates = [];
          querySnapshot.forEach(async (doc) => {
            if (
              doc.data().friendStatus === "medium" ||
              doc.data().friendStatus === "bed"
            ) {
              const docRef = doc.ref;
              const docSnapshot = await getDoc(docRef);
              const moodsValue = docSnapshot.data().date.toDate();
              const day = moodsValue.getDate().toString().padStart(2, "0");
              const month = (moodsValue.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = moodsValue.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;
              if (!moodsDates.includes(formattedDate)) {
                moodsDates.push(formattedDate);
              }
            }
            setDates(moodsDates);
          });
        });
      }
    }
  };

  const check = async (clickedDate) => {
    setShowMedium(false);
    setShowBed(false);

    const dateParts = clickedDate.split("/");
    const dateObject = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const timestamp = dateObject.getTime() / 1000;

    const mediumStudentsNames = [];
    const bedStudentsNames = [];

    try {
      const moodsRef = collection(db, category);
      const mediumQueries = mediumIds.map((temp) =>
        query(moodsRef, where("__name__", "==", temp))
      );
      const mediumQuerySnapshots = await Promise.all(
        mediumQueries.map((q) => getDocs(q))
      );

      mediumQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            mediumStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().note,
            ]);
          }
        });
      });

      setDisplayMedium(mediumStudentsNames);

      const result = displayMedium.reduce((acc, [student, course, note]) => {
        if (!acc[course]) {
          acc[course] = [];
        }
        acc[course].push({ student, note });
        return acc;
      }, {});

      setMediumResult(result);
      setShowMedium(true);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }

    try {
      const moodsRef = collection(db, category);
      const bedQueries = bedIds.map((temp) =>
        query(moodsRef, where("__name__", "==", temp))
      );
      const bedQuerySnapshots = await Promise.all(
        bedQueries.map((q) => getDocs(q))
      );

      bedQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            bedStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().note,
            ]);
          }
        });
      });

      setDisplayBed(bedStudentsNames);

      const result1 = displayBed.reduce((acc, [student, course, note]) => {
        if (!acc[course]) {
          acc[course] = [];
        }
        acc[course].push({ student, note });
        return acc;
      }, {});

      setBedResult(result1);
      setShowBed(true);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View>
        <View key={dates.length}>
          <Toolbar />
          <Text style={{ fontSize: 20, padding: 10 }}>היסטוריה </Text>
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

          {dates.map((item) => (
            <TouchableOpacity onPress={() => check(item)} key={item}>
              <View style={styles.dateItem}>
                <Text style={styles.dateText}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View>
            {mediumResult && Object.keys(mediumResult).length > 0 && (
              <View>
                <Entypo name="emoji-neutral" size={24} color="black" />
                {Object.entries(mediumResult).map(([course, students]) => (
                  <View key={course}>
                    <Text style={{ fontWeight: "bold" }}>{course}</Text>
                    {students.map(({ student, note }) => (
                      <Text key={`${student}-${note}`}>
                        {student} {note ? `(${note})` : ""}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View>
            {bedResult && Object.keys(bedResult).length > 0 && (
              <View>
                <Entypo name="emoji-sad" size={24} color="black" />
                {Object.entries(mediumResult).map(([course, students]) => (
                  <View key={course}>
                    <Text style={{ fontWeight: "bold" }}>{course}</Text>
                    {students.map(({ student, note }) => (
                      <Text key={`${student}-${note}`}>
                        {student} {note ? `(${note})` : ""}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MoodsData;
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
