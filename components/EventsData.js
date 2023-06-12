import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { Entypo } from "@expo/vector-icons";
import Navbar from "./Navbar";
import { AntDesign } from "@expo/vector-icons";


const { width } = Dimensions.get("window");


const EventsData = ({ route }) => {
  const { className, classId, category } = route.params;

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [dates, setDates] = useState([]);
  const [show, setShow] = useState(false);
   const [positiveIds, setPositiveIds] = useState([]);
  const [negativeIds, setNegativeIds] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [positiveResult, setPositiveResult] = useState([]);
  const [negativeResult, setNegativeResult] = useState([]);
  const [showPositive, setShowPositive] = useState(false);
  const [showNegative, setShowNegative] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [numOfStudents, setNumOfStudents]= useState(0);

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
    if (date < minDate ) {
      Alert.alert("", "לא ניתן להכניס תאריך קטן מה- 01/01/2023");
      return false;
    }

    if ( date > currentDate) {
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
    const positiveNames = [];
    const negativeNames = [];

    try {
      const eventseRef = collection(db, "Events");
      const eventsQueries = positiveIds.map((temp) =>
        query(eventseRef, where("__name__", "==", temp))
      );
      const eventsQuerySnapshots = await Promise.all(
       eventsQueries.map((q) => getDocs(q))
      );

      eventsQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            positiveNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().eventType,
              doc.data().notes,
            ]);
          }
        });
      });

      const positiveStudentsByCourse = positiveNames.reduce(
        (acc, [student, course, eventType, notes]) => {
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push({ student, eventType, notes });
          return acc;
        },
        {}
      );

      
      const result = Object.entries(positiveStudentsByCourse).reduce(
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

    setPositiveResult(result);
      setShowPositive(true);
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }

    try {
      const eventsRef = collection(db, "Events");
      const eventsQueries = negativeIds.map((temp) =>
        query(eventsRef, where("__name__", "==", temp))
      );
      const eventsQuerySnapshots = await Promise.all(
        eventsQueries.map((q) => getDocs(q))
      );

      eventsQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            negativeNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().eventType,
              doc.data().notes,
            ]);
          }
        });
      });

      const negativeStudentsByCourse = negativeNames.reduce(
        (acc, [student, course, eventType, notes]) => {
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push({ student, eventType, notes });
          return acc;
        },
        {}
      );

      const result = Object.entries(negativeStudentsByCourse).reduce(
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

      setNegativeResult(result);
      setShowNegative(true);

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
      Alert.alert("שגיאה בהכנסת הנתונים");
      return;
    }
  
    if (startDateTime > endDateTime) {
      Alert.alert("שגיאה", " שימו לב, הוכנס תאריך סיום קטן מתאריך ההתחלה  ");
      return;
    }
  
    let querySnapshot;
    if (startDate && endDate) {
      try {
        const positiveIdst = [];
        const negativeIdst = [];
  
        const presenceRef = collection(db, "Events");
  
        const q = query(
          presenceRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where("class_id", "==", classId)
        );

        querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length === 0) {
          Alert.alert("שגיאה", "אין דיווחים בתאריכים הללו");
          return;
        }
  
        querySnapshot.forEach((doc) => {
        if (doc.data().type === "positive") {
          positiveIdst.push(doc.id);
        } else if (doc.data().type === "negative") {
          negativeIdst.push(doc.id);
        }
        });

        setPositiveIds(positiveIdst);
        setNegativeIds(negativeIdst);
  
  
        const eventsDates = [];
        querySnapshot.docs.forEach(async (doc) => {
          if (doc.data().type === "negative" ||
          doc.data().type === "positive") {
            const docRef = doc.ref;
            const docSnapshot = await getDoc(docRef);
            const presenceValue = docSnapshot.data().date.toDate();
            const day = presenceValue.getDate().toString().padStart(2, "0");
            const month = (presenceValue.getMonth() + 1).toString().padStart(2, "0");
            const year = presenceValue.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
  
            if (!eventsDates.includes(formattedDate)) {
              eventsDates.push(formattedDate);
            }
          }
        });
  
        setDates(eventsDates)

        console.log(eventsDates)
       
        // const classDoc = await getDoc(doc(db, "Classes", classId));
        // const num = classDoc.data().numOfStudents || 1;
        // setNumOfStudents(num);
  
        // const days = countDays(startDate, endDate);
        // const temp = (lateIds.length * 100) / (numOfStudents * days);
        // const temp1 = (absentIds.length * 100) / (numOfStudents * days);
  
        // setLatePercentage(temp.toFixed(2));
        // setAbsentPercentage(temp1.toFixed(2));
        setShow(true);
      } 
      
      catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      }
    }
  };
  
  
 
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
        <Text style={styles.pageTitle}>היסטוריית אירועים - {className}</Text>
      </View>

      <View>
        <Text style={styles.subTitle}>מתאריך: </Text>
        <TextInput
          style={[styles.input, { textAlign: "right" }]}
          value={startDateString}
          onChangeText={handleChangeStartDate}
          placeholder="הכנס/י תאריך מהצורה (DD/MM/YYYY)"
        />
        {startDateString && !validDate && (
          <Text style={{ color: "red" }}>ערך לא תקין</Text>
        )}

        {validDate && <AntDesign name="check" size={24} color="green" />}
      </View>

      <View>
        <Text style={styles.subTitle}>עד תאריך: </Text>
        <TextInput
          style={[styles.input, { textAlign: "right" }]}
          value={endDateString}
          onChangeText={handleChangeEndDate}
          placeholder="הכנס/י תאריך מהצורה (DD/MM/YYYY)"
        />

        {endDateString && !validDateTwo && (
          <Text style={{ color: "red" }}>ערך לא תקין</Text>
        )}

        {validDateTwo && <AntDesign name="check" size={24} color="green" />}
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
  <TouchableOpacity onPress={handleExportData} style={styles.button}>
    <Text style={styles.buttonText}>הוצא נתונים</Text>
  </TouchableOpacity>

  {dates.map((item) => (
      <View key={item}>
        <TouchableOpacity onPress={() => check(item)} style={[styles.button, {backgroundColor: 'white'}]}>
          <Text style={styles.date}>{item}</Text>
        </TouchableOpacity>

      {selectedDate === item && (
        <View>
          {Object.entries(positiveResult).length > 0 && (
            <View style={{ alignItems: 'center' }}>
              <Text></Text>
              <Entypo name="emoji-happy" size={24} color="black" />
              {Object.entries(positiveResult).map(([course, students]) => (
                <View key={course}>
                  <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', textDecorationLine: 'underline' }}>{course}</Text>
                  {students.map(({ student, eventType, notes }) => (
                    <Text key={`${student}-${notes}`} style={{ fontSize: 16, textAlign: 'center' }}>
                      {student} - {eventType} {notes ? `(${notes})` : ""}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {Object.entries(negativeResult).length > 0 && (
            <View style={{ alignItems: 'center' }}>
              <Text></Text>
              <Entypo name="emoji-sad" size={24} color="black" />
              {Object.entries(negativeResult).map(([course, students]) => (
                <View key={course}>
                  <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', textDecorationLine: 'underline' }}>{course}</Text>
                  {students.map(({ student, eventType, notes }) => (
                    <Text key={`${student}-${notes}`} style={{ fontSize: 16, textAlign: 'center' }}>
                      {student} - {eventType} {notes ? `(${notes})` : ""}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  ))}

  <Text>{"\n\n\n\n\n\n"}</Text>
</ScrollView>



        <Navbar />
    </View>
  );
};
export default EventsData;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 36,
    fontWeight: "bold",
    padding: 10,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 20,
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
});
