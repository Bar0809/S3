import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert, Image, Dimensions
} from "react-native";
import React, { useState } from "react";
import { auth } from "./firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";

  const { width } = Dimensions.get("window");

const Fpassword = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handlePassword = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("אימייל לאיפוס סיסמה נשלח אל: " + email);
      })
      .then(() => {
        navigation.navigate("FullLogin");
      })
      .catch(function (e) {
        Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
      });
  };

  return (
    <View style={styles.container}>
      <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={styles.title}>
      <Text style={styles.pageTitle}>
איפוס סיסמה      </Text>
    </View>

<Text  style={[ { textAlign: "right", fontSize:16, fontWeight:'bold' }]}>הכנס/י את כתובת המייל:</Text>
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=' דוא"ל:'
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      ></TextInput>
      <Text>{"\n\n"}</Text>


      <TouchableOpacity style={styles.button} onPress={handlePassword}>
        <Text style={styles.buttonText}>שלח/י</Text>
      </TouchableOpacity>
      <Text>{"\n"}</Text>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("FullLogin")}
      >
        <Text style={styles.text}>חזרה למסך ההתחברות</Text>
      </TouchableOpacity>

      <Navbar/>

    </View>
  );
};

export default Fpassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    textAlign: "center" ,

  },
  pageTitle: {
    textAlign: "center" ,
    color: "#AD8E70",
    fontSize: 40,
    fontWeight: "bold",
    padding: 10,

  },
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
    textAlign: "right"
    },
    
  button: {
    width: width * 0.4,
    height: 55,
    justifyContent: "center",
    backgroundColor: "#F1DEC9",
    borderWidth: 2,
    borderColor: "#F1DEC9",
    alignItems: "center",
    // marginHorizontal: 5,
    marginVertical: -10,
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
});
