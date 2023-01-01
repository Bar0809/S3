import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import LoginForm from './compounds/Login';


const App = () => {
  return (
    <View style={styles.mainView}>
      <ImageBackground style={styles.image} source={require('./assets/logo.png')}>
          <LoginForm/>
        </ImageBackground>
    </View>

  )
}
export default App;





const styles=StyleSheet.create({
  mainView: {
     padding: 20,
  
  },
  image: {
    width: '100%',
    height: '95%',

  }
 
}
);

