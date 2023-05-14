import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Modal, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { AntDesign } from '@expo/vector-icons';


const SetDetails = () => {
  const navigation = useNavigation();
  const [documentIds, setDocumentIds] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [className, setclassName] = useState('');
  const [fileResponse, setFileResponse] = useState('');
  const [numInputs, setNumInputs] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isBlueBackground, setIsBlueBackground] = useState(false);
  const [uploadText, setUploadText] = useState('');


  const handleNumInputsChange = (value) => {
    if (value > 0) {
      setNumInputs(value);
      setInputValues(Array.from({ length: value }).map(() => ''));
    } else {
      Alert.alert('Invalid input', 'עלייך להזין לפחות מקצוע אחד', [{
        text: 'OK',
        onPress: () => setNumInputs(0),
        style: 'cancel'
      }]);
    }
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
    }
    else {
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
    setFileResponse('');
    setclassName('');
    setNumInputs(0);
    setInputValues([]);
  };

  const readExcelFile = async () => {
    try {
      const { uri } = fileResponse;
      const fileContents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const workbook = XLSX.read(fileContents, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const studentsCollectionRef = collection(db, "Students");
      const classesCollectionRef = collection(db, "Classes");
      const coursesCollectionRef = collection(db, "Courses");

      // check if className already exists in documentIds
      if (documentIds.includes(className)) {
        Alert.alert('Class already exists', 'This class name already exists, please choose a different name.', [{
          text: 'OK',
          onPress: () => { },
          style: 'cancel'
        }]);
        return;
      }

      const classDoc = {
        t_id: auth.currentUser.uid,
        class_name: className
      }

      const classRef = await addDoc(classesCollectionRef, classDoc);
      const classId = classRef.id;
      console.log("נוצר מסמך לכיתה בהצלחה ----" + className);

      const courses = inputValues.map((courseName) => {
        const courseDoc = {
          class_id: classId,
          course_name: courseName,
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

      await Promise.all(courses);

      const studentPromises = [];
      let rowIndex = 0;
      const studentNames = [];

      while (data[rowIndex] && data[rowIndex][0]) {
        const cellValue = data[rowIndex][0];

        if (studentNames.includes(cellValue)) {
          console.error("Duplicate student found: ", cellValue);
          Alert.alert('Duplicate student', `Student "${cellValue}" already exists in the class.`, [{
            text: 'OK',
            onPress: () => { },
            style: 'cancel'
          }]);
        } else {
          studentNames.push(cellValue);

          const studentDoc = {
            t_id: auth.currentUser.uid,
            student_name: cellValue,
            class_id: classId
          };

          const promise = addDoc(studentsCollectionRef, studentDoc)
            .then((docRef) => {
              console.log("Student document successfully written!------>" + studentDoc.student_name);
            })
            .catch((error) => {
              console.error("Error writing student document: ", error);
            });
          studentPromises.push(promise);
        }

        rowIndex++;
      }

      await Promise.all(studentPromises);

      Alert.alert('Success', 'Data added successfully!', [{
        text: 'OK',
        onPress: () => setShowContent(false),
        style: 'cancel'
      }]);
    }

    catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while uploading the file.', [{
        text: 'OK',
        onPress: () => { },
        style: 'cancel'
      }]);
    }
  };



  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      setFileResponse(result);
      setUploadText('File uploaded successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  const handlePressModa = () => {
    setModalVisible(true);

  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const navigateToHomePage = () => {
    if (documentIds.length > 0) {
      navigation.navigate('HomePage');
    } else {
      Alert.alert('Error', 'There are no classes in the list.');
    }
  };
  console.log("ids" + documentIds);



  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.mainView} >
        <Toolbar />
        <View style={styles.mainView}>
          <Text style={[{ textAlign: 'right', fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline' }]}>רשימת הכיתות שלי: </Text>

          {documentIds.length > 0 ? (
            <View>
              {documentIds.sort().map((name) => (
                <Text key={name}>{name}</Text>
              ))}
            </View>
          ) : (
            <Text>אין כרגע כיתות ברשימה</Text>
          )}

          <View style={[styles.container, isBlueBackground && styles.blueBackground]}>

            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <MaterialCommunityIcons style={styles.icon} name="plus" size={24} color="black" />
              <Text style={styles.buttonText}>הוסף כיתה</Text>
            </TouchableOpacity>

            <>
              <TouchableOpacity onPress={handlePressModa}>
                <Text style={[{ fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }]}>להסבר לחצ/י כאן</Text>
              </TouchableOpacity>

              <Modal visible={modalVisible} onRequestClose={handleClose} transparent={true}>
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>

                    <Image style={[{ height: '60%' }]} source={require('../assets/example1.png')} resizeMode="contain" />

                    <Text style={styles.textModal}>לצורך הוספת כיתה עלייך להעלות קובץ אקסל כמו בדוגמא מטה.
                      קובץ שבו שמות התלמידים מופיעים בעמודה הראשונה בלבד. בכל שורה יופיע שם מלא של תלמיד/ה.
                    </Text>

                    <TouchableOpacity onPress={handleClose} style={styles.button}>
                      <Text style={styles.buttonText}>הבנתי, המשך הלאה</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>

            {showContent && (<>
              <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder='  שם הכיתה:' value={className} onChangeText={text => setclassName(text)} />

              <TouchableOpacity style={styles.button} onPress={() => pickDocument()}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign name="addfile" size={24} color="black" />
                  <Text style={{ marginLeft: 5 }}>בחר/י קובץ</Text>
                </View>

              </TouchableOpacity>
              {fileResponse && (
                <Text style={{ color: 'green', fontSize: 14, fontWeight: 'bold' }}>{uploadText}</Text>
              )}
              <View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>כמה מקצועות את/ה מלמד/ת בכיתה?</Text>
                  <TextInput style={styles.input} placeholder="בחר/י מספר" keyboardType="numeric" onChangeText={(value) => handleNumInputsChange(value)} />
                </View>

                {showContent && (<>
                  {Array.from({ length: numInputs }).map((_, index) => (
                    <TextInput style={styles.input}
                      key={index}
                      placeholder={`הכנס/י מקצוע ${index + 1}`}
                      onChangeText={(value) => handleInputChange(value, index)}
                    />
                  ))}
                </>)}
              </View>
              <TouchableOpacity style={styles.butt} onPress={() => readExcelFile()}>
                <Ionicons style={styles.icon} name="create-outline" size={24} color="black" />
                <Text >יצירת כיתה </Text>
              </TouchableOpacity>
            </>)}
          </View>

          <TouchableOpacity onPress={navigateToHomePage}>
            <AntDesign style={styles.icon} name="home" size={24} color="black" />
            <Text >דף הבית</Text>
          </TouchableOpacity>


        </View>
      </View>
    </KeyboardAvoidingView>

  )
}


export default SetDetails;


const styles = StyleSheet.create({

  mainView: {
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  butt: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  icon: {
    textAlign: 'center'
  },
  image: {
    height: '50%',
    width: '100%',
    alignSelf: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    height: '50%',
    width: '100%',
  },
  textModal: {
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 0,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: 'white'
  },


}
);