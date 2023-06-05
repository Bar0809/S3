import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert, Dimensions, ScrollView,Image
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { RadioButton } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import Navbar from "./Navbar";
import { AntDesign } from "@expo/vector-icons";


const { width } = Dimensions.get('window');

const MyChoice2 = ({ route }) => {
  const navigation = useNavigation();
  const { className } = route.params;
  const { courseName } = route.params;
  const { classId } = route.params;
  const { course_id } = route.params;

  const [selectedValues, setSelectedValues] = useState({});
  const [students, setStudents] = useState([]);
  const [dateString, setDateString] = useState("");
  const [validDate, setValidDate] = useState(false);
  const [icons2, setIcons2] = useState();
  const [freeText, setFreeText] = useState([]);
  const [nameOfCategory , setNameOfCategory] = useState("");

  useEffect(() => {
    const getStudents = async () => {
      const q = query(
        collection(db, "Students"),
        where("class_id", "==", classId)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setStudents(data);
    };
    const getType = async () => {
      const q = query(
        collection(db, "users"),
        where("t_id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setIcons2(data.icons2);
        setNameOfCategory(data.myChoice2)

      });
    };

    getType();
    getStudents();
  }, []);

  const handleChangeText = (text) => {
    setDateString(text);
    setValidDate(parseDateString(text, "dd/mm/yyyy"));
  };

  const handleFreeTextChange = (text, index) => {
    const newFreeText = [...freeText];
    newFreeText[index] = text;
    setFreeText(newFreeText);
  };

  function parseDateString(inputString) {
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = inputString.match(dateRegex);

    if (!match) {
      return null;
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
      return null;
    }

    // Check if the month is valid
    if (month > 11) {
      return null;
    }

    // Check if the day is valid for the given month and year
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (day > lastDayOfMonth) {
      return null;
    }

    // Check if the date is within the desired range
    const currentDate = new Date();
    const minDate = new Date("2023-01-01");
    if (date < minDate || date >= currentDate) {
      Alert.alert('', 'לא ניתן להכניס תאריך עתידי')
      return null;
    }

    return date;
  }

  const createReport = async () => {
    if (icons2 === true) {
      const selectedValuesArray = Object.values(selectedValues);
      if (selectedValuesArray.length < students.length) {
        Alert.alert("שגיאה", "חסר שדות");
        return;
      }

      const allSelected = selectedValuesArray.every((val) => val !== undefined);

      if (!validDate) {
        Alert.alert("שגיאה", "התאריך שהוזן לא תקין");
        return;
      }

      if (!validDate || !allSelected) {
        Alert.alert("שגיאה", "חסר שדות");
        return;
      }

      // Set empty strings for undefined freeText values
      for (let i = 0; i < students.length; i++) {
        if (freeText[i] === undefined) {
          freeText[i] = "";
        }
      }

      // Check if a document with the same date and course_id exists
      const q = query(
        collection(db, "MyChoice2"),
        where("date", "==", dateString),
        where("course_id", "==", course_id)
      );
      const querySnapshot = await getDocs(q);
      const startDateArray = dateString.split("/");
      const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
      const startDateTime = new Date(startDateISO);
      if (querySnapshot.size > 0) {
        Alert.alert(
          "Add report",
          "Note that there is an attendance report for this course on the above date. Do you want to continue?",
          [
            {
              text: "No",
              onPress: () => navigation.navigate("HomePage"),
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                const myChoiceData = students.map((student, i) => {
                  return {
                    course_id: course_id,
                    class_id: classId,
                    date: startDateTime,
                    myChoice: selectedValues[student.id],
                    s_id: student.id,
                    note: freeText[i],
                    t_id: auth.currentUser.uid,
                    class_name: className,
                    courseName: courseName,
                    student_name: student.student_name,
                  };
                });

                try {
                  await Promise.all(
                    myChoiceData.map((data) =>
                      addDoc(collection(db, "MyChoice2"), data)
                    )
                  );

                  Alert.alert("", 'הדו"ח הוגש בהצלחה!');
                  navigation.navigate("HomePage");
                } catch (e) {
                  Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        const myChoiceData = students.map((student, i) => {
          return {
            course_id: course_id,
            class_id: classId,
            date: startDateTime,
            myChoice: selectedValues[student.id],
            s_id: student.id,
            note: freeText[i],
            t_id: auth.currentUser.uid,
            class_name: className,
            courseName: courseName,
            student_name: student.student_name,
          };
        });

        try {
          await Promise.all(
            myChoiceData.map((data) =>
              addDoc(collection(db, "MyChoice2"), data)
            )
          );

          Alert.alert("", 'הדו"ח הוגש בהצלחה!');

          navigation.navigate("HomePage");
        } catch (e) {
          Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
        }
      }
    } else {
      if (freeText.length < students.length) {
        Alert.alert(
          "לתשומת ליבך",
          "שימו לב כי לא הוזמנו הערות עבור כל התלמידים!"
        );
      }

      if (!validDate) {
        Alert.alert("שגיאה", "התאריך שהוזן לא תקין");
        return;
      }

      // Set empty strings for undefined freeText values
      for (let i = 0; i < students.length; i++) {
        if (freeText[i] === undefined) {
          freeText[i] = "";
        }
      }

      // Check if a document with the same date and course_id exists
      const q = query(
        collection(db, "MyChoice2"),
        where("date", "==", dateString),
        where("course_id", "==", course_id)
      );
      const querySnapshot = await getDocs(q);
      const startDateArray = dateString.split("/");
    const startDateISO = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const startDateTime = new Date(startDateISO);
      if (querySnapshot.size > 0) {
        Alert.alert(
          "Add report",
          "Note that there is an attendance report for this course on the above date. Do you want to continue?",
          [
            {
              text: "No",
              onPress: () => navigation.navigate("HomePage"),
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                const myChoiceData = students.map((student, i) => {
                  return {
                    course_id: course_id,
                    class_id: classId,
                    date: startDateTime,
                    myChoice: freeText[i],
                    s_id: student.id,
                    t_id: auth.currentUser.uid,
                    class_name: className,
                    courseName: courseName,
                    student_name: student.student_name,
                  };
                });

                try {
                  await Promise.all(
                    myChoiceData.map((data) =>
                      addDoc(collection(db, "MyChoice2"), data)
                    )
                  );

                  Alert.alert("", 'הדו"ח הוגש בהצלחה!');
                  navigation.navigate("HomePage");
                } catch (e) {
                  Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        const myChoiceData = students.map((student, i) => {
          return {
            course_id: course_id,
            class_id: classId,
            date: startDateTime,
            myChoice: freeText[i],
            s_id: student.id,
            t_id: auth.currentUser.uid,
            class_name: className,
            courseName: courseName,
            student_name: student.student_name,
          };
        });

        try {
          await Promise.all(
            myChoiceData.map((data) =>
              addDoc(collection(db, "MyChoice2"), data)
            )
          );

          Alert.alert("", 'הדו"ח הוגש בהצלחה!');

          navigation.navigate("HomePage");
        } catch (e) {
          Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
        }
      }
    }
  };


  return (
    <View style={styles.container}>
    <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={styles.title}>
      <Text style={styles.pageTitle}>דיווח {nameOfCategory} - {"\n"}  {className}</Text>
    </View>

    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>תאריך</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={dateString}
            onChangeText={handleChangeText}
            placeholder="הכנס/י תאריך מהצורה (DD/MM/YYYY)"
          />
          {dateString && !validDate && (
            <Text style={{ color: "red" }}>ערך לא תקין</Text>
          )}
        </View>
        {validDate && <AntDesign name="check" size={24} color="green" />}
      </View>

      <Text>{"\n"}</Text>
      {icons2 ? (
        <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
            <Text
              style={styles.tableHeaderText}
            >
              הערות -לא חובה
            </Text>
            <Entypo name="emoji-sad" size={24} color="black" />
            <Entypo name="emoji-happy" size={24} color="black" />
            <Text
              style={{ textAlign: "right", fontWeight: "bold", fontSize: 16 }}
            >
              שם התלמיד/ה
            </Text>
          </View>

          {students.map((item, index) => (
  <View key={item.id} style={styles.studentRow}>
    <View style={styles.radioButtonContainer}>
      <TextInput
        style={[styles.inputFreeText, { textAlign: "right" }]}
        onChangeText={(text) => handleFreeTextChange(text, index)}
        value={freeText[index]}
      />

      <RadioButton.Item
        value="sad"
        status={
          selectedValues[item.id] === "sad" ? "checked" : "unchecked"
        }
        onPress={() => {
          setSelectedValues({
            ...selectedValues,
            [item.id]: "sad",
          });
        }}
      />
      <RadioButton.Item
        value="good"
        status={
          selectedValues[item.id] === "good" ? "checked" : "unchecked"
        }
        onPress={() => {
          setSelectedValues({
            ...selectedValues,
            [item.id]: "good",
          });
        }}
      />
    </View>
    <Text style={styles.name}>{item.student_name}</Text>
  </View>
))}

          <TouchableOpacity style={styles.button} onPress={createReport}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.buttonText}>שלח/י דיווח</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text
             style={styles.tableHeaderText}
            >
              טקסט חופשי
            </Text>
            <Text
              style={{ textAlign: "right", fontWeight: "bold", fontSize: 16 }}
            >
              שם התלמיד/ה
            </Text>
          </View>

          {students.map((item, index) => (
  <View style={styles.studentRow} key={item.id.toString()}>
    <Text style={styles.name}>{item.student_name}</Text>
    <View style={styles.radioButtonContainer}>
      <TextInput
        style={[styles.inputFreeText, { textAlign: "right" }]}
        onChangeText={(text) => handleFreeTextChange(text, index)}
        value={freeText[index]}
      />
    </View>
  </View>
))}

          <TouchableOpacity style={styles.butt} onPress={createReport}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.buttonText}>שלח/י דיווח</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
            <Text>{"\n\n\n\n\n\n"}</Text>

      </ScrollView>
      <Navbar/>

      
    </View>
  );
};

export default MyChoice2;

const styles = StyleSheet.create({
  name: {
    fontWeight: "bold",
    marginRight: 8,
  },
 
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginRight: 16,
  },
 
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
  },
  inputFreeText: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 120,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },

  title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "#AD8E70",
    fontSize: 40,
    fontWeight: "bold",
    padding: 10,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textAlign:'center'
  },
  subTitle: {
    fontSize: 24,
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
  tableContainer: {
    width: '90%',
    marginBottom: 16,
    marginLeft: '5%',
    marginRight: '5%',},
tableHeader: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  marginBottom: 8,
},
studentRow: {
  flexDirection: "row"
  , alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},
studentName: {
  flex: 1,
  fontWeight: "bold",
  textAlign: "right",
},
gradeInput: {
  width: 80,
},
freeTextInput: {
  flex: 1,
  marginLeft: 16,
},
studentRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},
studentName: {
  flex: 1,
  fontWeight: "bold",
  textAlign: "right",
},
gradeInput: {
  width: 80,
},
freeTextInput: {
  flex: 1,
  marginLeft: 16,
},
tableHeaderText:{
  textAlign: "right",
   fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: 'underline'
},
});