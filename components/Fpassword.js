import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react'
import { auth } from './firebase'
import {sendPasswordResetEmail} from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';


const Fpassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handlePassword = async () => {
    await sendPasswordResetEmail(auth, email)
        .then(() => {
            Alert.alert("אימייל לאיפוס סיסמא נשלח אל: " + email);
        })
        .then(() => {
            navigation.navigate("FullLogin")
        })
        .catch(function (e) {
            console.warn(e);
        });
};

  return (
    <View style={styles.mainView}>
      <Text>אפס סיסמא</Text>
      <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' דוא"ל:' value={email} onChangeText={text => setEmail(text)} autoCapitalize="none"></TextInput>

      <TouchableOpacity style={styles.login}  onPress={handlePassword}>
        <Text style={styles.text}>שלח</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.back}  onPress={() => navigation.navigate('FullLogin')} >
            <Text style={styles.text}>חזרה להתחברות</Text>          
          </TouchableOpacity>
    </View>
  )
}

export default Fpassword

const styles=StyleSheet.create({
  mainView: {
    alignItems: 'center',
    padding: 50,
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: '25%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizintal: 10,
    marginVertical: 10,
    textAlign: 'rigth'
  },
  image: {
    width: '100%',
  },
  login: {
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    top: 30,
    borderRadius: 200,
    padding: 18,
    height: 60,
    width: '50%' 
    },
    back: {
      backgroundColor: '#87CEFA',
      alignItems: 'center',
      top: 40,
      borderRadius: 200,
      padding: 18,
      width: '50%' 
    },
    fpassword: {
      top: 50,
      textAlign: 'center'
    },

}
);