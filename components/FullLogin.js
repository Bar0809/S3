import React from "react";
import {
  View,
  TextInput,
  Button,
  useState,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const FullLogin = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("HomePage");
    } catch (error) {
      Alert.alert("אופס", "כתובת המייל ו/או הסיסמה שגויים, אנא נסה/י שוב");
    }
  };

  return (
    <View style={styles.mainView}>
      <Image style={styles.image} source={require("../assets/logo2.png")} />
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=' דוא"ל:'
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      ></TextInput>
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder="סיסמא:"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      ></TextInput>

      <TouchableOpacity style={styles.login} onPress={handleLogin}>
        <Text style={styles.text}> התחבר/י</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signup}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.text}>הירשם/י</Text>
      </TouchableOpacity>

      <Text
        style={styles.fpassword}
        onPress={() => navigation.navigate("Fpassword")}
      >
        שכחתי סיסמא
      </Text>
    </View>
  );
};
export default FullLogin;

const styles = StyleSheet.create({
  mainView: {
    alignItems: "center",
    padding: 50,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    height: "10%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizintal: 10,
    marginVertical: 10,
    textAlign: "rigth",
  },
  image: {
    width: "100%",
    // maxWidth: 300,
    // maxHeight: 200,
  },
  login: {
    backgroundColor: "#1E90FF",
    alignItems: "center",
    top: 30,
    borderRadius: 200,
    padding: 18,
    height: 60,
    width: "50%",
  },
  signup: {
    backgroundColor: "#87CEFA",
    alignItems: "center",
    top: 40,
    borderRadius: 200,
    padding: 18,
    width: "50%",
  },
  fpassword: {
    top: 50,
    textAlign: "center",
  },
});
