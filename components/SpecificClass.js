import { View, Text , StyleSheet, TouchableOpacity, FlatList, SectionList, ScrollView} from 'react-native'
import React , { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons';  
import { useRoute } from '@react-navigation/native';



const SpecificClass = () => {
const navigation = useNavigation();
const route = useRoute();
const myValue = route.params.item;

const names = ['אברהם כהן', 'אדם מלכי', 'יוסי לוי', 'אפיק סולומון', 'אריאל אללי', 'ברק כהן', 'כריס פלי'
,'שירן רבי' ,'אוריאל אסייג', 'אורי ליבסטר','אריאל דדון' , 'יאנה מוררי','גל דוד','יונתן קלמנוביץ',
'כרמית כהן' ,'לירון סולימני', 'מיכאל חגי','נויה שרון' ,'עדן טל','רואי רפאלי','תהילה אילוז'
,'אוראל בן חיון' ,'בר מור ','טליה לוי','תהל עמדי','נויה עמוס','עדי יצחק','ענבל ביבי','אושר כהן','עמית שמואלי',
'רון אסף','ליה דולב','זוהר להט'];

const sortedNames = names.sort((a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
            return a.charCodeAt(i) - b.charCodeAt(i);
        }
    }
});

const sections = sortedNames.reduce((acc, name) => {
    const letter = name[0];
    if (!acc[letter]) {
        acc[letter] = { title: letter, data: [] };
    }
    acc[letter].data.push(name);
    return acc;
}, {});

const renderItem = ({ item }) => (
    <Text style={{ padding: 10, fontSize: 18 , textAlign: 'right'}}>{item}</Text>
);

const renderSectionHeader = ({ section }) => (
    <Text style={{ padding: 10, fontWeight: 'bold', fontSize: 22, textAlign: 'right', textDecorationLine: 'underline' }}>
        {section.title}
    </Text>
);

const sectionsArr = Object.values(sections);


  return (
    <ScrollView>
        <View style={styles.allPage}>
            <Toolbar/>
            <View style={styles.title}>
                <FontAwesome name="users" size={40} color="black" style={[{paddingLeft:-50}]}/>
                <Text style={styles.pageTitle}>{myValue}</Text>
            </View>

            <View>
                <SectionList sections={sectionsArr} renderItem={renderItem} renderSectionHeader={renderSectionHeader}
                keyExtractor={(item, index) => item.id || index.toString()}/>
            </View>

            <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('MyClasses')}>
                <MaterialIcons name="navigate-next" size={24} color="black" />
                <Text >הקודם</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>

  )
}

export default SpecificClass


const styles=StyleSheet.create({
    allPage: {
        flex:1,
      },
      pageTitle:{
        color:'black',
        fontSize:50,
        fontWeight:'bold',
       
       },
       title: {
        alignItems:'center',
      
      },
      back: {
        padding:'20%',
        alignItems:'center',
      
      }
    
      
    }
);
      