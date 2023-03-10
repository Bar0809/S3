import { View, Text , StyleSheet, TouchableOpacity, FlatList, SectionList} from 'react-native'
import React , { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons'; 


const MyClasses = (props) => {
  const navigation = useNavigation();
  const [data, setData] = useState([
      'א-1', 'א-3', 'ב-2', 'ג-1', 'ג-4', 'ד-2', 'ה-1', 'ו-3'
  ]);

  const renderItem = ({ item }) => (
  <Text style={{ padding: 10, fontSize: 22, textAlign:'right', textDecorationLine: 'underline' }}
      onPress={() => navigation.navigate('SpecificClass', { item: item })}>{item}</Text>
  );

  return (
      <View tyle={styles.allPage}>
          <Toolbar/>

          <View style={styles.title}>
              <FontAwesome name="users" size={40} color="black" style={[{paddingLeft:-50}]}/>
              <Text style={styles.pageTitle}>הכיתות שלי:</Text>
          </View>

          <View>
              <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => item + index}
              />
          </View>

          <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('HomePage')}>
              <MaterialIcons name="navigate-next" size={24} color="black" />
              <Text >הקודם</Text>
              </TouchableOpacity>

     </View>



   )
 }
              
 export default MyClasses 

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

}


  
  }
  );
  