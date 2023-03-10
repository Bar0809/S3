import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, LayoutAnimation} from 'react-native';
import Toolbar from './Toolbar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Foundation } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 




const HomePage = () => {
    const navigation = useNavigation();
    const [buttonStates, setButtonStates] = useState({});
    const [textColor1, setTextColor1] = useState("black");
    const [textColor2, setTextColor2] = useState("black");
    const [textColor3, setTextColor3] = useState("black");
    const [textColor4, setTextColor4] = useState("black");
    const [textColor5, setTextColor5] = useState("black");



    const handlePress = (id) => {
        LayoutAnimation.configureNext({
          duration: 500,
          update: {
            type: LayoutAnimation.Types.spring,
            springDamping: 0.7,
          },
        });
        setButtonStates({...buttonStates, [id]: {size: 1.2}});
        if(id === 1){
            setTimeout(()=> {
                setTextColor1("black");
                navigation.navigate('MyClasses');
                setButtonStates({...buttonStates, [id]: {size: 1}});

            }, 500);
        }
        else if(id===2){
            setTextColor2("black");
            navigation.navigate('ReportPage');
            setButtonStates({...buttonStates, [id]: {size: 1}});

        }
        else if(id===3){
            setTextColor3("black");
            navigation.navigate('GraphsNData');
            setButtonStates({...buttonStates, [id]: {size: 1}});

        }
        else if (id==4){
            setTextColor4("black");
            navigation.navigate('Gallery');
            setButtonStates({...buttonStates, [id]: {size: 1}});

        }
        else {
            setTextColor5("black");
            navigation.navigate('Profile');
            setButtonStates({...buttonStates, [id]: {size: 1}});
        }
      }

  
  return (
        <View style={[{ justifyContent: 'center', alignItems: 'center'}]}>
        <Toolbar/>
        <View style={styles.butt}>
            <Animated.View style={{transform: [{ scale: buttonStates[1]?.size || 1 }],}}>
                <TouchableOpacity style={styles.circle} onPress={()=> handlePress(1)}>
                    <FontAwesome name="users" size={24} color="black" />
                    <Text style={[styles.text, {color: textColor1}]}>הכיתות שלי</Text> 
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[{paddingTop:20},{transform: [{ scale: buttonStates[2]?.size || 1 }],}]}>
                <TouchableOpacity style={styles.circle} onPress={()=> handlePress(2)}>
                    <MaterialIcons name="update" size={26} color="black" />
                    <Text style={[styles.text, {color: textColor2}]}>דיווח</Text> 
                </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={[{paddingTop:20},{transform: [{ scale: buttonStates[3]?.size || 1 }],}]}>
                <TouchableOpacity style={styles.circle} onPress={()=> handlePress(3)}>
                    <Foundation name="graph-bar" size={24} color="black"  />
                    <Text style={[styles.text, {color: textColor3}]}>נתוני הכיתות</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[{paddingTop:20},{transform: [{ scale: buttonStates[4]?.size || 1 }],}]}>
                <TouchableOpacity style={styles.circle} onPress={()=> handlePress(4)}>
                    <MaterialCommunityIcons name="view-gallery-outline" size={24} color="black" />
                    <Text style={[styles.text, {color: textColor4}]}>גלריה</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[{paddingTop:20},{transform: [{ scale: buttonStates[5]?.size || 1 }],}]}>
                <TouchableOpacity style={styles.circle} onPress={()=> handlePress(5)}>
                    <MaterialIcons name="history-edu" size={24} color="black" />
                    <Text style={[styles.text, {color: textColor4}]}>איזור אישי</Text>
                </TouchableOpacity>
            </Animated.View>

           
        </View>

    
    </View>
  );
};

export default HomePage;

const styles=StyleSheet.create({
row: {
    flexDirection:'row',
    textAlign:'center',
    justifyContent:'space-around',
    paddingTop:20,
},
text:{
    fontSize:24,
    textAlign:'center',
    justifyContent:'center',
    fontWeight:'bold'
},
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    // height: 100, 
    height:90,
    width: 150, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'white',
    borderWidth:1,
    borderColor: '#1E90FF',
    top:20,
    
  },
  butt: {
    justifyContent:'center',
    // paddingTop:40,

  }


}
);
