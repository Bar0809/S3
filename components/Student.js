import { View,Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import Toolbar from './Toolbar';
import Presence from './Presence';
import Scores from './Scores';
import Diet from './Diet';
import Events from './Events';



import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; 
import { RadioButton } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';



const names = ['תהל לוי עמדי', 'בר אסתר', 'לירון סולטן', 'משה שממה' , 'טליה לוי ', 'יוסי כהן'
, 'אליאב שרון'  ];

const Student = () => {
const route = useRoute();
const navigation = useNavigation();

const [selectedOptions, setSelectedOptions] = useState({});
const handleOptionSelect = (name, option) => {
  setSelectedOptions({
    ...selectedOptions,
    [name]: option
  });
};


const type = route.params.param1;
const kita= route.params.param2;
const course= route.params.param3;

const [selectedId, setSelectedId] = useState(null);

const renderItem = ({ item }) => {
  return (
    <TouchableOpacity onPress={() => setSelectedId(item.id)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RadioButton
          value={item.id}
          status={selectedId === item.id ? 'checked' : 'unchecked'}
          onPress={() => setSelectedId(item.id)}
        />
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
};


  return (
    <View>
    <Toolbar/>
      <Text style={styles.pageTitle}>{course} - {kita}</Text>

      {/* <View style={styles.report}>
        <Text style={{fontSize: 20, padding:10}}> צור/י דיווח חדש</Text>
        <Ionicons name="create-outline" size={24} color="black" />
        </View>

        <View style={[{flexDirection: 'row', justifyContent:'space-around'}]}>
          
          <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>נוכח/ת</Text>
          <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>חיסור</Text>
          <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>איחור</Text>
          <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>שם התלמיד/ה</Text>

        </View>


      <View style={styles.container}>
      {names.map(name => (
        <View key={name} style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.optionsContainer}>
            <View style={styles.option}>
              <RadioButton
                value={'Option 1'}
                status={selectedOptions[name] === 'Option 1' ? 'checked' : 'unchecked'}
                onPress={() => handleOptionSelect(name, 'Option 1')}
              />
            </View>
            <View style={styles.option}>
              <RadioButton
                value={'Option 2'}
                status={selectedOptions[name] === 'Option 2' ? 'checked' : 'unchecked'}
                onPress={() => handleOptionSelect(name, 'Option 2')}
              />
            </View>
            <View style={styles.option}>
              <RadioButton
                value={'Option 3'}
                status={selectedOptions[name] === 'Option 3' ? 'checked' : 'unchecked'}
                onPress={() => handleOptionSelect(name, 'Option 3')}
              />
            </View>
          </View>
        </View>
      ))}
    </View> */}


      {type === 'נוכחות' ? (
        <Presence/>
      ) : type === 'ציונים' ? (
          <Scores/> ) : type === 'אירועים שונים' ?
          (<Events/>) : (<Diet/>)
      }

      

      <View style={styles.report}>
        <Text style={{fontSize: 20, padding:10}}> היסטוריית נוכחות</Text>
        <FontAwesome name="history" size={24} color="black" />
     </View>


      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('HomePage')}>
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
        alignItems:'center',
      
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
    // flex: 1,
    padding: 16,
   // justifyContent:'space-around'
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    marginBottom: 16,
   justifyContent:'space-around'

  },
  name: {
    fontWeight: 'bold',
    marginRight: 8
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8
  }
    }
);
      