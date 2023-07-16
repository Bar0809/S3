import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,ScrollView
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toolbar from "./Toolbar";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "./Navbar";


const ClassData = () => {
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
          navigation.navigate("SelectCategory", {
            className: item,
            classId: ids[index],
          })
        }
      >
        <Text
          style={{
            padding: 10,
            fontSize: 22,
            textAlign: "right",
            textDecorationLine: "underline",
            flexDirection: "column",
            justifyContent: "center",
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
    <Text style={[styles.pageTitle]}>היסטוריה לפי כיתה </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>

<View >
  <Text style={styles.subTitle}> בחר/י את הכיתה הרצויה</Text>



      <View style={{ alignItems: "center", position: "relative" }}>
      {data.map((item, index) => (
        <React.Fragment key={item + index}>
          {renderItem({ item, index })}
        </React.Fragment>
      ))}
    </View>
</View>
      
</ScrollView>
<Navbar/>
    </View>

  );
};

export default ClassData;

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "#AD8E70",
    fontSize: 30,
    fontWeight: "bold",
    padding: 10,
  },
  subTitle: {
    fontSize: 22,
    textAlign: "right",
    fontWeight: "bold",
  }, scrollContainer: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
});
