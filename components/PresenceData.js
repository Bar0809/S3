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
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { AntDesign } from "@expo/vector-icons";
import Navbar from "./Navbar";

const { width } = Dimensions.get("window");

const PresenceData = ({ route }) => {
  const { className, classId, category } = route.params;

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [presenceDates, setPresenceDates] = useState([]);
  const [lateIds, setLateIds] = useState([]);
  const [absentIds, setAbsentIds] = useState([]);
  const [presentIds, setPresentIds] = useState([]);

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
        const lateIdst = [];
        const absentIdst = [];
        const presentIdst = [];
  
        const presenceRef = collection(db, "Presence");
  
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
          if (doc.data().presence === "late") {
            lateIdst.push(doc.id);
          }
          if (doc.data().presence === "absent") {
            absentIdst.push(doc.id);
          }
          if (doc.data().presence === "present") {
            presentIdst.push(doc.id);
          }
        });
  
        setAbsentIds(absentIdst);
        setLateIds(lateIdst);
        setPresentIds(presentIdst);
  
        const dates = [];
        querySnapshot.docs.forEach(async (doc) => {
          const presence = doc.data().presence;
          if (presence === "late" || presence === "absent" || presence === "present") {
            const docRef = doc.ref;
            const docSnapshot = await getDoc(docRef);
            const presenceValue = docSnapshot.data().date.toDate();
            const day = presenceValue.getDate().toString().padStart(2, "0");
            const month = (presenceValue.getMonth() + 1).toString().padStart(2, "0");
            const year = presenceValue.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
  
            if (!dates.includes(formattedDate)) {
              dates.push(formattedDate);
            }
          }
        });
  
        setPresenceDates(dates);
        const classDoc = await getDoc(doc(db, "Classes", classId));
        const num = classDoc.data().numOfStudents || 1;
        setNumOfStudents(num);
  
        const days = countDays(startDate, endDate);
        const temp = (lateIds.length * 100) / (numOfStudents * days);
        const temp1 = (absentIds.length * 100) / (numOfStudents * days);
  
        setLatePercentage(temp.toFixed(2));
        setAbsentPercentage(temp1.toFixed(2));
        setShow(true);
      } catch (error) {
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
        <Text style={styles.pageTitle}>היסטוריית נוכחות - {className}</Text>
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

        {presenceDates.map((item) => (
          <View key={item}>
            <TouchableOpacity
              onPress={() => check(item)}
              style={[styles.button, { backgroundColor: "white" }]}
            >
              <View>
                <Text style={styles.buttonText}>{item}</Text>
              </View>
            </TouchableOpacity>

            {selectedDate === item && (
              <View>
                {Object.entries(lateStudentsByCourse).length > 0 && (
                  <View>
                    <Text></Text>
                    <Text style={styles.sectionTitle}>תלמידים מאחרים:</Text>
                    {Object.entries(lateStudentsByCourse).map(
                      ([courseName, students]) => (
                        <View key={courseName}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              textAlign: "center",
                              fontSize: 16,
                              textDecorationLine: "underline",
                            }}
                          >
                            {courseName}
                          </Text>
                          {students.map((item) => (
                            <Text
                              style={{ fontSize: 16, textAlign: "center" }}
                              key={item}
                            >
                              {item}
                            </Text>
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
                          <Text
                            style={{
                              fontWeight: "bold",
                              textAlign: "center",
                              fontSize: 16,
                              textDecorationLine: "underline",
                            }}
                          >
                            {courseName}
                          </Text>
                          {students.map((item) => (
                            <Text
                              style={{ fontSize: 16, textAlign: "center" }}
                              key={item}
                            >
                              {item}
                            </Text>
                          ))}
                        </View>
                      )
                    )}
                  </View>
                )}

                {Object.entries(lateStudentsByCourse).length === 0 &&
                  Object.entries(absentStudentsByCourse).length === 0 && (
                    <View>
                      <Text style={{ fontSize: 14, textAlign: "center" }}>
                        כל התלמידים נכחו בשיעור בתאריך זה
                      </Text>
                    </View>
                  )}
              </View>
            )}
          </View>
        ))}

        {show === true && (
          <View>
            <Text style={styles.percentageData}>
              בטווח התאריכים הנ"ל ישנם {latePercentage}% מאחרים
            </Text>

            <Text style={styles.percentageData}>
              בטווח התאריכים הנ"ל ישנם {absentPercentage}% מחסרים
            </Text>
          </View>
        )}

        <Text>{"\n\n\n\n\n\n"}</Text>
      </ScrollView>

      <Navbar />
    </View>
  );
};

export default PresenceData;

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
