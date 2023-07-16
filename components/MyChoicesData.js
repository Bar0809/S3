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
import { Entypo } from "@expo/vector-icons";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const { width } = Dimensions.get("window");

const MyChoicesData = ({ route }) => {
  const { className, classId, category } = route.params;

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
  const [numOfStudents, setNumOfStudents] = useState(0);
  const [classDoc, setClassDoc] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [datesForExcel, setDatesForExcel] = useState([]);

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
        const Idst = [];

        const myChoiceRef = collection(db, category);
        const q = query(
          myChoiceRef,
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
          Idst.push(doc.id);
        });

        setIds(Idst);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
        console.log(error.message)
      }

      const dates = [];
      const datesForExcel = [];
      const timestamps = [];

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
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
        })
      );
      setDates(dates);
      setDatesForExcel(datesForExcel);
      setShow(true)

      const temp = await getDoc(doc(db, "Classes", classId));
      setClassDoc(temp);

      try {
        const iconsRef = collection(db, "users");
        const q = query(iconsRef, where("t_id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const icons = [];
        let name = "";
        querySnapshot.forEach((doc) => {
          const icon1 = doc.data().icons1;
          icons.push(icon1);
          const icon2 = doc.data().icons2;
          icons.push(icon2);
          if (category === "MyChoice1") {
            name = doc.data().myChoice1;
          }
          if (category === "MyChoice2") {
            name = doc.data().myChoice2;
          }
        });
        setIcons(icons);
        setCategoryName(name);
       

        if (category === "MyChoice1") {
          setIcon(icons[0]);
        } else if (category === "MyChoice2") {
          setIcon(icons[1]);
        }
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
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

    const classDoc = await getDoc(doc(db, "Classes", classId));
    const num = classDoc.data().numOfStudents || 1;
    setNumOfStudents(num);

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
                doc.data().myChoice === "sad" &&
                category === "MyChoice1") ||
              (icons[1] === true &&
                doc.data().myChoice === "sad" &&
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

      } 
      
      else if (
        (icons[1] === true && category === "MyChoice2") ||
        (icons[0] === true && category === "MyChoice1")
      ) {
        const result1 = names.reduce((acc, [student, courseName, note]) => {
          if (!acc[courseName]) {
            acc[courseName] = {
              students: [],
              percent: 0,
            };
          }
          acc[courseName].students.push({ student, note });
         
          return acc;
        }, {});

        Object.keys(result1).forEach((courseName) => {
          const sadIcons = result1[courseName].students.length;
          const percent = (sadIcons * 100) / num;
          result1[courseName].percent = percent.toFixed(2);
        });
        setResult(result1);

      }
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }
  };

  
  const generateExcel = async () => {
    const wb = XLSX.utils.book_new();
    const boldCellStyle = {
      font: {
        bold: true,
      },
    };

    for (let i = 0; i < datesForExcel.length; i++) {
      const presenceValue = datesForExcel[i].toDate();
      const day = presenceValue.getDate().toString().padStart(2, "0");
      const month = (presenceValue.getMonth() + 1).toString().padStart(2, "0");
      const year = presenceValue.getFullYear();
      const sheetName = `${day}.${month}.${year}`;

      if (category === "myChoice1") {
        const dietRef = collection(db, "MyChoice1");
        const q = query(
          dietRef,
          where("t_id", "==", auth.currentUser.uid),
          where("date", "==", presenceValue),
          where("class_id", "==", classId)
        );

        const querySnapshot = await getDocs(q);
        const sheetData = {};
        
        if(icons[0]===true){
         querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const studentName = doc.data().student_name;
          const myChoice = doc.data().myChoice;
          const note = doc.data().note;

          let myChoice_ = "";
          if (myChoice === "good") {
            myChoice_ = "הערכה חיובית";
          } else {
            myChoice_ = "הערכה שלילית";
          }

          if (!sheetData[courseName]) {
            sheetData[courseName] = [];
          }

          sheetData[courseName].push([studentName, myChoice_, note]);
        }); 
        }
        else{
          querySnapshot.forEach((doc) => {
            const courseName = doc.data().courseName;
            const studentName = doc.data().student_name;
            const myChoice = doc.data().myChoice;
  
            if (!sheetData[courseName]) {
              sheetData[courseName] = [];
            }
  
            sheetData[courseName].push([studentName, myChoice]);
          }); 
        }
        

        const sheetNames = Object.keys(sheetData);
        sheetNames.forEach((courseName) => {
          const courseData = sheetData[courseName];
          const data = [[courseName], ...courseData];
          const ws = XLSX.utils.aoa_to_sheet(data);
          ws["A1"].s = boldCellStyle;

          const sheetTitle = `${sheetName}`;
          XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
        });

        const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
        const uri = FileSystem.cacheDirectory + `${categoryName}` +".xlsx";

        await FileSystem.writeAsStringAsync(uri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Sharing.shareAsync(uri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Share Attendance",
        });
      } 
      
      else {

        const dietRef = collection(db, "MyChoice2");
        const q = query(
          dietRef,
          where("t_id", "==", auth.currentUser.uid),
          where("date", "==", presenceValue),
          where("class_id", "==", classId)
        );

        const querySnapshot = await getDocs(q);
        const sheetData = {};
        
        if(icons[1]===true){
         querySnapshot.forEach((doc) => {
          const courseName = doc.data().courseName;
          const studentName = doc.data().student_name;
          const myChoice = doc.data().myChoice;
          const note = doc.data().note;

          let myChoice_ = "";
          if (myChoice === "good") {
            myChoice_ = "הערכה חיובית";
          } else {
            myChoice_ = "הערכה שלילית";
          }

          if (!sheetData[courseName]) {
            sheetData[courseName] = [];
          }

          sheetData[courseName].push([studentName, myChoice_, note]);
        }); 
        }
        else{

          querySnapshot.forEach((doc) => {
            const courseName = doc.data().courseName;
            const studentName = doc.data().student_name;
            const myChoice = doc.data().myChoice;
  
            if (!sheetData[courseName]) {
              sheetData[courseName] = [];
            }
  
            sheetData[courseName].push([studentName, myChoice]);
          }); 
        }
        

        const sheetNames = Object.keys(sheetData);
        sheetNames.forEach((courseName) => {
          const courseData = sheetData[courseName];
          const data = [[courseName], ...courseData];
          const ws = XLSX.utils.aoa_to_sheet(data);
          ws["A1"].s = boldCellStyle;

          const sheetTitle = `${sheetName}`;
          XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
        });

        const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
        const uri = FileSystem.cacheDirectory + `${categoryName}` +".xlsx";

        await FileSystem.writeAsStringAsync(uri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Sharing.shareAsync(uri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Share Attendance",
        });
      }
    }
  };


  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
        <Text style={styles.pageTitle}>
          היסטוריית {categoryName} - {className}
        </Text>
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
                {Object.entries(result).length > 0 && icon === true && (
                  <View style={{ alignItems: "center" }}>
                    <Text></Text>
                    <Entypo name="emoji-sad" size={24} color="black" />
                    {Object.entries(result).map(([courseName, courseData]) => (
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
                        courseData.students.map((student, index) => (
                          <Text
                            key={`${student}-${index}`}
                            style={{ fontSize: 16, textAlign: "center" }}
                          >
                            {student.student}{" "}
                            {student.note ? `(${student.note})` : ""}
                          </Text>
                        ))}

<Text
                            style={{
                              fontSize: 20,
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {courseData.percent}% תלמידים עם הערכה שלילית
                          </Text>
                      </View>
                    ))}

                    {Object.entries(result).length === 0 && (
                      <View>
                        <Text style={{ fontSize: 14, textAlign: "center" }}>
                          כל התלמידים בשיעור בתאריך זה קיבלו הערכה חיובית
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {Object.entries(result).length > 0 && icon === false && (
                  <View>
                    <Text></Text>
                    {Object.entries(result).map(([courseName, students]) => (
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
                        {students.map(
                          (student, index) =>
                            student.myChoice && (
                              <Text
                                key={`${student}-${index}`}
                                style={{ fontSize: 16, textAlign: "center" }}
                              >
                                {student.student}{" "}
                                {student.myChoice
                                  ? `(${student.myChoice})`
                                  : ""}
                              </Text>
                            )
                        )}
                      </View>
                    ))}
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

export default MyChoicesData;

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
