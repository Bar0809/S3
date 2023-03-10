import React from 'react';
import { View, Text, TextInput, StyleSheet,Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase'
import {signOut} from 'firebase/auth'


const Toolbar = (props) => {
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
    <View>
      <View style={styles.toolbar}>
          <Image source={require('../assets/toolbarlogo.png')} style={styles.toolbarLogo}/>
          <TextInput style={[styles.toolbarSearch, {top:20}]} placeholder="חיפוש" />
          {/* <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('Toolbar')}>
              <Image source={require('../assets/menuIcon.png')}></Image>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.text} onPress={handleLogout} >
            <Text style={[styles.text, {top:28, fontSize:18, textDecorationLine: 'underline'}]}>התנתק</Text>          
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    paddingTop: 40,
    flexDirection: 'row',
    // alignContent:'center',
    justifyContent:'space-around',
//     position: 'absolute',
// backgroundColor: 'white'
  },
  toolbarSearch: {
    backgroundColor: '#DDF1FF',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginRight: 10,
    paddingLeft: 15,
    width:'60%',
    height: 30,
    textAlign:'center', 
  },
  menuIcon: {
    paddingLeft:15
  }

});

export default Toolbar;
