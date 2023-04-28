import React, { useState } from 'react';
import Toolbar from './Toolbar';
import { View, StyleSheet, Text, TouchableOpacity, Animated, LayoutAnimation} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons'; 
import { RadioButton } from 'react-native-paper';



const Profile = () => {


  const navigation = useNavigation();
  const [checked, setChecked] = useState('option2');

  return (
    <View >
      <Toolbar/>
      <View style={styles.title}>
        <Text style={styles.pageTitle} >האיזור אישי:  </Text>
        {/* <MaterialIcons name="history-edu" size={50} color="black" /> */}
      </View>

      <View style={[{padding:20}]}>
      <Text style={[{textAlign:'right', fontSize:24, fontWeight:'bold', textDecorationLine: 'underline'}]}>פרטים אישיים- </Text>
     
     
      <View style={styles.row}>
        <Entypo name="edit" size={24} color="black" />
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>שם פרטי: </Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>בר </Text>
      </View>

      <View style={styles.row}>
        <Entypo name="edit" size={24} color="black" />
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>שם משפחה:</Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>דוד </Text>
      </View>

      <View style={styles.row}>
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>כתובת דוא"ל: </Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>testing@gmail.com </Text>

      </View>

      <View style={styles.row}>
        <Entypo name="edit" size={24} color="black" />
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>שם ביה"ס:</Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>ממ"ד צמח השדה </Text>
      </View>
      </View>
      
      <View style={[{padding:20}]}>
      <Text style={[{textAlign:'right', fontSize:24, fontWeight:'bold', textDecorationLine: 'underline'}]}>התאמה אישית- </Text>
      <Text style={[{textAlign:'right', fontSize:18, color:'red'}]}>בחר/י את רגישות ההתראות להתנהגויות בכיתה</Text>

      <RadioButton.Group onValueChange={value => setChecked(value)} value={checked}>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item label="רגישות גבוהה" value="option1" style={styles.radioButtonItem} />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item label="רגישות בינונית" value="option2" style={styles.radioButtonItem} />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item label="רגישות נמוכה" value="option3" style={styles.radioButtonItem} />
        </View>
      </RadioButton.Group>
      </View>


      <View style={[{flex:1, alignItems:'center'}]}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('HomePage')}>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text style={[{textAlign:'left'}]}>הקודם</Text>
      </TouchableOpacity>
    </View>
     
    </View>
  )
}

export default Profile

const styles=StyleSheet.create({
  title: {
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
   
},
pageTitle:{
  color:'black',
  fontSize:40,
  fontWeight:'bold',
  padding:10,
  
},
  row:{
     textAlign:'right',
    flexDirection: 'row-reverse',
    alignItems:'flex-end'
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  radioButtonItem: {
    textAlign: 'right',
  },

 
  

});