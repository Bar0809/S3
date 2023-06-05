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
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { AntDesign } from "@expo/vector-icons";
import Navbar from "./Navbar";

const { width } = Dimensions.get("window");


const ScoresData = ({route}) => {
  const { className, classId, category } = route.params;

  const [startDateString, setStartDateString] = useState("");
  const [endDateString, setEndDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validDate, setValidDate] = useState(false);
  const [validDateTwo, setValidDateTwo] = useState(false);
  const [scoresDates, setScoresDates] = useState([]);
  const [scoresIds, setScoresIds] = useState([]);
  const [scoresStudentsForShow, setScoresStudentsForShow] = useState([]);
  const [resultObject, setResultObject] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  
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
    if (date < minDate || date >= currentDate) {
      Alert.alert('', 'לא ניתן להכניס תאריך עתידי')
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

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      Alert.alert("שגיאה בהכנסת הנתונים");
      return;
    }
  
    if (startDateTime > endDateTime) {
      Alert.alert("שגיאה", " שימו לב, הוכנס תאריך סיום קטן מתאריך ההתחלה  ");
      return;
    }
  
    if (startDate && endDate) {
      try {
        const scoresRef = collection(db, "Scores");
        const q = query(
          scoresRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where('class_id' ,'==', classId)
        );
        querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length === 0) {
          Alert.alert("שגיאה", "אין דיווחים בתאריכים הללו");
          return;
        }
        const scores = [];
  
        querySnapshot.forEach((doc) => {
          scores.push(doc.id);
        });
  
        setScoresIds(scores);
  
        const scoresDates = [];
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const docRef = doc.ref;
            const docSnapshot = await getDoc(docRef);
            const scoresValue = docSnapshot.data().date.toDate();
            const day = scoresValue.getDate().toString().padStart(2, "0");
            const month = (scoresValue.getMonth() + 1).toString().padStart(2, "0");
            const year = scoresValue.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            if (!scoresDates.includes(formattedDate)) {
              scoresDates.push(formattedDate);
            }
          })
        );
  
        setScoresDates(scoresDates);
      } catch (error) {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
console.log(error)
      }
    }
  };
  

  const check = async (clickedDate) => {
    if (clickedDate === selectedDate) {
      setSelectedDate(null); 
    } else {
      setSelectedDate(clickedDate); 
    }

    const dateParts = clickedDate.split("/");
    const dateObject = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    );
    const timestamp = dateObject.getTime() / 1000;
    const studentNames = [];

    try {
      const scoresRef = collection(db, "Scores");
      const scoresQueries = scoresIds.map((temp) =>
        query(scoresRef, where("__name__", "==", temp))
      );
      
      const scoresQuerySnapshots = await Promise.all(
        scoresQueries.map((q) => getDocs(q))
      );

      scoresQuerySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            studentNames.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().exercise_name,
              doc.data().score,
              doc.data().note,
            ]);
          }
        });
      });

      setScoresStudentsForShow(studentNames);

      const result = scoresStudentsForShow.reduce(
        (acc, [student, course, exercise, score, note]) => {
          if (!acc[course]) {
            acc[course] = {};
          }
          if (!acc[course][exercise]) {
            acc[course][exercise] = [];
          }
          acc[course][exercise].push({ student, score, note });
          return acc;
        },
        {}
      );

      setResultObject(result);
    } 
    
    catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      console.log(error)
    }
  };

  return (
  

    <View style={styles.container}>
    <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={styles.title}>
      <Text style={styles.pageTitle}>היסטוריית ציונים - {className}</Text>
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

  

          {scoresDates.map((item) => (
            <View key={item}>
            <TouchableOpacity onPress={() => check(item)}
             style={[styles.button, { backgroundColor: "white" }]}
            >
              <View >
                <Text style={styles.buttonText}>{item}</Text>
              </View>
              </TouchableOpacity>

              
              {selectedDate === item && (
                <View>
                  {Object.entries(resultObject).map(
                    ([courseName, exercises]) => (
                      <View key={courseName}>
                        <Text style={styles.sectionTitle}>
                          מקצוע: {courseName}
                        </Text>
                        {Object.entries(exercises).map(
                          ([exerciseName, scores]) => (
                            <View key={exerciseName}>
                              <Text   style={{
                              fontWeight: "bold",
                              textAlign: "center",
                              fontSize: 16,
                              textDecorationLine: "underline",
                            }}>
                                מטלה: {exerciseName}
                              </Text>
                              {scores.map(({ student, score, note }, index) => (
                                <Text key={index} style={{ fontSize: 16, textAlign: "center" }}>
                                   {student}: {score}
                                  {note ? ` (${note})` : ""}
                                </Text>
                              ))}
                            </View>
                          )
                        )}
                      </View>
                    )
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

export default ScoresData;
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
