import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "./firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const SetDetails = () => {
  const navigation = useNavigation();
  const [documentIds, setDocumentIds] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [className, setclassName] = useState("");
  const [fileResponse, setFileResponse] = useState("");
  const [numInputs, setNumInputs] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isBlueBackground, setIsBlueBackground] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [counter, setCounter] = useState(0);
  const [homePage, setHomePage] = useState("false");
  const [class_id , setClass_id] = useState ('');

  const handleNumInputsChange = (value) => {
    if (value > 0) {
      setNumInputs(value);
      setInputValues(Array.from({ length: value }).map(() => ""));
    } else {
      Alert.alert(" שגיאה", "עלייך להזין לפחות מקצוע אחד", [
        {
          text: "OK",
          onPress: () => setNumInputs(0),
          style: "cancel",
        },
      ]);
    }
  };

  const handleInputChange = (value, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  async function getDocuments() {
    const q = query(
      collection(db, "Classes"),
      where("t_id", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // console.log("no documents");
    } else {
      const names = [];
      querySnapshot.forEach((doc) => {
        if (!names.includes(doc.data().class_name)) {
          names.push(doc.data().class_name);
        }
      });
      setDocumentIds(names);
      setHomePage(true);
    }
  }

  useEffect(() => {
    getDocuments();
  }, [documentIds]);

  const handlePress = () => {
    setShowContent(!showContent);
    setFileResponse("");
    setclassName("");
    setNumInputs(0);
    setInputValues([]);
  };

  const readExcelFile = async () => {
    try {
      const { uri } = fileResponse;
      const fileContents = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const workbook = XLSX.read(fileContents, { type: "base64" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      const studentsCollectionRef = collection(db, "Students");
      const classesCollectionRef = collection(db, "Classes");
      const coursesCollectionRef = collection(db, "Courses");
  
      if (documentIds.includes(className)) {
        Alert.alert("שגיאה", "שם הכיתה כבר תפוס, נסה/י שם אחר", [
          {
            text: "אוקיי",
            onPress: () => {},
            style: "cancel",
          },
        ]);
        return;
      }
  
      const classDoc = {
        t_id: auth.currentUser.uid,
        class_name: className,
      };
  
      const classRef = await addDoc(classesCollectionRef, classDoc);
      const classId = classRef.id;
      setClass_id(classId);
      setDocumentIds(prevDocumentIds => [...prevDocumentIds, classId]);

    
      const courses = inputValues.map((courseName) => {
        const courseDoc = {
          class_id: classId,
          course_name: courseName,
          t_id: auth.currentUser.uid,
        };
        return addDoc(coursesCollectionRef, courseDoc)
          .then((docRef) => {})
          .catch((error) => {
            throw new Error("Error adding course document: " + error.message);
          });
      });
  
      const studentPromises = [];
      let rowIndex = 0;
      const studentNames = [];
  
      while (data[rowIndex] && data[rowIndex][0]) {
        const cellValue = data[rowIndex][0];
  
        if (studentNames.includes(cellValue)) {
          Alert.alert(
            " שגיאה",
            ` "${cellValue}" כבר קיים בכיתה הזאת. התלמיד/ה `,
            [
              {
                text: "אוקיי",
                onPress: () => {},
                style: "cancel",
              },
            ]
          );
        } else {
          studentNames.push(cellValue);
  
          const studentDoc = {
            t_id: auth.currentUser.uid,
            student_name: cellValue,
            class_id: classId,
          };
  
          const promise = addDoc(studentsCollectionRef, studentDoc)
            .then((docRef) => {
              setCounter((prevCounter) => prevCounter + 1);
            })
            .catch((error) => {
              throw new Error("Error adding student document: " + error.message);
            });
          studentPromises.push(promise);
        }
  
        rowIndex++;
      }
  
      await Promise.all([Promise.all(courses), Promise.all(studentPromises)]);
  
      const classDocUpdate = {
        numOfStudents: studentPromises.length,
      };
      await updateDoc(doc(classesCollectionRef, classId), classDocUpdate);
  
      Alert.alert("", "המידע עודכן בהצלחה", [
        {
          text: "אוקיי",
          onPress: () => setShowContent(false),
          style: "cancel",
        },
      ]);


  
      const collectionRef = collection(db, "TrafficLights");
      const lightsDoc = {
        t_id: auth.currentUser.uid,
        G_presence_late: 5,
        G_presence_absent: 10,
        G_presence: 85,
        O_presence_late: 10,
        O_presence_absent: 15,
        O_presence: 75,
        G_appearances_p: 90,
        G_appearances_n: 10,
        O_appearances_p: 80,
        O_appearances_n: 20,
        G_diet_p: 90,
        G_diet_n: 10,
        O_diet_p: 80,
        O_diet_n: 20,
        G_events: 0,
        O_events: 1,
        G_friendStatus_n: 5,
        G_friendStatus_m: 10,
        G_friendStatus_p: 85,
        O_friendStatus_n: 10,
        O_friendStatus_m: 15,
        O_friendStatus_p: 75,
        G_mood_n: 5,
        G_mood_m: 10,
        G_mood_p: 85,
        O_mood_n: 10,
        O_mood_m: 15,
        O_mood_p: 75,
      };
  
      const promise = addDoc(collectionRef, lightsDoc);
  
      const collectionRef_ = collection(db, "Colors");
      const colorsDoc = {
        t_id: auth.currentUser.uid,
        class_id: classId,
        class_color: "green",
        class_description: "",
      };
  
      const p = addDoc(collectionRef_, colorsDoc)
        .then(() => {})
        .catch((error) => {
          throw new Error("Error adding colors document: " + error.message);
        });
    } catch (error) {
      console.log("File upload error:", error);
      Alert.alert(
        "Error",
        "An error occurred while uploading the file: " + error.message,
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                await deleteDoc(doc(classesCollectionRef, classId));
  
                await Promise.all(
                  inputValues.map((courseName) =>
                    deleteDoc(doc(coursesCollectionRef, courseName))
                  )
                );
  
                await Promise.all(
                  studentNames.map((studentName) =>
                    deleteDoc(doc(studentsCollectionRef, studentName))
                  )
                );
  
                Alert.alert(
                  "Documents Deleted",
                  "The documents added earlier have been deleted.",
                  [
                    {
                      text: "OK",
                      onPress: () => {},
                      style: "cancel",
                    },
                  ]
                );
              } catch (deleteError) {
                console.log("Delete error:", deleteError);
                Alert.alert(
                  "Delete Error",
                  "An error occurred while deleting the documents: " +
                    deleteError.message,
                  [
                    {
                      text: "OK",
                      onPress: () => {},
                      style: "cancel",
                    },
                  ]
                );
              }
            },
            style: "cancel",
          },
        ]
      );
    }
  
    const collectionRef = collection(db, "TrafficLights");
    const lightsDoc = {
      t_id: auth.currentUser.uid,
      G_presence_late: 5,
      G_presence_absent: 10,
      G_presence: 85,
      O_presence_late: 10,
      O_presence_absent: 15,
      O_presence: 75,
      G_appearances_p: 90,
      G_appearances_n: 10,
      O_appearances_p: 80,
      O_appearances_n: 20,
      G_diet_p: 90,
      G_diet_n: 10,
      O_diet_p: 80,
      O_diet_n: 20,
      G_events: 0,
      O_events: 1,
      G_friendStatus_n: 5,
      G_friendStatus_m: 10,
      G_friendStatus_p: 85,
      O_friendStatus_n: 10,
      O_friendStatus_m: 15,
      O_friendStatus_p: 75,
      G_mood_n: 5,
      G_mood_m: 10,
      G_mood_p: 85,
      O_mood_n: 10,
      O_mood_m: 15,
      O_mood_p: 75,
    };
  
    const promise = addDoc(collectionRef, lightsDoc);
  
    const collectionRef_ = collection(db, "Colors");
    const colorsDoc = {
      t_id: auth.currentUser.uid,
      class_id: class_id,
      class_color: "green",
      class_description: "",
    };
  
    const p = addDoc(collectionRef_, colorsDoc)
      .then(() => {})
      .catch((error) => {
        throw new Error("Error adding colors document: " + error.message);
      });
  };
  

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      setFileResponse(result);
      setUploadText("הקובץ הועלה בהצלחה");
    } catch (error) {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
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
      Alert.alert(
        'שימו לב' , 
        'באיזור אישי ניתן להגדיר 2 קטגוריות לדיווח לפי בחירתך. כמו כן ניתן לקבל מידע על  שיטת הרמזור בדף הגדרת הרמזור. '
      ,
        [
          {
            text: "אוקיי",
            onPress: () => {},
            style: "cancel",
          },
        ]
      );
      navigation.navigate("HomePage");
    } else {
      Alert.alert("שגיאה", ",אין כיתות ברשימה");
    }
  };

  return (

    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
        <Text style={[styles.pageTitle, { textAlign: "center" }]}>
          יצירת כיתות
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
        
        <View style={styles.mainView}>
          <Text
            style={[
              {
                textAlign: "right",
                fontSize: 20,
                fontWeight: "bold",
                textDecorationLine: "underline",
              },
            ]}
          >
            רשימת הכיתות שלי:{" "}
          </Text>
          {documentIds.length > 0 ? (
            <View>
              {documentIds.sort().map((name) => (
                <Text style={[
                  {
              
                    fontSize: 18,
                    fontWeight: 'bold'
                  },
                ]} key={name}>{name}</Text>
              ))}
            </View>
          ) : (
            <Text>אין כרגע כיתות ברשימה</Text>
          )}
          <View
            style={[
              styles.container,
              isBlueBackground && styles.blueBackground,
            ]}
          >
            <TouchableOpacity style={[styles.button, { backgroundColor: "white" }]} onPress={handlePress}>
              {/* <MaterialCommunityIcons
                style={styles.icon}
                name="plus"
                size={24}
                color="#AD8E70"
              /> */}
              <Text style={styles.buttonText}>יצירת כיתה</Text>
            </TouchableOpacity>

            <>
              <TouchableOpacity onPress={handlePressModa}>
                <Text
                  style={[
                    {
                      fontSize: 16,
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    },
                  ]}
                >
                  להסבר לחצ/י כאן
                </Text>
              </TouchableOpacity>

              <Modal
                visible={modalVisible}
                onRequestClose={handleClose}
                transparent={true}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                    <Image
                      style={[{ height: "60%" }]}
                      source={require("../assets/example1.png")}
                      resizeMode="contain"
                    />

                    <Text style={styles.textModal}>
                      לצורך הוספת כיתה עלייך להעלות קובץ אקסל כמו בדוגמא מטה.
                      קובץ שבו שמות התלמידים מופיעים בעמודה הראשונה בלבד. בכל
                      שורה יופיע שם מלא של תלמיד/ה.
                    </Text>

                    <TouchableOpacity
                      onPress={handleClose}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>המשך</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>

            {showContent && (
              <>
                <TextInput
                  style={[styles.input, { textAlign: "right" }]}
                  placeholder="  שם הכיתה:"
                  value={className}
                  onChangeText={(text) => setclassName(text)}
                />

                <TouchableOpacity
style={[styles.button, { backgroundColor: "white" }]}      
            onPress={() => pickDocument()}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign name="addfile" size={24} color="#AD8E70" />
                    <Text style={styles.buttonText}>בחר/י קובץ</Text>
                  </View>
                </TouchableOpacity>
                {fileResponse && (
                  <Text
                    style={{ color: "green", fontSize: 14, fontWeight: "bold" }}
                  >
                    {uploadText}
                  </Text>
                )}
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                      כמה מקצועות את/ה מלמד/ת בכיתה?
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder=" כנס/י מספר"
                      keyboardType="numeric"
                      onChangeText={(value) => handleNumInputsChange(value)}
                    />
                  </View>

                  {showContent && (
                    <>
                      {Array.from({ length: numInputs }).map((_, index) => (
                        <TextInput
                          style={styles.input}
                          key={index}
                          placeholder={`הכנס/י מקצוע ${index + 1}`}
                          onChangeText={(value) =>
                            handleInputChange(value, index)
                          }
                        />
                      ))}
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={() => readExcelFile()}
                >
                  <Ionicons
                    style={styles.icon}
                    name="create-outline"
                    size={24}
                    color="#AD8E70"
                  />
                  <Text style={styles.buttonText}>יצירת כיתה </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {homePage === true && (
  <TouchableOpacity
    onPress={navigateToHomePage}
  >
    <AntDesign
      style={styles.icon}
      name="home"
      size={24}
      color="#AD8E70"
    />
    <Text style={ { textAlign: "center"}}>דף הבית</Text>
  </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default SetDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
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
  mainView: {
    alignItems: "center",
    flex: 1,
    margin: 10,
  },
  butt: {
    backgroundColor: "#90EE90",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  icon: {
    textAlign: "center",
  },
  image: {
    height: "50%",
    width: "100%",
    alignSelf: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    height: "50%",
    width: "100%",
  },
  textModal: {
    textAlign: "center",
    marginVertical: 10,
  },

  inputContainer: {
    marginBottom: 0,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
  },
});
