import { View, Text , StyleSheet, TouchableOpacity, FlatList, SectionList} from 'react-native'
import React , { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';




const ChooseClass = (props) => {

const navigation = useNavigation();
const route = useRoute();
const myValue = route.params.param1;


  const [data, setData] = useState([
      'א-1', 'א-3', 'ב-2', 'ג-1', 'ג-4', 'ד-2', 'ה-1', 'ו-3'
  ]);

  const renderItem = ({ item }) => (
  <Text style={{ padding: 10, fontSize: 22, textAlign:'right', textDecorationLine: 'underline' }}
      onPress={() => navigation.navigate('ChooseStudent', { 
        param1: myValue, param2: item })}>{item}</Text>

  );

  return (
      <View tyle={styles.allPage}>
          <Toolbar/>

          <View style={styles.title}>
              <FontAwesome name="users" size={40} color="black" style={[{paddingLeft:-50}]}/>
              <Text style={styles.pageTitle}>הכיתות שלי:</Text>
          </View>

          <Text style={styles.subTitle}> בחר/י את הכיתה הרצויה</Text>
      
          <View>
              <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => item + index}
              />
          </View>

          <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('ReportPage')}>
              <MaterialIcons name="navigate-next" size={24} color="black" />
              <Text >הקודם</Text>
              </TouchableOpacity>

     </View>



   )
 }
              
 export default ChooseClass 

const styles=StyleSheet.create({
allPage: {
  flex:1,
  alignItems: 'center',  
},
title: {
  alignItems:'center',

},
pageTitle:{
 color:'black',
 fontSize:50,
 fontWeight:'bold',

},
back: {
  padding:'40%',
  alignItems:'center',

},
subTitle:{
    color:'red',
    fontWeight:'bold',
    fontSize:18,
    textAlign:'right'
}


  
  }
  );
  