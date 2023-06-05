import {
  View,
  Text,
  StyleSheet, Image,ScrollView,
  TouchableOpacity,Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "./Navbar";

import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const { width } = Dimensions.get('window');

const ChooseClass = ({ route }) => {
  const { reported } = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [ids, setIds] = useState([]);

  const getClasses = async () => {
    const q = query(
      collection(db, "Classes"),
      where("t_id", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const classNames = [];
    const classIds = [];

    querySnapshot.forEach((doc) => {
      const classData = doc.data();
      const classId = doc.id;
      if (classData.class_name) {
        classNames.push(classData.class_name);
      }
      if (classId) {
        classIds.push(classId);
      }
    });
    
    
    let classIdPairs = classNames.map((className, index) => {
      return { className, id: classIds[index] };
    });
    
    classIdPairs.sort((a, b) => a.className.localeCompare(b.className));
    
    classes = classIdPairs.map(pair => pair.className);
    let IDS = classIdPairs.map(pair => pair.id);
    setData(classes);
    setIds(IDS);
  };

  useEffect(() => {
    getClasses().catch(console.error);
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChooseCourse", {
            reported: reported,
            className: item,
            classId: ids[data.indexOf(item)],
          })
        }
      >
        <Text
          style={{
            padding: 10,
            fontSize: 22,
            textAlign: "center",
            textDecorationLine: "underline",
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  
  
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>
  
      <View style={styles.title}>
        <Text style={styles.pageTitle}>רשימת הכיתות: </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.subTitle}> בחר/י את הכיתה הרצויה</Text>
  
        <View>
  {data.map((item, index) => (
    <View key={item + index} style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChooseCourse", {
            reported: reported,
            className: item,
            classId: ids[data.indexOf(item)],
          })
        }
      >
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    </View>
  ))}
</View>

      </ScrollView>
  
      <Navbar />
    </View>
  );
  };

export default ChooseClass;

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
    fontSize: 48,
    fontWeight: "bold",
    padding: 10,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 24,
    textAlign: "right",
    fontWeight: "bold",
  },
});