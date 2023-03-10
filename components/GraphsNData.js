import { View, Text , StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const GraphsNData = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>GraphsNData</Text>

      <TouchableOpacity style={styles.circle} onPress={() => navigation.navigate('HomePage')}>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text >הקודם</Text>
      </TouchableOpacity>
    </View>
  )
}

export default GraphsNData