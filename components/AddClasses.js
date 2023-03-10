import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import {useState} from 'react';
import Toolbar from './Toolbar';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase'
import { doc, setDoc, updateDoc } from "firebase/firestore"; 
import XLSX from 'xlsx';

const AddClasses = () => {
const navigation = useNavigation();

const [shouldShow, setShouldShow] = useState(false);
const [firstInput, setFirstInput] = useState('');
const [textInputs, setTextInputs] = useState([]);
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [schoolName, setSchoolName] = useState('');

  const handleFirstInput = (text) => {
    setFirstInput(text);
    if(!isNaN(text)){
      setTextInputs(Array.from({length: parseInt(text)}, (_,i) => i));
    }else{
      setTextInputs([]);
    }
  }

  const readExcelFile = async () => {
    try {
      const file = await XLSX.readFile('<path to your Excel file>');
      console.log(file.SheetNames); // output the sheet names in the Excel file
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleSubmit = async () => {
    const DocRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(DocRef, {
      first_name: firstName,
      last_name: lastName,
      school_name: lastName
  }, { merge: true }).then(() => {
    Alert.alert("קרה")
  });
  }


  return (
    <View style={styles.mainView} >
        <Toolbar/>
        <View style={styles.mainView}> 
        <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder='  שם פרטי:' value={firstName} onChangeText={text => setFirstName(text)}></TextInput>
        <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' שם משפחה:' value={lastName} onChangeText={text => setLastName(text)}></TextInput>
        <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' שם ביה"ס:' value={schoolName} onChangeText={text => setSchoolName(text)}></TextInput>

        <TouchableOpacity style={styles.butt}  onPress={() => handleSubmit()}>
        <Ionicons style={styles.icon} name="create-outline" size={24} color="black" />
        <Text >יצירת כיתה</Text>
        </TouchableOpacity>

        {shouldShow ? (
        <View style={styles.classes}>
          <TextInput style={[styles.input2, { textAlign: 'right' }]} placeholder='שם הכיתה: ' ></TextInput>
          <TextInput style={[styles.input2, { textAlign: 'right' }]} keyboradType='numric' placeholder='  מספר מקצועות:'   value={firstInput} onChangeText={handleFirstInput }></TextInput>
          {textInputs.map((_, index) => (
            <TextInput style={[styles.input2, { textAlign: 'right' }]} key={index} placeholder='מקצוע: '></TextInput>
          ))}

          <Text style={styles.text}>נא לצרף קובץ אקסל עם שמות התלמידים בלבד</Text>
          <Text style={[styles.text, { textAlign: 'center', textDecorationLine: 'underline' }]} >ראה/י דוגמא</Text>

          <TouchableOpacity style={styles.butt}>
            <AntDesign style={styles.icon} name='addfile' size={24} color={'black'}/>
            <Text>הוסף קובץ</Text>
          </TouchableOpacity>

        <View style={styles.row}>
            <TouchableOpacity style={styles.butt1}>
              <Text style={{ textAlign: 'center' }} onPress={() => navigation.navigate('HomePage')}>שמור שינויים</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.butt1}>
              <Text style={{ textAlign: 'center' }} onPress={() => navigation.navigate('SignUp')}>חזור</Text>
            </TouchableOpacity> */}

                
            </View>


        </View>
        ) : null}


     
       
       </View> 
    </View>
  )
}

export default AddClasses


const styles=StyleSheet.create({
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
   input2: {
    backgroundColor: 'white',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderStyle: 'dashed',
    textAlign: 'rigth' ,
    margin:'auto', 
    padding:16,
    marginTop:16,
    width:250,
    height: 50
 },
   mainView: {
    alignItems: 'center',
    flex: 1,
    margin: 10,
   },
   butt: {
    backgroundColor: '#87CEFA',
    borderRadius: 200,
    padding: 25,
    width: '50%',
    top:20,
  },
  classes: {
    top:30,
    alignItems: 'center',
  },
  icon: {
    textAlign:'center'
  },
  text: {
    top:10,
    color: 'grey',
    fontWeight: 'bold',
    textAlign:'right'
  },
  row:{
    top:'25%',
    flexDirection: 'row',
  },
  butt1: {
    borderWidth: 1,
    backgroundColor:'white',
    borderColor: '#87CEFA',
    borderRadius: 200,
    padding: 20,
    width: '40%',
  
  }

  }
  );