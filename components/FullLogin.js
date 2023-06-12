import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const { width, height } = Dimensions.get("window");

const FullLogin = () => {
  const navigation = useNavigation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("HomePage");
    } catch (error) {
      Alert.alert(
        "אופס",
        "כתובת המייל ו/או הסיסמה שגויים, אנא נסה/י שוב"
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F2E3DB" />
      <Image style={styles.image} source={require("../assets/logo2.png")} />
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder=' הכנס/י דוא"ל'
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      ></TextInput>
      <TextInput
        style={[styles.input, { textAlign: "right" }]}
        placeholder='הכנס/י סיסמא'
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
  container: {
    flex: 1,
    backgroundColor: "#F2E3DB",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "white",
    width: "80%",
    height: "8%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    textAlign: "right",
  },
  image: {
    width: "90%",
  },
  login: {
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
  signup: {
    width: width * 0.4,
    height: 65,
    justifyContent: "center",
    backgroundColor: "white",
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
  fpassword: {
    textAlign: "center",
  },
  text: {
    color: "#A4907C",
    fontSize: 24,
  },
});
