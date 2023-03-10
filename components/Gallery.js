import { View, Text , StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';



const Gallery = () => {
  const navigation = useNavigation();


  return (
    <View style={styles.app}>
      <Text style={styles.text}>Gallery</Text>

      <TouchableOpacity style={styles.circle} onPress={() => navigation.navigate('HomePage')}>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text >הקודם</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Gallery

const styles=StyleSheet.create({
  text:{
    fontSize:20,
  },
  app: {
    flex:1,
    backgroundColor:'pink'
  }
  
  }
  );
  