import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Image,
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
import Navbar from "./Navbar";
const { width } = Dimensions.get("window");

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
      alert("הקטגוריות נשמרו בהצלחה!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/miniLogo-removebg-preview.png")} />
      </View>

      <View style={styles.title}>
        <Text style={[styles.pageTitle, { textAlign: "center" }]}>
          איזור אישי
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
        <View style={[{ padding: 20 }]}>
          <Text style={[styles.subTitle]}>פרטים אישיים: </Text>

          <View style={styles.row}>
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

        {info === false ? (
          <View style={[{ padding: 20 }]}>
            <Text style={[styles.subTitle]}>
              הגדר/י 2 נושאים לדיווח לפי רצונך:{" "}
            </Text>
            <View style={{ textAlign: "right", alignItems: "flex-end" }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setMyChoice1(text)}
                value={myChoice1}
                placeholder="הכנס/י את הקטגוריה הראשונה לבחירתך"
              />
              <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                בחר/י את אפשרות הדיווח:
              </Text>
            </View>

            <View style={{ textAlign: "right", alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setIcons1(true)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text>אייקונים והערות</Text>

                <RadioButton
                  value={icons1}
                  status={icons1 ? "checked" : "unchecked"}
                  onPress={() => setIcons1(true)}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIcons1(false)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text>הערות בלבד</Text>

                <RadioButton
                  value={!icons1}
                  status={!icons1 ? "checked" : "unchecked"}
                  onPress={() => setIcons1(false)}
                />
              </TouchableOpacity>
            </View>

            <View style={{ textAlign: "right", alignItems: "flex-end" }}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setMyChoice2(text)}
                value={myChoice2}
                placeholder="הכנס/י את הקטגוריה השנייה לבחירתך"
              />
              <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                בחר/י את אפשרות הדיווח:
              </Text>
            </View>

            <View style={{ textAlign: "right", alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setIcons2(true)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text>אייקונים והערות</Text>

                <RadioButton
                  value={icons2}
                  status={icons2 ? "checked" : "unchecked"}
                  onPress={() => setIcons2(true)}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIcons2(false)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text>הערות בלבד</Text>

                <RadioButton
                  value={!icons2}
                  status={!icons2 ? "checked" : "unchecked"}
                  onPress={() => setIcons2(false)}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={saveNames}>
              <Text style={[styles.buttonText]}>שמור שינויים</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={[styles.subTitle]}>קטגוריות הדיווח האישיים: </Text>

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

        <Text>{"\n"}</Text>
        <View>
          <TouchableOpacity
            style={styles.fpassword}
            onPress={() => {
              navigation.navigate("Fpassword");
            }}
          >
            <Text style={[{ fontWeight: "bold", fontSize: 16 }]}>
              איפוס/שינוי סיסמה
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Text>{"\n\n\n\n\n\n"}</Text>

      <Navbar />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  pageTitle: {
    color: "#AD8E70",
    fontSize: 36,
    fontWeight: "bold",
    padding: 10,
    // textShadowColor: "rgba(0, 0, 0, 0.25)",
    // textShadowOffset: { width: 2, height: 2 },
    // textShadowRadius: 2,
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
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
    textAlign: "right",
  },
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
  subTitle: {
    fontSize: 24,
    textAlign: "right",
    fontWeight: "bold",
    color: "#AD8E70",
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

  fpassword: {
    width: width * 0.4,
    height: 100,
    justifyContent: "center",
    backgroundColor: "#F1DEC9",
    borderWidth: 2,
    borderColor: "#F1DEC9",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
    alignSelf: "center",
  },
});
