import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Navbar from "./Navbar";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { FontAwesome5 } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

const MyClasses = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [classesChanged, setClassesChanged] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setClassesChanged(true);
    }, [])
  );

  useEffect(() => {
    if (classesChanged) {
      getClasses()
        .then(() => setClassesChanged(false))
        .catch((error) => Alert.alert("אירעה שגיאה בלתי צפויה", error.message));
    }
  }, [classesChanged]);

  const getClasses = async () => {
    const q = query(
      collection(db, "Classes"),
      where("t_id", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const classList = [];
  
    querySnapshot.forEach((doc) => {
      const classData = doc.data();
      if (classData.class_name) {
        const classItem = {
          class_id: doc.id,
          class_name: classData.class_name,
          class_color: '',
          class_description: '',
        };
        classList.push(classItem);
      }
    });
  
    classList.sort((a, b) => a.class_name.localeCompare(b.class_name));
  
    for (const classItem of classList) {
      const colorsQuery = query(
        collection(db, "Colors"),
        where("class_id", "==", classItem.class_id)
      );
  
      const colorsQuerySnapshot = await getDocs(colorsQuery);
  
      colorsQuerySnapshot.forEach((doc) => {
        const colorData = doc.data();
        if (colorData.class_color) {
          classItem.class_color = colorData.class_color;
          classItem.class_description= colorData.class_description;
          return;
        }
      });
    }

   
    setData(classList);

  };
  
  
  const handleColors = async (classId) => {
    let color;
    let class_name;
    let description;
      for (const classItem of data) {
        if (classItem.class_id === classId) {
          class_name= classItem.class_name;
          description=classItem.class_description;
         if(classItem.class_color==='green'){
          color='ירוק';
         }
         else if(classItem.class_color==='orange'){
          color='כתום';

         }
         else{
          color='אדום';

         }
        }
      }
      
    Alert.alert(' צבע הרמזור' , `הכיתה ${class_name} קיבלה את הצבע ה- ${color}.${description}`
    , [
      {
        text: "אוקיי",
        onPress: () => {},
        style: "cancel",
      },
    ]);
    };
    

    



  const handleDeleteClasses = async (classId) => {
    const q = query(
      collection(db, "Classes"),
      where("t_id", "==", auth.currentUser.uid),
      where("__name__", "==", classId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      Alert.alert("שגיאה");
      return;
    }

    Alert.alert(
      "מחיקת כיתה",
      "את/ה בטוח/ה שאת/ה רוצה למחוק את הכיתה?",
      [
        {
          text: "לא",
        },
        {
          text: "כן",
          onPress: async () => {
            querySnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
            setClassesChanged(true);
            Alert.alert("הכיתה נמחקה בהצלחה");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddClass = () => {
    setClassesChanged(true);
    navigation.navigate("SetDetails");
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleDeleteClasses(item.class_id)}>
        <MaterialIcons name="delete" size={24} color="#AD8E70" />
      </TouchableOpacity>

      <TouchableOpacity  onPress={() => handleColors(item.class_id)}>
              <FontAwesome5 name="traffic-light" size={24} color= {item.class_color} />
            </TouchableOpacity>
      <TouchableOpacity
        style={styles.itemTextContainer}
        onPress={() =>
          navigation.navigate("ClassDetails", {
            class_id: item.class_id,
            class_name: item.class_name,
          })
        }
      >
        <Text style={styles.itemText}>{item.class_name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>
      <View style={styles.title}>
        <Text style={styles.pageTitle}>הכיתות שלי: </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
{data.sort((a, b) => a.class_name.localeCompare(b.class_name)).map((item) => (
          <View key={item.class_id} style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => handleDeleteClasses(item.class_id)}
            >
              <MaterialIcons name="delete" size={24} color="#AD8E70" />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => handleColors(item.class_id)}>
              <FontAwesome5 name="traffic-light" size={24} color= {item.class_color} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.itemTextContainer}
              onPress={() =>
                navigation.navigate("ClassDetails", {
                  class_id: item.class_id,
                  class_name: item.class_name,
                })
              }
            >
              <Text style={[styles.itemText]}>{item.class_name}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text>{"\n"}</Text>

        <TouchableOpacity style={styles.button} onPress={handleAddClass}>
          <Text style={styles.buttonText}>הוסף כיתה</Text>
        </TouchableOpacity>
      </ScrollView>

      <Navbar />
    </View>
  );
};

export default MyClasses;

const styles = StyleSheet.create({
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

  itemContainer: {
    flexDirection: "row",
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
    textDecorationLine: "underline",
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
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginLeft: 20,
    marginRight: 20,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 22,
    textAlign: "right",
    textDecorationLine: "underline",
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pageTitle: {
    color: '#AD8E70',
      fontSize: 48,
    fontWeight: 'bold',
    padding: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
});
