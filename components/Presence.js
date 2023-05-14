import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toolbar from './Toolbar';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { RadioButton } from 'react-native-paper';


const Presence = ({ route }) => {
  const navigation = useNavigation();
  const { className } = route.params;
  const { courseName } = route.params;
  const { classId } = route.params;
  const { course_id } = route.params;


  const [selectedValues, setSelectedValues] = useState({});
  const [students, setStudents] = useState([]);
  const [dateString, setDateString] = useState('');
  const [validDate, setValidDate] = useState(false);


  useEffect(() => {
    const getStudents = async () => {
      const q = query(collection(db, 'Students'), where('class_id', '==', classId));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setStudents(data);
    };
    getStudents();
  }, []);


  const handleChangeText = (text) => {
    setDateString(text);
    setValidDate(parseDateString(text, 'dd/mm/yyyy'));
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
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
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
    const minDate = new Date('2023-01-01');
    if (date < minDate || date > currentDate) {
      return null;
    }

    return date;
  }


  const createReport = async () => {
    const selectedValuesArray = Object.values(selectedValues);
    if (selectedValuesArray.length < students.length) {
      Alert.alert('שגיאה', 'חסר שדות');
      return;
    }

    const allSelected = selectedValuesArray.every((val) => val !== undefined);

    if (!validDate) {
      Alert.alert('שגיאה', 'התאריך שהוזן לא תקין');
      return;
    }

    if (!validDate || !allSelected) {
      Alert.alert('שגיאה', 'חסר שדות');
      return;
    }



    // Check if a document with the same date and course_id exists
    const q = query(collection(db, 'Presence'), where('date', '==', dateString), where('course_id', '==', course_id));
    const querySnapshot = await getDocs(q);
    console.log("!!!!");
    if (querySnapshot.size > 0) {
      Alert.alert(
        'Add report',
        'Note that there is an attendance report for this course on the above date. Do you want to continue?',
        [
          { text: 'No', onPress: () => navigation.navigate('HomePage'), style: 'cancel' },
          {
            text: 'Yes', onPress: async () => {
              const presenceData = students.map((student) => {
                return {
                  course_id: course_id,
                  class_id: classId,
                  date: dateString,
                  presence: selectedValues[student.id],
                  s_id: student.id,
                };
              });

              try {
                await Promise.all(presenceData.map((data) => addDoc(collection(db, 'Presence'), data)));
                console.log('Documents written successfully');
                Alert.alert('', 'דו"ח הנוכחות הוגש בהצלחה!')
                setDetailsAlerted(false);
                navigation.navigate("HomePage");
              } catch (e) {
                console.log(e);
              }


            }
          },
        ],
        { cancelable: false }
      );
    }

    else {
      const presenceData = students.map((student) => {
        return {
          course_id: course_id,
          class_id: classId,
          date: dateString,
          presence: selectedValues[student.id],
          s_id: student.id,
        };
      });

      try {
        await Promise.all(presenceData.map((data) => addDoc(collection(db, 'Presence'), data)));
        console.log('Documents written successfully');
        Alert.alert('', 'דו"ח הנוכחות הוגש בהצלחה!')

        setDetailsAlerted(false);

        navigation.navigate("HomePage");


      } catch (e) {
        console.log(e);
      }

    }


  };


  return (
    <View>
      <Toolbar />
      <View style={styles.report}>
        <Text style={{ fontSize: 20, padding: 10 }}> צור/י דיווח חדש</Text>
        <Ionicons name="create-outline" size={24} color="black" />
      </View>

      <View>
        <Text>תאריך</Text>
        <TextInput style={[styles.input, { textAlign: 'right' }]} value={dateString} onChangeText={handleChangeText} placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)" />
        {validDate ? (
          <Text style={{ color: 'green' }}>Correct date</Text>
        ) : (
          <Text style={{ color: 'red' }}>Incorrect date</Text>
        )}
      </View>

      <View style={[{ flexDirection: 'row', justifyContent: 'space-around' }]}>
        <Text style={[{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }]}>איחור</Text>
        <Text style={[{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }]}>חיסור</Text>
        <Text style={[{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }]}>נוכח/ת</Text>
        <Text style={[{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }]}>שם התלמיד/ה</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.student_name}</Text>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                value="late"
                status={selectedValues[item.id] === "late" ? "checked" : "unchecked"}
                onPress={() => {
                  setSelectedValues({
                    ...selectedValues,
                    [item.id]: "late",
                  });
                }}
              />


              <RadioButton.Item
                value="absent"
                status={selectedValues[item.id] === "absent" ? "checked" : "unchecked"}
                onPress={() => {
                  setSelectedValues({
                    ...selectedValues,
                    [item.id]: "absent",
                  });
                }}
              />

              <RadioButton.Item
                value="present"
                status={selectedValues[item.id] === "present" ? "checked" : "unchecked"}
                onPress={() => {
                  setSelectedValues({
                    ...selectedValues,
                    [item.id]: "present",
                  });
                }}
              />


            </View>
          </View>
        )}
      />


      <TouchableOpacity style={[styles.butt]} onPress={createReport} >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginLeft: 5 }}>צור דיווח</Text>
        </View>
      </TouchableOpacity>

    </View>
  );

}

export default Presence


const styles = StyleSheet.create({
  report: {

    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'right',
    justifyContent: 'flex-end',
  },

  container: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    marginBottom: 16,
    justifyContent: 'space-around'

  },
  name: {
    fontWeight: 'bold',
    marginRight: 8
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginRight: 16,
  },
  radioButtonItem: {
    height: 24,
    width: 24,

  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: 'white'
  },
  butt: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 100
  }




});

