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

const EventsData = () => {
  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [dates, setDates] = useState([]);
  const [displayNegative, setDisplayNegative] = useState([]);
  const [displayPositive, setDisplayPositive] = useState([]);
  const [positiveResult, setPositiveResult] = useState([]);
  const [negativeResult, setNegativeResult] = useState([]);
  const [positiveIds, setPositiveIds] = useState([]);
  const [negativeIds, setNegativeIds] = useState([]);
  const [showPositive, setShowPositive] = useState(false);
  const [showNegative, setShowNegative] = useState(false);

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
        const categoryRef = collection(db, "Events");
        //  const q = query(categoryRef);

        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime)
        );
        querySnapshot = await getDocs(q);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
      }

      const positiveIdst = [];
      const negativeIdst = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().type === "positive") {
          positiveIdst.push(doc.id);
        } else if (doc.data().type === "negative") {
          negativeIdst.push(doc.id);
        }
        setPositiveIds(positiveIdst);
        setNegativeIds(negativeIdst);

        const evantsDates = [];
        querySnapshot.forEach(async (doc) => {
          if (
            doc.data().type === "positive" ||
            doc.data().type === "negative"
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
            if (!evantsDates.includes(formattedDate)) {
              evantsDates.push(formattedDate);
            }
          }

          setDates(evantsDates);
        });
      });
    }
  };

  const check = async (clickedDate) => {
    const dateParts = clickedDate.split("/");
    const dateObject = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const timestamp = dateObject.getTime() / 1000;

    const positiveEventsStudentsNames = [];
    const negativeEventsStudentsNames = [];

    try {
      const moodsRef = collection(db, "Events");
      const positiveQueries = positiveIds.map((temp) =>
        query(moodsRef, where("__name__", "==", temp))
      );
      const positiveQuerySnapshots = await Promise.all(
        positiveQueries.map((q) => getDocs(q))
      );

      positiveQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            positiveEventsStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().eventType,
              doc.data().notes,
            ]);
          }
        });
      });

      setDisplayPositive(positiveEventsStudentsNames);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }

    try {
      const moodsRef = collection(db, "Events");
      const negativeQueries = negativeIds.map((temp) =>
        query(moodsRef, where("__name__", "==", temp))
      );
      const negativeQuerySnapshots = await Promise.all(
        negativeQueries.map((q) => getDocs(q))
      );

      negativeQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            negativeEventsStudentsNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().eventType,
              doc.data().notes,
            ]);
          }
        });
      });

      setDisplayNegative(negativeEventsStudentsNames);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
    }
  };

  useEffect(() => {
    const result = displayPositive.reduce(
      (acc, [student, course, eventType, notes]) => {
        if (!acc[course]) {
          acc[course] = [];
        }
        acc[course].push({ student, eventType, notes });
        return acc;
      },
      {}
    );
    setPositiveResult(result);
  }, [displayPositive]);

  useEffect(() => {
    const result = displayNegative.reduce(
      (acc, [student, course, eventType, notes]) => {
        if (!acc[course]) {
          acc[course] = [];
        }
        acc[course].push({ student, eventType, notes });
        return acc;
      },
      {}
    );
    setNegativeResult(result);
  }, [displayNegative]);

  useEffect(() => {
    setShowPositive(true);
  }, [positiveResult]);

  useEffect(() => {
    setShowNegative(true);
  }, [negativeResult]);
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
            {showPositive && (
              <View>
                <Entypo name="emoji-neutral" size={24} color="black" />
                {Object.entries(positiveResult).map(([course, students]) => (
                  <View key={course}>
                    <Text style={{ fontWeight: "bold" }}>{course}</Text>
                    {students.map(({ student, eventType, notes }) => (
                      <Text key={`${student}-${notes}`}>
                        {student} {eventType} {notes ? `(${notes})` : ""}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {showNegative && (
              <View>
                <Entypo name="emoji-sad" size={24} color="black" />
                {Object.entries(negativeResult).map(([course, students]) => (
                  <View key={course}>
                    <Text style={{ fontWeight: "bold" }}>{course}</Text>
                    {students.map(({ student, eventType, notes }) => (
                      <Text key={`${student}-${notes}`}>
                        {student} {eventType} {notes ? `(${notes})` : ""}
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

export default EventsData;

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
