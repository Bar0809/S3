import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import SetDetails from "./SetDetails";

const { width } = Dimensions.get("window");


const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState(null);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [schoolNameError, setSchoolNameError] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateRepeatPassword = (repeatPassword) => {
    return repeatPassword === password;
  };

  const validateName = (name) => {
    const nameRegex = /^[\u0590-\u05FF\u0621-\u064Aa-zA-Z]{2,}$/;
    return name.length > 0 && nameRegex.test(name);
  };
  const handleSignUp = async () => {
    const emailIsValid = validateEmail(email);
    const passwordIsValid = validatePassword(password);
    const repeatPasswordIsValid = validateRepeatPassword(repeatPassword);
    const firstNameIsValid = validateName(firstName);
    const lastNameIsValid = validateName(lastName);
    const schoolNameIsValid = validateName(schoolName);

    setEmailError(emailIsValid ? null : "Invalid email");
    setPasswordError(
      passwordIsValid
        ? null
        : "הסיסמא חייבת להכיל לפחות 8 תווים המכילים אותיות קטנות, גדולות וספרה אחת לפחות."
    );
    setFirstNameError(
      firstNameIsValid ? null : "שם פרטי צריך להכיל לפחות 2 תווים"
    );
    setLastNameError(
      lastNameIsValid ? null : "שם משפחה צריך להכיל לפחות 2 תווים"
    );
    setSchoolNameError(
      schoolNameIsValid ? null : "שם ביהס צריך להכיל לפחות 2 תווים"
    );
    setRepeatPasswordError(
      repeatPasswordIsValid ? null : "הסיסמא אינה תואמת, נסה/י שנית"
    );

    if (
      emailIsValid &&
      passwordIsValid &&
      repeatPasswordIsValid &&
      firstNameIsValid &&
      lastNameIsValid &&
      schoolNameIsValid
    ) {
      const user = await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {})
        .then(async () => {
          await setDoc(doc(db, "Teachers", auth.currentUser.uid), {
            email: email,
            first_name: firstName,
            last_name: lastName,
            school_name: schoolName,
            sensitivity: "medium",
          });
        })
        .then(() => {
          navigation.navigate("SetDetails");
        })
        .catch(function (e) {
          Alert.alert("אירעה שגיאה בלתי צפויה", e.message);
        });
    } else {
      
    }
  };

  return (
    <View style={styles.container}>
    <View>
      <Image source={require("../assets/miniLogo-removebg-preview.png")} />
    </View>

    <View style={styles.title}>
      <Text style={styles.pageTitle}> יצירת משתמש חדש</Text>

    </View>
    
    <Text>{"\n"}</Text>

      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=' הכנס/י דוא"ל'
        value={email}
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      {emailError && <Text style={styles.errorMessage}>{emailError}</Text>}
     
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder="הכנס/י שם פרטי "
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      ></TextInput>
      {firstNameError && (
        <Text style={styles.errorMessage}>{firstNameError}</Text>
      )}
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=" הכנס/י שם משפחה"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      ></TextInput>
      {lastNameError && (
        <Text style={styles.errorMessage}>{lastNameError}</Text>
      )}
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=' הכנס/י שם ביה"ס בו את/ה מלמד/ת'
        value={schoolName}
        onChangeText={(text) => setSchoolName(text)}
      ></TextInput>
      {schoolNameError && (
        <Text style={styles.errorMessage}>{schoolNameError}</Text>
      )}
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=" הכנס/י סיסמא"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      ></TextInput>
      {passwordError && (
        <Text style={styles.errorMessage}>{passwordError}</Text>
      )}
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder="  הכנס/י סיסמא בשנית"
        value={repeatPassword}
        onChangeText={(text) => setRepeatPassword(text)}
        secureTextEntry
      ></TextInput>
      {repeatPasswordError && (
        <Text style={styles.errorMessage}>{repeatPasswordError}</Text>
      )}

      <View >
        <Text>{"\n"}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>יצירת חשבון</Text>
        </TouchableOpacity>
      </View>


        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate("FullLogin")}
        >
          <Text style={styles.text}>חזור למסך ההתחברות</Text>
        </TouchableOpacity>
    </View>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 300,
    backgroundColor: "white",
    marginBottom:10
  },
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
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
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
});
