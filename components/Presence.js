import { View,Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { RadioButton } from 'react-native-paper';


const names = ['תהל לוי עמדי', 'בר אסתר', 'לירון סולטן', 'משה שממה' , 'טליה לוי ', 'יוסי כהן'
, 'אליאב שרון'  ];

const Presence = () => {
  const navigation = useNavigation();
  const route = useRoute();

const [selectedOptions, setSelectedOptions] = useState({});
const handleOptionSelect = (name, option) => {
  setSelectedOptions({
    ...selectedOptions,
    [name]: option
  });
};

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
      <View style={styles.report}>
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
              {/* <Text>Option 1</Text> */}
            </View>
            <View style={styles.option}>
              <RadioButton
                value={'Option 2'}
                status={selectedOptions[name] === 'Option 2' ? 'checked' : 'unchecked'}
                onPress={() => handleOptionSelect(name, 'Option 2')}
              />
              {/* <Text>Option 2</Text> */}
            </View>
            <View style={styles.option}>
              <RadioButton
                value={'Option 3'}
                status={selectedOptions[name] === 'Option 3' ? 'checked' : 'unchecked'}
                onPress={() => handleOptionSelect(name, 'Option 3')}
              />
              {/* <Text>Option 3</Text> */}
            </View>
          </View>
        </View>
      ))}
    </View>

  


    </View>
  )
}

export default Presence


const styles = StyleSheet.create({
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
  padding: 16,
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
 
});

