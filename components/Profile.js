import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import { View, StyleSheet, Text, TouchableOpacity, Animated, LayoutAnimation} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons'; 
import { RadioButton } from 'react-native-paper';
import { app, auth, storage , db} from './firebase';
import { collection, query, where, getDoc, deleteDoc, doc, updateDoc  } from 'firebase/firestore';


const Profile = () => {
  const [userData, setUserData] = useState({});
  const [checked, setChecked]= useState ('medium');
  const navigation = useNavigation();
  
  
  // useEffect(() => {
  //   const teacherRef = doc(collection(db, "Teachers"), auth.currentUser.uid);
  //   updateDoc(teacherRef, { sensitivity: checked })
  //     .then(() => {
  //       console.log("Sensitivity updated successfully");
  //     })
  //     .catch((error) => {
  //       console.log("Error updating sensitivity: ", error);
  //     });
  // }, [checked]);

  useEffect(() => {
    const teacherRef = doc(collection(db, "Teachers"), auth.currentUser.uid);
    updateDoc(teacherRef, { sensitivity: checked })
      .then(() => {
        console.log("Sensitivity updated successfully");
      })
      .catch((error) => {
        console.log("Error updating sensitivity: ", error);
      });
  }, [checked]);

  useEffect(() => {
    const teacherRef = doc(collection(db, "Teachers"), auth.currentUser.uid);
    getDoc(teacherRef).then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(data);
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
      // Display an error message to the user
    });
  }, []);
  


  const teacherRef = doc(collection(db, "Teachers"), auth.currentUser.uid);
getDoc(teacherRef).then((doc) => {
  if (doc.exists()) {
    const data = doc.data();
    setUserData(data);
  } else {
    console.log("No such document!");
  }
}).catch((error) => {
  console.log("Error getting document:", error);
  // Display an error message to the user
});

  
  return (
    <View >
      <Toolbar/>
      <View style={styles.title}>
        <Text style={styles.pageTitle} >האיזור אישי:  </Text>
      </View>

      <View style={[{padding:20}]}>
      <Text style={[{textAlign:'right', fontSize:24, fontWeight:'bold', textDecorationLine: 'underline'}]}>פרטים אישיים- </Text>
     
     
      <View style={styles.row}>
        <Entypo name="edit" size={24} color="black" />
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>שם פרטי: </Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>{userData.first_name} </Text>
      </View>

      <View style={styles.row}>
        <Entypo name="edit" size={24} color="black" />
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>שם משפחה:</Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>{userData.last_name} </Text>
      </View>

      <View style={styles.row}>
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>כתובת דוא"ל: </Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>{userData.email} </Text>

      </View>

      <View style={styles.row}>
        <Entypo name="edit" size={24} color="black" />
        <Text style={[{textAlign:'right', fontWeight:'bold', fontSize:20}]}>שם ביה"ס:</Text>
        <Text style={[{textAlign:'right', fontSize:20}]}>{userData.school_name} </Text>
      </View>
      </View>
      
      <View style={[{padding:20}]}>
      <Text style={[{textAlign:'right', fontSize:24, fontWeight:'bold', textDecorationLine: 'underline'}]}>התאמה אישית- </Text>
      <Text style={[{textAlign:'right', fontSize:18, color:'red'}]}>בחר/י את רגישות ההתראות להתנהגויות בכיתה</Text>

      <RadioButton.Group onValueChange={value => setChecked(value)} value={checked}>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item label="רגישות גבוהה" value="high" style={styles.radioButtonItem} />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item label="רגישות בינונית" value="medium" style={styles.radioButtonItem} />
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item label="רגישות נמוכה" value="low" style={styles.radioButtonItem} />
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