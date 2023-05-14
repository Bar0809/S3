import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toolbar from './Toolbar';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { RadioButton } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';

const FriendStatus = ({ route }) => {
  const navigation = useNavigation();
  const { className } = route.params;
  const { courseName } = route.params;
  const { classId } = route.params;
  const { course_id } = route.params;

  const [selectedValues, setSelectedValues] = useState({});
  const [students, setStudents] = useState([]);
  const [dateString, setDateString] = useState('');
  const [freeText, setFreeText] = useState([]);
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

    // Set empty strings for undefined freeText values
    for (let i = 0; i < students.length; i++) {
      if (freeText[i] === undefined) {
        freeText[i] = '';
      }
    }

    // Check if a document with the same date and course_id exists
    const q = query(collection(db, 'FriendStatus'), where('date', '==', dateString), where('course_id', '==', course_id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      Alert.alert(
        'Add report',
        'Note that there is an attendance report for this course on the above date. Do you want to continue?',
        [
          { text: 'No', onPress: () => navigation.navigate('HomePage'), style: 'cancel' },
          {
            text: 'Yes', onPress: async () => {
              const friendStatusData = students.map((student, i) => {
                return {
                  course_id: course_id,
                  class_id: classId,
                  date: dateString,
                  friendStatus: selectedValues[student.id],
                  s_id: student.id,
                  note: freeText[i],
                };
              });

              try {
                await Promise.all(friendStatusData.map((data) => addDoc(collection(db, 'FriendStatus'), data)));
                console.log('Documents written successfully');
                Alert.alert('', 'דו"ח הסטטוס החברתי הוגש בהצלחה!')
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
      const friendStatusData = students.map((student, i) => {
        return {
          course_id: course_id,
          class_id: classId,
          date: dateString,
          friendStatus: selectedValues[student.id],
          s_id: student.id,
          note: freeText[i],
        };
      });

      try {
        await Promise.all(friendStatusData.map((data) => addDoc(collection(db, 'FriendStatus'), data)));
        console.log('Documents written successfully');
        Alert.alert('', 'דו"ח הסטטוס החברתי הוגש בהצלחה!')


        navigation.navigate("HomePage");


      } catch (e) {
        console.log(e);
      }

    }


  };


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

  const handleFreeTextChange = (text, index) => {
    const newFreeText = [...freeText];
    newFreeText[index] = text;
    setFreeText(newFreeText);  }

  return (
    <View>
      <Toolbar/>
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
        <Text style={[{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }]}>הערות -לא חובה</Text>

        <Entypo name="emoji-sad" size={24} color="black" />
        <Entypo name="emoji-neutral" size={24} color="black" />
        <Entypo name="emoji-happy" size={24} color="black" />
        <Text style={[{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }]}>שם התלמיד/ה</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.student_name}</Text>
            <View style={styles.radioButtonContainer}>

              <TextInput style={[styles.inputFreeText, { textAlign: 'right' }]} onChangeText={(text) => handleFreeTextChange(text, index)} value={freeText[index]}></TextInput>

              <RadioButton.Item
                value="bed"
                status={selectedValues[item.id] === "bed" ? "checked" : "unchecked"}
                onPress={() => {
                  setSelectedValues({
                    ...selectedValues,
                    [item.id]: "bed",
                  });
                }}
              />

              <RadioButton.Item
                value="medium"
                status={selectedValues[item.id] === "medium" ? "checked" : "unchecked"}
                onPress={() => {
                  setSelectedValues({
                    ...selectedValues,
                    [item.id]: "medium",
                  });
                }}
              />

              <RadioButton.Item
                value="good"
                status={selectedValues[item.id] === "good" ? "checked" : "unchecked"}
                onPress={() => {
                  setSelectedValues({
                    ...selectedValues,
                    [item.id]: "good",
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
  )
}

export default FriendStatus


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
  },
  back: {
      padding:'30%'
  },
  inputFreeText:{
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    width: 100,
    backgroundColor: 'white'
  }

});

