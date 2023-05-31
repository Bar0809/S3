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
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { Entypo } from "@expo/vector-icons";

const EventsData = ({ route }) => {
  const { category } = route.params;

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [showIcons, setShowIcons] = useState(false);
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
  const [show, setShow] = useState(false);

  const [numOfStudents, setNumOfStudents]= useState(0);

  const handleDateClick = (date) => {
    setSelectedDate(date === selectedDate ? null : date);
  };
  const renderEventList = (date) => {
    const positiveEvents = positiveResult[date] || [];
    const negativeEvents = negativeResult[date] || [];

    return (
      <div>
        {positiveEvents.map((event, index) => (
          <div key={index}>{event.eventType}</div>
        ))}
        {negativeEvents.map((event, index) => (
          <div key={index}>{event.eventType}</div>
        ))}
      </div>
    );
  };

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
  
    const diffDays = Math.round((endDate - startDate) / oneDay) ;
  
    return diffDays;
  }

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
        const categoryRef = collection(db, "Events");
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid)
        );
        querySnapshot = await getDocs(q);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.error("Error exporting data:", error);
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
      });

      const evantsDates = [];
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          if (
            doc.data().type === "negative" ||
            doc.data().type === "positive"
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
        })
      );

      setDates(evantsDates);
      setShowIcons(true);

      const classId = querySnapshot.docs[0].data().class_id;
      const classDoc = await getDoc(doc(db, "Classes", classId));
      const num = classDoc.data().numOfStudents || 1;
      setNumOfStudents(num);
      const days= countDays(startDate, endDate);
      const positive = (positiveIdst.length*100)/ (numOfStudents*days);
      setPositivePercentage(positive.toFixed(2));
      const negative = (negativeIdst.length*100)/ (numOfStudents*days);
      setNegativePercentage(negative.toFixed(2));
      setShow(true);
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
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
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
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
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

    // Map the eventType values to Hebrew text
    const mappedResult = Object.entries(result).reduce(
      (acc, [course, students]) => {
        students.forEach(({ eventType, ...rest }) => {
          if (eventType === "academic Excellence") {
            eventType = "הצטיינות לימודית";
          } else if (eventType === "associateHonors") {
            eventType = "הצטיינות חברתית";
          }
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push({ eventType, ...rest });
        });
        return acc;
      },
      {}
    );

    setPositiveResult(mappedResult);
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

    // Map the eventType values to Hebrew text
    const mappedResult = Object.entries(result).reduce(
      (acc, [course, students]) => {
        students.forEach(({ eventType, ...rest }) => {
          if (eventType === "verbal violence") {
            eventType = "אלימות מילולית";
          } else if (eventType === "physical violence") {
            eventType = "אלימות פיזית";
          }
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push({ eventType, ...rest });
        });
        return acc;
      },
      {}
    );

    setNegativeResult(mappedResult);
  }, [displayNegative]);

  useEffect(() => {
    setShowPositive(true);
  }, [positiveResult]);

  useEffect(() => {
    setShowNegative(true);
  }, [negativeResult]);

  const renderDateList = () => {
    return dates.map((date) => (
      <div key={date}>
        <div onClick={() => handleDateClick(date)}>{date}</div>
        {selectedDate === date && renderEventList(date)}
      </div>
    ));
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

            <TouchableOpacity onPress={handleExportData}>
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
            {showIcons && (
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

            {showIcons && (
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

{show === true && (

<View>
  <Text style={styles.percentageData}>
    בטווח התאריכים הנ"ל ישנם 

  {positivePercentage}% של אירועים חיוביים
  </Text>
  <Text style={styles.percentageData}>
  בטווח התאריכים הנ"ל ישנם 

{negativePercentage}% של אירועים שליליים

  </Text>
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
