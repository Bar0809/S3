import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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

const ChooseClass = (props) => {
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
    setData(classNames);
    setIds(classIds);
  };

  useEffect(() => {
    getClasses().catch(console.error);
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ChooseCourse", {
            reported: props.route.params.param1,
            className: item,
            classId: ids[index],
          })
        }
      >
        <Text
          style={{
            padding: 10,
            fontSize: 22,
            textAlign: "center",
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
    <View tyle={styles.allPage}>
      <Toolbar />

      <View style={styles.title}>
        <FontAwesome
          name="users"
          size={40}
          color="black"
          style={[{ paddingLeft: -50 }]}
        />
        <Text style={styles.pageTitle}>הכיתות שלי:</Text>
      </View>

      <Text style={styles.subTitle}> בחר/י את הכיתה הרצויה</Text>

      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={{ alignItems: "center", position: "relative" }}
        />
      </View>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("HomePage")}
      >
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text>הקודם</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseClass;

const styles = StyleSheet.create({
  allPage: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    alignItems: "center",
  },
  pageTitle: {
    color: "black",
    fontSize: 50,
    fontWeight: "bold",
  },
  back: {
    padding: "40%",
    alignItems: "center",
  },
  subTitle: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "right",
  },
});
