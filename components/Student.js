import { View, SafeAreaView,Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import Toolbar from './Toolbar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';







const Student = () => {
const route = useRoute();
const navigation = useNavigation();
const [date, setDate] = useState('09-10-2021');

const type = route.params.param1;
const kita= route.params.param2;
const name= route.params.param3;

  return (
    <View>
    <Toolbar/>
      <Text style={styles.pageTitle}>{name} - {type}</Text>

      <View style={styles.report}>
        <Text style={{fontSize: 20, padding:10}}> צור/י דיווח חדש</Text>
        <Ionicons name="create-outline" size={24} color="black" />
      </View>

      {/* <TextInput style={[styles.input, { textAlign: 'right' }]} keyboardType='date' placeholder='תאריך'
      onChangeText={text => setDate(text)} value={date}/> */}
<SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>Birth Date :</Text>
        <DatePicker
          style={styles.datePickerStyle}
          date={date}
          mode="date"
          placeholder="select date"
          format="DD/MM/YYYY"
          minDate="01-01-1900"
          maxDate="01-01-2000"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              right: -5,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              borderColor : "gray",
              alignItems: "flex-start",
              borderWidth: 0,
              borderBottomWidth: 1,
            },
            placeholderText: {
              fontSize: 17,
              color: "gray"
            },
            dateText: {
              fontSize: 17,
            }
          }}
          onDateChange={(date) => {
            setDate(date);
          }}
        />
      </View>
    </SafeAreaView>


      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('ReportPage')}>
                <MaterialIcons name="navigate-next" size={24} color="black" />
                <Text >חזור</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Student


const styles=StyleSheet.create({
      pageTitle:{
        color:'black',
        fontSize:40,
        fontWeight:'bold',
        textAlign:'center'
       
       },
    
      back: {
        padding:'20%',
        alignItems:'center',
      
      },
      subTitle:{
        color:'red',
        fontWeight:'bold',
        fontSize:18,
        textAlign:'right'
    },
    report: {
      flexDirection: 'row',
      alignItems:'center',
      textAlign:'right',
      justifyContent: 'flex-end',
    },
    input: {
      backgroundColor: 'white',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      borderStyle: 'dashed',
      textAlign: 'rigth' ,
      margin:'auto', 
      padding:16,
      marginTop:16,
      width:300,
      height: 50
   },
   container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : '#A8E9CA'
  },
  title: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  datePickerStyle: {
    width: 230,
  },
  text: {
    textAlign: 'left',
    width: 230,
    fontSize: 16,
    color : "#000"
  }
    
      
    }
);
      