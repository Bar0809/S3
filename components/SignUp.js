import { View, Text ,StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert} from 'react-native'
import React, {useState} from 'react'
import { auth } from './firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
const navigation = useNavigation();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [repeatPassword, setRepeatPassword] = useState('');
const handleSignUp = async () => {
    const user = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then(() => {
      Alert.alert("הרשמה בוצעה בהצלחה, בצע התחברות");
  })
  .then(() => {
      navigation.navigate("FullLogin")
  })
  .catch(function (e) {
      console.warn(e.message);
  });
};
  return (
    //  <ScrollView showVerticalScrollIndicator={false}>
      <View style={styles.all}>
        <Text style={styles.title}>צור משתמש: </Text>
        {/* <Text style={[styles.text, {textAlign: 'right'}]}> שם מלא:</Text>
        <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' הכנס/י שם מלא' ></TextInput> */}
        <Text style={[styles.text, {textAlign: 'right'}]}> דוא"ל :</Text>
        <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' הכנס/י דוא"ל' value={email} onChangeText={text => setEmail(text)}></TextInput>
        <Text style={[styles.text, {textAlign: 'right'}]}> סיסמא :</Text>
        <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' הכנס/י סיסמא' value={password} onChangeText={text => setPassword(text)} secureTextEntry></TextInput>
        <Text style={[styles.text, {textAlign: 'right'}]}> אימות סיסמא:</Text>
        <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder='  הכנס/י סיסמא בשנית' value={repeatPassword} onChangeText={text => setRepeatPassword(text)} secureTextEntry></TextInput>
        {/* <Text style={[styles.text, {textAlign: 'right'}]}> שם ביה"ס:</Text> */}
        {/* <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' מספר כיתות:' keyboardType='numeric' ></TextInput> */}
       
       <View style={styles.butt}>
        <TouchableOpacity style={styles.signup}  onPress={handleSignUp} >
            <Text style={styles.text}>יצירת חשבון</Text>          
          </TouchableOpacity>
          <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('FullLogin')} >
            <Text style={styles.text}>חזור למסך ההתחברות</Text>          
          </TouchableOpacity>
          </View>
      </View>
    //  </ScrollView>

  )
}

export default SignUp;

const styles=StyleSheet.create({
  butt:{
     alignItems: 'center',
  },
  title: {
    padding: 40,
    fontSize:35,
    fontWeight:'bold',
    textAlign:'center',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: '8%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizintal: 10,
    marginVertical: 8,
  },
  signup: {
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    borderRadius: 200,
    padding: 25,
    width: '50%',
    top:20,
  },
  back: {
    color: 'gray',
    alignItems: 'center',
    padding: 30,
    width: '50%',
    top:20,
  },
  text:{
    color:'grey',
  }
}
);
