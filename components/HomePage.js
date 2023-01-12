import React from 'react';
import { View, TextInput, Button, useState, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toolbar from './Toolbar';
import { auth } from './firebase'
import {signOut} from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('FullLogin')
    } catch (error) {
      Alert.alert("אופס",error.message);
    }
  };
  return (
    <View style={styles.row}>
      <Toolbar/>

      {/* <View style={styles.loc}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.butt1} >
                    <Text style={styles.text}>הכיתות שלי</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.butt2}>
                    <Text style={styles.text}>דיווח</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.loc}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.butt3} >
                    <Text style={styles.text}>גרפים ונתונים</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.butt4}>
                    <Text style={styles.text}>גלריה</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.loc}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.butt5} >
                    <Text style={styles.text}>איזור אישי</Text>
                </TouchableOpacity>
            </View>
        </View> */}
        <TouchableOpacity style={styles.text} onPress={handleLogout} >
            <Text style={styles.text}>התנתק</Text>          
          </TouchableOpacity>
    </View>
   
  );
};

export default HomePage;

const styles=StyleSheet.create({
row:{
  flex: 1,
    // flexDirection:'row', 
    alignItems: 'center' 
},
butt1:{
    backgroundColor:'#f6f9ff',
    borderRadius:20,
    width: '35%',
    height: '100%',
    marginHorizontal: 30,
    borderWidth:1,
},
butt2:{
    backgroundColor:'#ecf2ff',
    borderRadius:20,
    width: '35%',
    height: '100%',
    borderWidth:1,
    shadowColor: 'blue',
},
butt3:{
    backgroundColor:'#e3ecff',
    borderRadius:20,
    width: 180,
    height: 65,
    marginHorizontal: 30,
    borderWidth:1,
},
butt4:{
    backgroundColor:'#dae5ff',
    borderRadius:20,
    width: 180,
    height: 65,
    borderWidth:1,
    shadowColor: 'blue',
},
butt5:{ 
    backgroundColor:'#d1dfff',
    borderRadius:20,
    width: 180,
    height: 65,
    marginHorizontal: 30,
    borderWidth:1,
},
butt6:{
    backgroundColor:'#c7d9fe',
    borderRadius:20,
    width: 180,
    height: 65,
    borderWidth:1,
    shadowColor: 'blue',
},
butt7:{
    backgroundColor:'#bed2fe',
    borderRadius:20,
    width: 180,
    height: 65,
    marginHorizontal: 30,
    borderWidth:1,
},
butt8:{
    backgroundColor:'#b5ccfe',
    borderRadius:20,
    width: 180,
    height: 65,
    borderWidth:1,
    shadowColor: 'blue',
},
butt9:{
    backgroundColor:'#abc5fe',
    borderRadius:20,
    width: 180,
    height: 65,
    marginHorizontal: 30,
    borderWidth:1,
},
butt10:{
    backgroundColor:'#A8B5E0',
    borderRadius:20,
    width: 180,
    height: 65,
    borderWidth:1,
    shadowColor: 'blue',
},
text: {
   fontSize: 25,
  width: '46%', 
  height: 50, 
  color: 'red',
  justifyContent: 'center', 
  alignItems: 'center',
  position: 'absolute',
  bottom: 0
},
loc:{
    paddingTop:25,
}


}
);
