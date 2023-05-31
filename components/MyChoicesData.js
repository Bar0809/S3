import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, getDoc , doc} from "firebase/firestore";
import { db, auth } from "./firebase";
import { Entypo } from "@expo/vector-icons";

const MyChoicesData = ({ route }) => {
  const { category } = route.params;
  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [dates, setDates] = useState([]);
  const [Ids, setIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [clickedDate, setClickedDate] = useState(null);
  const [icons, setIcons] = useState([]);
  const [result, setResult] = useState([]);
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [numOfStudents, setNumOfStudents]= useState(0);
  const [classDoc, setClassDoc] = useState();


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
        const Idst = [];

        const myChoiceRef = collection(db, category);
        const q = query(
          myChoiceRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid)
        );
        querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          Idst.push(doc.id);
        });

        setIds(Idst);
      }
       catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.error("Error exporting data:", error);
      }

      const dates = [];
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
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
        })
      );
      setDates(dates);
      const classId = querySnapshot.docs[0].data().class_id;
          const temp = await getDoc(doc(db, "Classes", classId));
          setClassDoc(temp);

      try {
        const iconsRef = collection(db, "users");
        const q = query(iconsRef, where("t_id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const icons = [];
        querySnapshot.forEach((doc) => {
          const icon1 = doc.data().icons1;
          icons.push(icon1);
          const icon2 = doc.data().icons2;
          icons.push(icon2);
        });
        setIcons(icons);

        if (category === "MyChoice1") {
          setIcon(icons[0]);
        } else if (category === "MyChoice2") {
          setIcon(icons[1]);
        }
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.error("Error exporting data:", error);
      }
    }
  };

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
    const names = [];

    try {
      const myChoiceRef = collection(db, category);
      const Queries = Ids.map((temp) =>
        query(myChoiceRef, where("__name__", "==", temp))
      );
      const querySnapshots = await Promise.all(Queries.map((q) => getDocs(q)));

      querySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            if (
              (icons[0] === true &&
                doc.data().myChoice === "bed" &&
                category === "MyChoice1") ||
              (icons[1] === true &&
                doc.data().myChoice === "bed" &&
                category === "MyChoice2")
            ) {
              names.push([
                doc.data().student_name,
                doc.data().courseName,
                doc.data().note,
              ]);
            } else if (
              (icons[0] === false && category === "MyChoice1") ||
              (icons[1] === false && category === "MyChoice2")
            ) {
              names.push([
                doc.data().student_name,
                doc.data().courseName,
                doc.data().myChoice,
              ]);
            }
          }
        });
      });


      if (
        (icons[1] === false && category === "MyChoice2") ||
        (icons[0] === false && category === "MyChoice1")
      ) {
        const result1 = names.reduce((acc, [student, course, myChoice]) => {
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push({ student, myChoice });
          return acc;
        }, {});
        setResult(result1);
      } else if (
        (icons[1] === true && category === "MyChoice2") ||
        (icons[0] === true && category === "MyChoice1")
      ) {
        const result1 = names.reduce((acc, [student, course, note]) => {
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push({ student, note });
          return acc;
        }, {});
        setResult(result1);

        const num = classDoc.data().numOfStudents || 1;
        setNumOfStudents(num);
        setPercentage(0);
        const days= countDays(startDate, endDate);
        const temp = (names.length*100)/ (numOfStudents*days);
        setPercentage(temp.toFixed(2));
        setShow(true);

      }

    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
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

            <TouchableOpacity onPress={handleExportData}>
              <Text style={styles.continueButtonText}>הוצא נתונים</Text>
            </TouchableOpacity>
          </View>
          {dates.map((item) => (
            <TouchableOpacity onPress={() => check(item)} key={item}>
              <View style={styles.dateItem}>
                <Text style={styles.dateText}>{item}</Text>
              </View>
              {selectedDate === item && (
                <View>
                  {Object.entries(result).length > 0 &&
                    icon ===
                      true && (
                        <View>
                          <Text></Text>
                          <Entypo name="emoji-sad" size={24} color="black" />
                          {Object.entries(result).map(
                            ([courseName, students]) => (
                              <View key={courseName}>
                                <Text style={{ fontWeight: "bold" }}>
                                  {courseName}
                                </Text>
                                {students.map((student, index) => (
                                  <Text key={`${student}-${index}`}>
                                    {student.student}{" "}
                                    {student.note ? `(${student.note})` : ""}
                                  </Text>
                                ))}
                              </View>
                            )
                          )}
                        </View>
                      )}
                      
                      {Object.entries(result).length > 0 &&
  icon === false && (
    <View>
      <Text></Text>
      {Object.entries(result).map(([courseName, students]) => (
        <View key={courseName}>
          <Text style={{ fontWeight: "bold" }}>
            {courseName}
          </Text>
          {students.map((student, index) => (
            student.myChoice && (
              <Text key={`${student}-${index}`}>
                {student.student}{" "}
                {student.myChoice ? `(${student.myChoice})` : ""}
              </Text>
            )
          ))}
        </View>
      ))}
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

  {percentage}% של דיווחים בעלי אייקון עצוב.

  </Text>
</View>
)}  
        </View>
      </View>
    </ScrollView>
  );
};

export default MyChoicesData;

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
    fontSize:18,
    fontWeight:'bold',

  }
});
