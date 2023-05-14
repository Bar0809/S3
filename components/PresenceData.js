import { View, Text, StyleSheet, TouchableOpacity, FlatList,TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import firebase from 'firebase/app';




const PresenceData = () => {
  const [startDateString, setStartDateString] = useState('');
  const [endDateString, setEndDateString] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lateStudents, setLateStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [dateString, setDateString] = useState('');
  const [freeText, setFreeText] = useState([]);
  const [validDate, setValidDate] = useState(false);
  const navigation = useNavigation();

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

  const handleChangeStartDate = (text) => {
    setStartDateString(text);
    setStartDate(parseDateString(text));
  };

  const handleChangeEndDate = (text) => {
    setEndDateString(text);
    setEndDate(parseDateString(text));
  };


  const handleExportData = async () => {
    if (startDate && endDate) {
      const presenceRef = collection(db, 'Presence');
      const q = query(presenceRef, where('date', '>=', startDate), where('date', '<=', endDate));
      const querySnapshot = await getDocs(q);

      const lateIds = [];
      const absentIds = [];

      querySnapshot.forEach((doc) => {
        const presence = doc.data().presence;
        if (presence === 'late') {
          lateIds.push(doc.data().studentId);
        } else if (presence === 'absent') {
          absentIds.push(doc.data().studentId);
        }
      });

      const studentRef = collection(db, 'Students');
      const lateStudentsQuery = query(studentRef, where(firebase.firestore.FieldPath.documentId(), 'in', lateIds));
      const lateStudentsSnapshot = await getDocs(lateStudentsQuery);
       const lateStudentsData = [];
       
       lateStudentsSnapshot.forEach((doc) => {
        lateStudentsData.push(doc.data().student_name); 
      });
      setLateStudents(lateStudentsData);

      const absentStudentsQuery = query(studentRef, where(firebase.firestore.FieldPath.documentId(), 'in', absentIds));
      const absentStudentsSnapshot = await getDocs(absentStudentsQuery);
       const absentStudentsData = [];
       
       absentStudentsSnapshot.forEach((doc) => {
        absentStudentsData.push(doc.data().student_name); 
      });
      setAbsentStudents(absentStudentsData);

    }

   
  }

  return (
    <View>
      <Toolbar/>
      <Text style={{ fontSize: 20, padding: 10 }}>היסטוריית נוכחות: </Text>
      <View>
        <Text>מתאריך: </Text>
        <TextInput style={[styles.input, { textAlign: 'right' }]} value={startDateString} onChangeText={handleChangeStartDate} placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)" />
        {validDate ? (
          <Text style={{ color: 'green' }}>Correct date</Text>
        ) : (
          <Text style={{ color: 'red' }}>Incorrect date</Text>
        )}

<Text>עד תאריך: </Text>
        <TextInput style={[styles.input, { textAlign: 'right' }]} value={endDateString} onChangeText={handleChangeEndDate} placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)" />
        {validDate ? (
          <Text style={{ color: 'green' }}>Correct date</Text>
        ) : (
          <Text style={{ color: 'red' }}>Incorrect date</Text>
        )}

<TouchableOpacity style={styles.continueButton} onPress={handleExportData} >
        <Text style={styles.continueButtonText}>הוצא נתונים</Text>
      </TouchableOpacity>
      </View>

      <Text>PresenceData</Text>
    </View>
  )
}

export default PresenceData


const styles = StyleSheet.create({
  

});

