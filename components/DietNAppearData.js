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
import { Entypo } from "@expo/vector-icons";

const DietNAppearData = ({ route }) => {
  const { category } = route.params;

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [dates, setDates] = useState([]);
  const [display, setDisplay] = useState([]);
  const [finalResult, setFinalResult] = useState([]);
  const [ids, setIds] = useState([]);
  const [show, setShow] = useState(false);

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
      const tempIds = [];

      if (category === "Diet") {
        querySnapshot.forEach((doc) => {
          if (doc.data().diet === "bed") {
            tempIds.push(doc.id);
          }
          setIds(tempIds);

          const categoryDates = [];
          querySnapshot.forEach(async (doc) => {
            if (doc.data().diet === "bed") {
              const docRef = doc.ref;
              const docSnapshot = await getDoc(docRef);
              const moodsValue = docSnapshot.data().date.toDate();
              const day = moodsValue.getDate().toString().padStart(2, "0");
              const month = (moodsValue.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = moodsValue.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;
              if (!categoryDates.includes(formattedDate)) {
                categoryDates.push(formattedDate);
              }
            }
            setDates(categoryDates);
          });
        });
      } else if (category === "Appearances") {
        querySnapshot.forEach((doc) => {
          if (doc.data().appearances === "bed") {
            tempIds.push(doc.id);
          }
          setIds(tempIds);

          const tempIds = [];
          querySnapshot.forEach(async (doc) => {
            if (doc.data().appearances === "bed") {
              const docRef = doc.ref;
              const docSnapshot = await getDoc(docRef);
              const moodsValue = docSnapshot.data().date.toDate();
              const day = moodsValue.getDate().toString().padStart(2, "0");
              const month = (moodsValue.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = moodsValue.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;
              if (!categoryDates.includes(formattedDate)) {
                categoryDates.push(formattedDate);
              }
            }
            setDates(categoryDates);
          });
        });
      }
    }
  };

  const check = async (clickedDate) => {
    setShow(false);

    const dateParts = clickedDate.split("/");
    const dateObject = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const timestamp = dateObject.getTime() / 1000;

    const names = [];

    try {
      const moodsRef = collection(db, category);
      const queries = ids.map((temp) =>
        query(moodsRef, where("__name__", "==", temp))
      );
      const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));

      querySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            names.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().note,
            ]);
          }
        });
      });

      setDisplay(names);

      const result = display.reduce((acc, [student, course, note]) => {
        if (!acc[course]) {
          acc[course] = [];
        }
        acc[course].push({ student, note });
        return acc;
      }, {});

      setFinalResult(result);
      setShow(true);
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
            {finalResult && Object.keys(finalResult).length > 0 && (
              <View>
                <Entypo name="emoji-sad" size={24} color="black" />
                {Object.entries(finalResult).map(([course, students]) => (
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

export default DietNAppearData;
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
