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
import React, { useState } from "react";
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
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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
  const [show, setShow] = useState(false);
  const [numOfStudents, setNumOfStudents] = useState(0);
  const [dates, setDates] = useState([]);

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
currentDate.setDate(currentDate.getDate() + 1);
    const minDate = new Date("2023-01-01");
    if (date < minDate) {
      Alert.alert("", "לא ניתן להכניס תאריך קטן מה- 01/01/2023");
      return false;
    }

    if (date > currentDate) {
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

  const check = async (clickedDate) => {
    if (clickedDate === selectedDate) {
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }

    setClickedDate(clickedDate);

    const classDoc = await getDoc(doc(db, "Classes", classId));
    const num = classDoc.data().numOfStudents || 1;
    setNumOfStudents(num);

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
            acc[courseName] = {
              students: [],
              percent: 0,
            };
          }
          acc[courseName].students.push(studentName);
          return acc;
        },
        {}
      );

      Object.keys(lateStudentsByCourse).forEach((courseName) => {
        const studentslates = lateStudentsByCourse[courseName].students.length;
        const percent = (studentslates * 100) / numOfStudents;
        lateStudentsByCourse[courseName].percent = percent.toFixed(2);
      });
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
            acc[courseName] = {
              students: [],
              percent: 0,
            };
          }
          acc[courseName].students.push(studentName);
          return acc;
        },
        {}
      );

      Object.keys(absentStudentsByCourse).forEach((courseName) => {
        const studentsMissed =
          absentStudentsByCourse[courseName].students.length;
        const percent = (studentsMissed * 100) / numOfStudents;
        absentStudentsByCourse[courseName].percent = percent.toFixed(2);
      });

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

        const promises = [];
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
        const datesForExcel = [];
        const timestamps = [];

        querySnapshot.docs.forEach(async (doc) => {
          const presence = doc.data().presence;
          if (
            presence === "late" ||
            presence === "absent" ||
            presence === "present"
          ) {
            const docRef = doc.ref;
            const docSnapshot = await getDoc(docRef);
            const timestamp = docSnapshot.data().date;

            if (
              !timestamps.some(
                (existingTimestamp) =>
                  existingTimestamp.seconds === timestamp.seconds &&
                  existingTimestamp.nanoseconds === timestamp.nanoseconds
              )
            ) {
              timestamps.push(timestamp);
              datesForExcel.push(timestamp);
            }

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

            promises.push(getDoc(docRef));
          }
        });

        await Promise.all(promises);

        setPresenceDates(dates);
        setDates(datesForExcel);

        setShow(true);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      }
    }
  };

  const generateExcel = async () => {
    const wb = XLSX.utils.book_new();

    const boldCellStyle = {
      font: {
        bold: true,
      },
    };

    for (let i = 0; i < dates.length; i++) {
      const presenceValue = dates[i].toDate();
      const day = presenceValue.getDate().toString().padStart(2, "0");
      const month = (presenceValue.getMonth() + 1).toString().padStart(2, "0");
      const year = presenceValue.getFullYear();
      const sheetName = `${day}.${month}.${year}`;

      const presenceRef = collection(db, "Presence");
      const q = query(
        presenceRef,
        where("t_id", "==", auth.currentUser.uid),
        where("date", "==", presenceValue),
        where("class_id", "==", classId)
      );

      const querySnapshot = await getDocs(q);
      const sheetData = [];
      const courseNames = [];

      querySnapshot.forEach((doc) => {
        const { student_name, courseName, presence } = doc.data();
        if (!courseNames.includes(courseName)) {
          courseNames.push(courseName);
        }
        let presenceText = "";
        if (presence === "present") {
          presenceText = "נוכח/ת";
        } else if (presence === "late") {
          presenceText = "איחור";
        } else {
          presenceText = "חיסור";
        }
        sheetData.push([student_name, presenceText]);
      });

      const data = [courseNames, ...sheetData];
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws["A1"].s = boldCellStyle;

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const uri = FileSystem.cacheDirectory + "נוכחות.xlsx";

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Share Attendance",
    });
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
                    <Text style={styles.sectionTitle}>תלמידים מאחרים: </Text>
                    {Object.entries(lateStudentsByCourse).map(
                      ([courseName, courseData]) => (
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
                          {courseData.students &&
                            courseData.students.map((item) => (
                              <Text
                                style={{ fontSize: 16, textAlign: "center" }}
                                key={item}
                              >
                                {item}
                              </Text>
                            ))}
                          <Text
                            style={{
                              fontSize: 20,
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {courseData.percent}% תלמידים מאחרים
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}

                {Object.entries(absentStudentsByCourse).length > 0 && (
                  <View>
                    <Text></Text>
                    <Text style={styles.sectionTitle}>תלמידים מחסרים: </Text>
                    {Object.entries(absentStudentsByCourse).map(
                      ([courseName, courseData]) => (
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
                          {courseData.students &&
                            courseData.students.map((item) => (
                              <Text
                                style={{ fontSize: 16, textAlign: "center" }}
                                key={item}
                              >
                                {item}
                              </Text>
                            ))}
                          <Text
                            style={{
                              fontSize: 20,
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {courseData.percent}% תלמידים מחסרים
                          </Text>
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

        {show && (
          <View>
            <TouchableOpacity onPress={generateExcel} style={styles.button}>
              <AntDesign name="exclefile1" size={24} color="#AD8E70" />
              <Text style={[styles.buttonText, { fontSize: 20 }]}>
                ייצוא לאקסל{" "}
              </Text>
            </TouchableOpacity>
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
