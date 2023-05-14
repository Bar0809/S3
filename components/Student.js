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




const Student = () => {
const navigation = useNavigation();


  return (
    <View>
    <Toolbar/>
      

      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('HomePage')}>
                <MaterialIcons name="navigate-next" size={24} color="black" />
                <Text >חזור</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Student


const styles=StyleSheet.create({
      
    }
);
      