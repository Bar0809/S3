import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native'
import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { doc, setDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore"; 
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';



const SetDetails = () => {
  const navigation = useNavigation();
  const [documentIds, setDocumentIds] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [className ,setclassName] = useState ('');
  const [fileResponse, setFileResponse] = useState ('');
  const [numInputs, setNumInputs] = useState(0);
  const [inputValues, setInputValues] = useState([]);

  const handleNumInputsChange = (value) => {
    setNumInputs(value);
    setInputValues(Array.from({ length: value }).map(() => ''));
  };

  const handleInputChange = (value, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };


  async function getDocuments() {
    const q = query(collection(db, "Classes"), where("t_id", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("no documents");
    } else {
      const names = [];
      querySnapshot.forEach((doc) => {
        if (!names.includes(doc.data().class_name)) {
          names.push(doc.data().class_name);
        }
      });
      setDocumentIds(names);
    }
  }
  

useEffect(() => {
  getDocuments();
}, []);

const handlePress = () => {
  setShowContent(!showContent);
};

const handleCourses = () => {
  setShowCourses(!showCourses);
};


const readExcelFile = async () => {
  try {
    const { uri } = fileResponse;
    const fileContents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const workbook = XLSX.read(fileContents, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const columnData = data.slice(1).map(row => row[0]); // extract only the first column

    const classesCollectionRef = collection(db, "Classes");
    const coursesCollectionRef = collection(db, "Courses");
    const studentsCollectionRef = collection(db, "Students");

    const classDoc = {
      t_id: auth.currentUser.uid,
      class_name: className
    };

    const classRef = await addDoc(classesCollectionRef, classDoc);
    const classId = classRef.id;

    console.log("Class document successfully written!");
    console.log(inputValues);

    const coursePromises = inputValues.map((docId) => {
      const courseDoc = {
        class_id: classId,
        course_name: docId,
        t_id: auth.currentUser.uid
      };

      return addDoc(coursesCollectionRef, courseDoc)
        .then((docRef) => {
          console.log("Course document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing course document: ", error);
        });
    });

    await Promise.all(coursePromises);

    const studentPromises = columnData.map((cellValue) => {
      const studentDoc = {
        t_id: auth.currentUser.uid,
        student_name: cellValue,
        class_id: classId
      };

      return addDoc(studentsCollectionRef, studentDoc)
        .then((docRef) => {
          console.log("Student document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing student document: ", error);
        });
    });

    await Promise.all(studentPromises);

    getDocuments();
    handlePress();
    handleCourses();
    navigation.navigate("SetDetails");
  } catch (error) {
    console.log(error);
  }
};

  

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      setFileResponse(result);
      // process the Excel file
      // Alert.alert(fileUri + '\n' + fileType + '\n' + fileName)
      // Alert.alert(fileResponse)
    } catch (error) {
      // Alert.alert(error.message)
    }
  }

  return (
    <View style={styles.mainView} >
        <Toolbar/>
        <View style={styles.mainView}> 
          <Text>רשימת הכיתות שלי: </Text>
          <View>
  {documentIds.map((name) => (
    <Text key={name}>{name}</Text>
  ))}
</View>

       
          <TouchableOpacity style={styles.butt} onPress={handlePress}>
                <MaterialCommunityIcons style={styles.icon} name="plus" size={24} color="black" />
                <Text>הוסף כיתה</Text>
          </TouchableOpacity>
              
          {showContent && (<>
            <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder='  שם הכיתה:' value={className} onChangeText={text => setclassName(text)}/>

            <TouchableOpacity style={styles.butt}  onPress={() => pickDocument()}>
              <MaterialCommunityIcons  style={styles.icon} name="file-excel-outline" size={24} color="black" />
              <Text >בחר קובץ אקסל</Text>
            </TouchableOpacity>

            <View>
      <TextInput
        style={styles.butt}
        placeholder="Number of inputs"
        keyboardType="numeric"
        onChangeText={(value) => handleNumInputsChange(value)}
      />
      {showContent && (<>
      {Array.from({ length: numInputs }).map((_, index) => (
        <TextInput
          key={index}
          placeholder={`מקצוע ${index + 1}`}
          onChangeText={(value) => handleInputChange(value, index)}
        />
      ))}
      </>)}
    </View>
            <TouchableOpacity style={styles.butt}  onPress={() => readExcelFile()}>
              <Ionicons style={styles.icon} name="create-outline" size={24} color="black" />
              <Text >טען נתונים</Text>
            </TouchableOpacity>
         </>)}

         <TouchableOpacity style={styles.butt}  onPress={() => navigation.navigate('HomePage')}>
              <Ionicons style={styles.icon} name="create-outline" size={24} color="black" />
              <Text >דף הבית</Text>
            </TouchableOpacity>


        </View>
       </View> 
  )
}

export default SetDetails


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
    backgroundColor: '#90EE90',
    borderRadius: 50,
    padding: 20,
    width: '100%',
    top: 20,
    marginBottom: 10,
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