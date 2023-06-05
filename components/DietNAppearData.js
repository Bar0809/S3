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
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Navbar from "./Navbar";

const { width } = Dimensions.get("window");

const DietNAppearData = ({ route }) => {
  const { className, classId, category } = route.params;

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
  const [clickedDate, setClickedDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [percentage, setPercentage] = useState(0);
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
    if (date < minDate || date >= currentDate) {
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
        const categoryRef = collection(db, category);
        const q = query(
          categoryRef,
          where("date", ">=", startDateTime),
          where("date", "<=", endDateTime),
          where("t_id", "==", auth.currentUser.uid),
          where ('class_id' , '==' , classId)
        );

        querySnapshot = await getDocs(q);
        const Idst = [];

        if (category === "Diet") {
          querySnapshot.forEach((doc) => {
              Idst.push(doc.id);
          });

          setIds(Idst);

          const tempDates = [];
          await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const docRef = doc.ref;
                const docSnapshot = await getDoc(docRef);
                const moodsValue = docSnapshot.data().date.toDate();
                const day = moodsValue.getDate().toString().padStart(2, "0");
                const month = (moodsValue.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const year = moodsValue.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;
                if (!tempDates.includes(formattedDate)) {
                  tempDates.push(formattedDate);
                }
              
            })
          );

          setDates(tempDates);

          const classDoc = await getDoc(doc(db, "Classes", classId));
          const num = classDoc.data().numOfStudents || 1;
          setNumOfStudents(num);
          const days= countDays(startDate, endDate);
          const temp = (Idst.length*100)/ (numOfStudents*days);
          setPercentage(temp.toFixed(2));
          setShow(true);


        } 
        
        else if (category === "Appearances") {
          querySnapshot.forEach((doc) => {
              Idst.push(doc.id);
            
          });
          setIds(Idst);

          const tempDates = [];
          await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const docRef = doc.ref;
                const docSnapshot = await getDoc(docRef);
                const moodsValue = docSnapshot.data().date.toDate();
                const day = moodsValue.getDate().toString().padStart(2, "0");
                const month = (moodsValue.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const year = moodsValue.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;
                if (!tempDates.includes(formattedDate)) {
                  tempDates.push(formattedDate);
                }
              
            })
          );
          setDates(tempDates);

       
          const classDoc = await getDoc(doc(db, "Classes", classId));
          const num = classDoc.data().numOfStudents || 1;
          setNumOfStudents(num);
          setPercentage(0);
          const days= countDays(startDate, endDate);
          const temp = (Idst.length*100)/ (numOfStudents*days);
          setPercentage(temp.toFixed(2));
          setShow(true);
        }
      } 
      
      
      catch (error) {
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
      const moodsRef = collection(db, category);
      const queries = ids.map((temp) =>
        query(moodsRef, where("__name__", "==", temp))
      );
      const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));

      querySnapshots.forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (timestamp === doc.data().date.seconds) {
            if(category==='Diet' && doc.data().diet==='sad'){
                 names.push([
              doc.data().student_name,
              doc.data().courseName,
              doc.data().note,
            ]); 
            }
        
            if(category==='Appearances' && doc.data().appearances==='sad'){
              names.push([
           doc.data().student_name,
           doc.data().courseName,
           doc.data().note,
         ]); 
         }
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
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    }
  };

  return (
   
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
      {category === 'Diet' && (
      <Text style={styles.pageTitle}>היסטוריית תזונה - {className}</Text>)}

{category === 'Appearances' && (
      <Text style={[styles.pageTitle]}>היסטוריית נראות  - {className}</Text>)}
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
            <TouchableOpacity onPress={() => check(item)} style={[styles.button , {backgroundColor: 'white'}]}>
              <View >
                <Text style={styles.buttonText}>{item}</Text>
              </View>
              </TouchableOpacity>

              {selectedDate === item && (
                <View>
                  {Object.entries(finalResult).length > 0 && (
                    <View style={{alignItems:'center'}}>
                      <Text></Text>
                      <Entypo name="emoji-sad" size={24} color="black"  />
                      {Object.entries(finalResult).map(
                        ([courseName, students]) => (
                          <View key={courseName}>
                            <Text style={{ fontWeight: "bold", textAlign:'center', fontSize:16, textDecorationLine:'underline' }}>
                              {courseName}
                            </Text>
                            {students.map((student, index) => (
                              <Text style={{fontSize:16, textAlign:'center'}}  key={`${student}-${index}`}>
                                {student.student}{" "}
                                {student.note ? `(${student.note})` : ""}
                              </Text>
                            ))}
                          </View>
                        )
                      )}
                    </View>
                  )}

{Object.entries(finalResult).length === 0 && (
                    <View>
                      <Text style={{ fontSize: 14, textAlign: "center" }}>
                        כל התלמידים  בשיעור בתאריך זה קיבלו הערכה חיובית
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
              בטווח התאריכים הנ"ל ישנם 

            {percentage}% של דיווחים בעלי אייקון עצוב.
        
            </Text>
          </View>
  )}        
      
      <Text>{"\n\n\n\n\n\n"}</Text>
      </ScrollView>

      <Navbar />
    </View>
  );
};

export default DietNAppearData;
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
