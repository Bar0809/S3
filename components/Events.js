import { View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';


const Events = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Events</Text>

      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('ReportPage')}>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text >הקודם</Text>
      </TouchableOpacity>

    </View>
  )
}

export default Events

const styles = StyleSheet.create({
  back: {
      padding:'30%'
  }
 
});

