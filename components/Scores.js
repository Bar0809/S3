import { View,Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { RadioButton } from 'react-native-paper';


const names = ['תהל לוי עמדי', 'בר אסתר', 'לירון סולטן', 'משה שממה' , 'טליה לוי ', 'יוסי כהן'
, 'אליאב שרון'  ];

const Scores = () => {
  const navigation = useNavigation();
  const route = useRoute();

const [selectedOptions, setSelectedOptions] = useState({});
const handleOptionSelect = (name, option) => {
  setSelectedOptions({
    ...selectedOptions,
    [name]: option
  });
};
const [scores, setScores] = useState([]);

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
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
      <View>
      <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' תאריך'></TextInput>
      <TextInput style={[styles.input, { textAlign: 'right' }]} placeholder=' שם המטלה: '></TextInput>
      </View>

      <View style={[{flexDirection: 'row', justifyContent:'space-around'}]}>
        <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>הערה</Text>
        <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>ציון</Text>
        <Text style={[{textAlign: 'right', fontWeight:'bold', fontSize: 16}]}>שם התלמיד/ה</Text>
      </View>

      <View style={{ justifyContent: 'flex-start' }}>
      {names.map((name, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <TextInput placeholder='Comments' />

          <TextInput
            style={{ marginLeft: 10, marginRight: 10 }}
            keyboardType='numeric'
            placeholder='0-100'
            maxLength={3}
            onChangeText={(value) => handleScoreChange(index, value)}
            value={scores[index]}
          />
          <Text style={{ textAlign: 'right' }}>{name}</Text>


        </View>
      ))}
    </View>
    </View>
  )
}

export default Scores



const styles = StyleSheet.create({
  back: {
      padding:'30%'
  }
 
});

