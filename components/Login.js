import React from 'react';
import { View, TextInput, Button, useState, StyleSheet, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import SignUp from './SignUp';
import HomePage from './HomePage';
import { auth } from './firebase'
const LoginForm = () => {

  const navigation = useNavigation();

  // const [email, setEmail] = React.useState('');
  // const [password, setPassword] = React.useState('');
  // const handleLogin = () => {
  //   auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then(userCredentials => {
  //       const user = userCredentials.user;
  //       console.log('Logged in with:', user.email);
  //     })
  //     .catch(error => alert(error.message))
  // }

  // // Add a new user to the database
  // firebase.database().ref('users/user1').set({
  //   name: 'John',
  //   age: 30
  // });


  return (
    // <ScrollView showVerticalScrollIndicator={false}>
    <View style={styles.a}>
      {/* <View>
        <View style={styles.textArea}>
          <TextInput style={styles.textIn} value={email} onChangeText={text => setEmail(text)} autoCapitalize="none" placeholder="אימייל" />
          <Text style={styles.c}>  </Text>
        </View>
      </View>

      <View style={styles.b}></View> 

      <View style={styles.textArea} >
        <TextInput style={styles.textIn} value={password} onChangeText={text => setPassword(text)} secureTextEntry placeholder="סיסמא"/>
        <Text style={styles.c}>  </Text>
      </View>
      

      <TouchableOpacity style={styles.login}  onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.text}> התחבר/י</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signup}  onPress={() => navigation.navigate('SignUp')} >
            <Text style={styles.text}>הירשם/י</Text>          
          </TouchableOpacity>

      <Text style={styles.fpassword} onPress={() => navigation.navigate('Fpassword')}>שכחתי סיסמא</Text>
       */}
       <TextInput style={styles.textIn} value={email} onChangeText={text => setEmail(text)} autoCapitalize="none" placeholder="אימייל" />
    </View>
    // </ScrollView>
  );
};

export default LoginForm;

const styles=StyleSheet.create({
  textIn: {
    flex:1,
    height: 35,
    width:50,
    textAlign:'center'

  },
// textArea: {
//     flexDirection:'row',
//     borderWidth: 1,
//     borderColor: 'black',
  
//   },
 a: {
//   paddingTop:300,
//   paddingRight:80,
//   paddingBottom:50,
//   paddingLeft:80,
    width: '100%',
    alignItems: 'center',
    padding: 30,

 },
// b: {
//    paddingTop:20
// },
// text: {
//   color: 'black', 
//   fontSize: 18, 
//   fontWeight: 'bold'
// },
// login: {
//   backgroundColor: '#1E90FF',
//   alignItems: 'center',
//   top: 30,
//   borderRadius: 200,
//   padding: 18,
//   height: 60 
// },
// signup: {
//   backgroundColor: '#87CEFA',
//   alignItems: 'center',
//   top: 40,
//   borderRadius: 200,
//   padding: 18,
//   height: 60 
// },
// fpassword: {
//   top: 50,
//   textAlign: 'center'
// },
// c: {
//   fontSize:20,
//   fontWeight: 'bold'
// }

}
);
