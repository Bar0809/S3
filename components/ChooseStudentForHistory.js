import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toolbar from "./Toolbar";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { RadioButton } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";

const ChooseStudentForHistory = ({ route }) => {
  const { className } = route.params;
  const { classId } = route.params;

  const [students, setStudents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getStudents = async () => {
      const q = query(
        collection(db, "Students"),
        where("class_id", "==", classId)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setStudents(data);
    };
    getStudents();
  }, []);

  const onPressStudent = (student) => {
    navigation.navigate("HistoryForStudent", {
      student_name: student.student_name,
      s_id: student.id,
    });
  };

  return (
    <View>
      <Toolbar />
      <View style={styles.report}>
        <Text style={{ fontSize: 16, padding: 10, color: "red" }}>
          {" "}
          בחר תלמיד
        </Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onPressStudent(item)}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.student_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChooseStudentForHistory;

const styles = StyleSheet.create({
  back: {
    padding: "30%",
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "right",
    justifyContent: "flex-end",
  },

  container: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    marginBottom: 16,
    justifyContent: "space-around",
  },
  name: {
    fontWeight: "bold",
    marginRight: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginRight: 16,
  },
  radioButtonItem: {
    height: 24,
    width: 24,
  },
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
  },
  butt: {
    backgroundColor: "#90EE90",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 100,
  },
});
