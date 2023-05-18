import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import SetDetails from "./SetDetails";

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
        : "Password must contain at least 8 characters, including uppercase and lowercase letters, and at least one digit"
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
      repeatPasswordIsValid ? null : "Passwords do not match"
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
      // If any of the input fields contain an error, do not reset any fields
      // and let the user correct the errors
    }
  };

  return (
    <View style={styles.all}>
      <Text style={styles.title}>צור משתמש: </Text>
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=' הכנס/י דוא"ל'
        value={email}
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      {emailError && <Text style={styles.errorMessage}>{emailError}</Text>}
      <TextInput
        style={[styles.input, { textAlign: "right", marginBottom: 20 }]}
        placeholder="  שם פרטי:"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      ></TextInput>
      {firstNameError && (
        <Text style={styles.errorMessage}>{firstNameError}</Text>
      )}
      <TextInput
        style={[styles.input, { textAlign: "right", marginBottom: 20 }]}
        placeholder=" שם משפחה:"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      ></TextInput>
      {lastNameError && (
        <Text style={styles.errorMessage}>{lastNameError}</Text>
      )}
      <TextInput
        style={[styles.input, { textAlign: "right", marginBottom: 20 }]}
        placeholder=' שם ביה"ס:'
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

      <View style={styles.butt}>
        <TouchableOpacity style={styles.signup} onPress={handleSignUp}>
          <Text style={styles.text}>יצירת חשבון</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.navigate("FullLogin")}
        >
          <Text style={styles.text}>חזור למסך ההתחברות</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SignUp;

const styles = StyleSheet.create({
  butt: {
    alignItems: "center",
  },
  title: {
    padding: 40,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    height: "6%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizintal: 10,
    marginVertical: 8,
  },
  signup: {
    backgroundColor: "#87CEFA",
    alignItems: "center",
    borderRadius: 200,
    padding: 25,
    width: "50%",
    top: 20,
  },
  back: {
    color: "gray",
    alignItems: "center",
    padding: 30,
    width: "50%",
    top: 20,
  },
  text: {
    color: "grey",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});
