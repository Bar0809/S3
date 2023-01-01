import React from 'react';
import { View, TextInput, Button, useState, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


const LoginForm = () => {

  const navigation = useNavigation();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');



  const handleLogin = () => {
    if (email === 'email' && password === 'password') {
      // Navigate to the next screen
    } else {
      // Display an error message
    }
  };

  return (
    <View style={styles.a}>
      <View>
        <View style={styles.textArea}>
          <TextInput style={styles.textIn} value={email} onChangeText={text => setEmail(text)} autoCapitalize="none" />
          <Text style={styles.c}> דוא"ל: </Text>
        </View>
      </View>

      <View style={styles.b}></View> 

      <View style={styles.textArea} >
        <TextInput style={styles.textIn} value={password} onChangeText={text => setPassword(text)} secureTextEntry />
        <Text style={styles.c}> סיסמא: </Text>
      </View>
      

{/* onPress={handleLogin} */}
      <TouchableOpacity style={styles.login}  onPress={() => navigation.navigate('HomePage')}>
        <Text style={styles.text}>התחבר</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signup}>
            <Text style={styles.text}>הירשם</Text>          
          </TouchableOpacity>

      <Text style={styles.fpassword}>שכחתי סיסמא</Text>
      
    </View>
  );
};

export default LoginForm;

const styles=StyleSheet.create({
  textIn: {
    flex:1,
    height: 35,
    width:50,

  },
textArea: {
    flexDirection:'row',
    borderWidth: 1,
    borderColor: 'black',
  
  },
a: {
  paddingTop:300,
  paddingRight:80,
  paddingBottom:50,
  paddingLeft:80,
},
b: {
   paddingTop:20
},
text: {
  color: 'black', 
  fontSize: 18, 
  fontWeight: 'bold'
},
login: {
  backgroundColor: 'grey',
  alignItems: 'center',
  top: 30,
  borderRadius: 200,
  padding: 18,
  height: 60 
},
signup: {
  backgroundColor: 'lightgrey',
  alignItems: 'center',
  top: 40,
  borderRadius: 200,
  padding: 18,
  height: 60 
},
fpassword: {
  top: 50,
  textAlign: 'center'
},
c: {
  fontSize:20,
  fontWeight: 'bold'
}

}
);
