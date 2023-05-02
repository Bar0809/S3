import { View,Text, StyleSheet, TouchableOpacity,TextInput, FlatList} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import Toolbar from './Toolbar';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { RadioButton } from 'react-native-paper';


const Presence = ({route}) => {
  const navigation = useNavigation();
  const {className} = route.params;
  const {reported} = route.params;
  const {courseName} = route.params;

  const [selectedValues, setSelectedValues] = useState({});
  const [students, setStudents] = useState([]);
  const [dateString, setDateString] = useState('');
  const [validDate, setValidDate] = useState(false);
  const [presenceData, setPresenceData] = useState({});
  const [presence, setPresence]= useState ('presence');


  console.log(className);
  console.log(courseName);

  useEffect(() => {
    const getStudents = async () => {
      const q = query(collection(db, 'Students'), where('class_id', '==', className));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });
      setStudents(data);
    };
    getStudents();
  }, []);

  const validateDate = (inputString, dateFormat) => {
    const dateRegex = new RegExp(
      dateFormat.replace(/DD/g, '\\d{2}')
        .replace(/MM/g, '\\d{2}')
        .replace(/YYYY/g, '\\d{4}')
        .replace(/D/g, '\\d{1,2}')
        .replace(/M/g, '\\d{1,2}')
        .replace(/Y/g, '\\d{4}'));
    return dateRegex.test(inputString);
  };

  const handleChangeText = (text) => {
    setDateString(text);
    setValidDate(validateDate(text, 'DD/MM/YYYY'));
  };
  console.log(students);

  return (
    <View>
      <Toolbar/>
      <View style={styles.report}>
        <Text style={{fontSize: 20, padding:10}}> צור/י דיווח חדש</Text>
        <Ionicons name="create-outline" size={24} color="black" />
      </View>
  
      <View>
        <TextInput value={dateString}  onChangeText={handleChangeText} placeholder="הכנס תאריך מהצורה (DD/MM/YYYY)" />
        {validDate ? (
          <Text style={{ color: 'green' }}>Correct date</Text>
        ) : (
          <Text style={{ color: 'red' }}>Incorrect date</Text>
        )}
      </View>
  
      <View style={[{flexDirection: 'row', justifyContent:'space-around'}]}>
        <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>נוכח/ת</Text>
        <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>חיסור</Text>
        <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>איחור</Text>
        <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>שם התלמיד/ה</Text>
      </View>
  
      <FlatList
        data={students}
        keyExtractor={(item) => item.t_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{item.student_name}</Text>
            <View style={styles.radioButtonContainer}>
            <RadioButton.Item
  value="present"
  status={selectedValues[item.t_id] === "present" ? "checked" : "unchecked"}
  onPress={() =>
    setSelectedValues({
      ...selectedValues,
      [item.t_id]: "present",
    })
  }
/>
<RadioButton.Item
  value="absent"
  status={selectedValues[item.t_id] === "absent" ? "checked" : "unchecked"}
  onPress={() =>
    setSelectedValues({
      ...selectedValues,
      [item.t_id]: "absent",
    })
  }
/>
<RadioButton.Item
 
  value="late"
  status={selectedValues[item.t_id] === "late" ? "checked" : "unchecked"}
  onPress={() =>
    setSelectedValues({
      ...selectedValues,
      [item.t_id]: "late",
    })
  }
/>


            </View>
          </View>
        )}
      />

    </View>
  );
  
}

export default Presence


const styles = StyleSheet.create({
  report: {
      
    flexDirection: 'row',
    alignItems:'center',
    textAlign:'right',
    justifyContent: 'flex-end',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderStyle: 'dashed',
    textAlign: 'rigth' ,
    margin:'auto', 
    padding:16,
    marginTop:16,
    width:300,
    height: 50
 },
 container: {
  padding: 16,
},
nameContainer: {
  flexDirection: 'row-reverse',
  justifyContent: 'flex-end',
  marginBottom: 16,
 justifyContent:'space-around'

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


 
});

