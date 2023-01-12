import React from 'react';
import { View, Text, TextInput, StyleSheet,Image, TouchableOpacity} from 'react-native';
import FullLogin from './FullLogin';


const Toolbar = (props) => {
  return (
    <View style={styles.all}>
      <View style={styles.toolbar}>
          <Image source={require('../assets/toolbarlogo.png')} style={styles.toolbarLogo}/>
          <Text style={styles.toolbarTitle}>{props.title}</Text>
          <TextInput style={styles.toolbarSearch} placeholder="חיפוש" />
          <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.navigate('Toolbar')}>
              <Image source={require('../assets/menuIcon.png')}></Image>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  all: {
    // borderWidth:1,
    borderTopColor:'white'
  },
  toolbar: {
    paddingTop: 40,
    flexDirection: 'row',
  },
  toolbarTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
  },
  toolbarSearch: {
    backgroundColor: '#FFF0F5',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginRight: 10,
    paddingLeft: 15,
    width:'60%',
    textAlign:'center', 
  },
  menuIcon: {
    paddingLeft:15
  }

});

export default Toolbar;
