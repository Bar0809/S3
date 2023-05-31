import React, { useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [checked, setChecked] = useState("medium");
  const navigation = useNavigation();
  const [myChoice1, setMyChoice1] = useState("");
  const [myChoice2, setMyChoice2] = useState("");
  const [info, setInfo] = useState(false);
  const [icons1, setIcons1] = useState(true);
  const [icons2, setIcons2] = useState(true);

  useEffect(() => {
    const teacherRef = doc(collection(db, "Teachers"), auth.currentUser.uid);
    updateDoc(teacherRef, { sensitivity: checked }).catch((error) => {
      Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
    });
  }, [checked]);

  useEffect(() => {
    const teacherRef = doc(collection(db, "Teachers"), auth.currentUser.uid);
    getDoc(teacherRef)
      .then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData(data);
        } else {
          // console.log("No such document!");
        }
      })
      .catch((error) => {
        Alert.alert("אירעה שגיאה בלתי צפויה", error.message);
      });
  }, []);

  useEffect(() => {
    const getMyReportsType = async () => {
      const q = query(
        collection(db, "users"),
        where("t_id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        setInfo(true);
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        setMyChoice1(data.myChoice1);
        setMyChoice2(data.myChoice2);
      });
    };

    getMyReportsType(); // Call the function here
  }, []);

  const saveNames = async () => {
    try {
      const inputsRef = doc(collection(db, "users"));
      await setDoc(inputsRef, {
        myChoice1: myChoice1,
        myChoice2: myChoice2,
        t_id: auth.currentUser.uid,
        icons1: icons1,
        icons2: icons2,
      });
      setInfo(true);
      alert("Names saved successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View>
        <Toolbar />
        <View style={styles.title}>
          <Text style={styles.pageTitle}>האיזור אישי: </Text>
        </View>

        <View style={[{ padding: 20 }]}>
          <Text
            style={[
              {
                textAlign: "right",
                fontSize: 24,
                fontWeight: "bold",
                textDecorationLine: "underline",
              },
            ]}
          >
            פרטים אישיים-{" "}
          </Text>

          <View style={styles.row}>
            <Entypo name="edit" size={24} color="black" />
            <Text
              style={[{ textAlign: "right", fontWeight: "bold", fontSize: 20 }]}
            >
              שם פרטי:{" "}
            </Text>
            <Text style={[{ textAlign: "right", fontSize: 20 }]}>
              {userData.first_name}{" "}
            </Text>
          </View>

          <View style={styles.row}>
            <Entypo name="edit" size={24} color="black" />
            <Text
              style={[{ textAlign: "right", fontWeight: "bold", fontSize: 20 }]}
            >
              שם משפחה:
            </Text>
            <Text style={[{ textAlign: "right", fontSize: 20 }]}>
              {userData.last_name}{" "}
            </Text>
          </View>

          <View style={styles.row}>
            <Text
              style={[{ textAlign: "right", fontWeight: "bold", fontSize: 20 }]}
            >
              כתובת דוא"ל:{" "}
            </Text>
            <Text style={[{ textAlign: "right", fontSize: 20 }]}>
              {userData.email}{" "}
            </Text>
          </View>

          <View style={styles.row}>
            <Entypo name="edit" size={24} color="black" />
            <Text
              style={[{ textAlign: "right", fontWeight: "bold", fontSize: 20 }]}
            >
              שם ביה"ס:
            </Text>
            <Text style={[{ textAlign: "right", fontSize: 20 }]}>
              {userData.school_name}{" "}
            </Text>
          </View>
        </View>

        <View style={[{ padding: 20 }]}>
          <Text
            style={[
              {
                textAlign: "right",
                fontSize: 24,
                fontWeight: "bold",
                textDecorationLine: "underline",
              },
            ]}
          >
            התאמה אישית-{" "}
          </Text>
          <Text style={[{ textAlign: "right", fontSize: 18, color: "red" }]}>
            בחר/י את רגישות ההתראות להתנהגויות בכיתה
          </Text>

          <RadioButton.Group
            onValueChange={(value) => setChecked(value)}
            value={checked}
          >
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                label="רגישות גבוהה"
                value="high"
                style={styles.radioButtonItem}
              />
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                label="רגישות בינונית"
                value="medium"
                style={styles.radioButtonItem}
              />
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Item
                label="רגישות נמוכה"
                value="low"
                style={styles.radioButtonItem}
              />
            </View>
          </RadioButton.Group>
        </View>

        {info === false ? (
          <View style={[{ padding: 20 }]}>
            <Text
              style={[
                {
                  textAlign: "right",
                  fontSize: 24,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                },
              ]}
            >
              הגדר/י 2 נושאים לדיווח לפי רצונך:{" "}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setMyChoice1(text)}
              value={myChoice1}
              placeholder="נושא 1"
            />
            <Text>בחר/י את אפשרות הדיווח:</Text>

            <View>
              <TouchableOpacity
                onPress={() => setIcons1(true)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <RadioButton
                  value={icons1}
                  status={icons1 ? "checked" : "unchecked"}
                  onPress={() => setIcons1(true)}
                />

                <Text>אייקונים והערות</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIcons1(false)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <RadioButton
                  value={!icons1}
                  status={!icons1 ? "checked" : "unchecked"}
                  onPress={() => setIcons1(false)}
                />
                <Text>הערות בלבד</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              onChangeText={(text) => setMyChoice2(text)}
              value={myChoice2}
              placeholder="נושא 2"
            />

            <View>
              <TouchableOpacity
                onPress={() => setIcons2(true)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <RadioButton
                  value={icons2}
                  status={icons2 ? "checked" : "unchecked"}
                  onPress={() => setIcons2(true)}
                />

                <Text>אייקונים והערות</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIcons2(false)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <RadioButton
                  value={!icons2}
                  status={!icons2 ? "checked" : "unchecked"}
                  onPress={() => setIcons2(false)}
                />
                <Text>הערות בלבד</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveNames}>
              <Text style={styles.buttonText}>Save names</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text
              style={[
                {
                  textAlign: "right",
                  fontSize: 24,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                },
              ]}
            >
              נושאי הדיווח האישיים:{" "}
            </Text>

            <View style={styles.row}>
              <Text
                style={[
                  { textAlign: "right", fontWeight: "bold", fontSize: 20 },
                ]}
              >
                {" "}
                [1]
              </Text>
              <Text style={[{ textAlign: "right", fontSize: 20 }]}>
                {myChoice1}{" "}
              </Text>
            </View>

            <View style={styles.row}>
              <Text
                style={[
                  { textAlign: "right", fontWeight: "bold", fontSize: 20 },
                ]}
              >
                {" "}
                [2]
              </Text>
              <Text style={[{ textAlign: "right", fontSize: 20 }]}>
                {myChoice2}{" "}
              </Text>
            </View>
          </View>
        )}

        <View style={[{ flex: 1, alignItems: "center" }]}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.navigate("HomePage")}
          >
            <MaterialIcons name="navigate-next" size={24} color="black" />
            <Text style={[{ textAlign: "left" }]}>הקודם</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "black",
    fontSize: 40,
    fontWeight: "bold",
    padding: 10,
  },
  row: {
    textAlign: "right",
    flexDirection: "row-reverse",
    alignItems: "flex-end",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  radioButtonItem: {
    textAlign: "right",
  },
  input: {
    height: 80,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 100,
    backgroundColor: "white",
  },
});
