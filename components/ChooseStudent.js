import { View, Text , StyleSheet, TouchableOpacity, FlatList, SectionList, ScrollView} from 'react-native'
import React , { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons';  
import { useRoute } from '@react-navigation/native';



const ChooseStudent = () => {
const navigation = useNavigation();
const route = useRoute();

const type = route.params.param1;
const course= route.params.param2;


const names = ['תהל לוי עמדי', 'בר אסתר', 'לירון סולטן', 'משה שממה' , 'טליה לוי ', 'יוסי כהן'
, 'אליאב שרון' , 'נויה עמוס' , 'רחמים ליה', 'דניאל אור' , 'שטראוס זוהר' , 'נעם כהן'];

const courses= ['תורה', 'עברית', 'חשבון' , 'חינוך'];




const sortedCourses = courses.sort((a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (a.charCodeAt(i) !== b.charCodeAt(i)) {
            return a.charCodeAt(i) - b.charCodeAt(i);
        }
    }
});

const sections = sortedCourses.reduce((acc, name) => {
    const letter = courses[0];
    if (!acc[letter]) {
        acc[letter] = { title: letter, data: [] };
    }
    acc[letter].data.push(name);
    return acc;
}, {});

const renderItem = ({ item }) => (
    <Text style={{ padding: 10, fontSize: 18 , textAlign: 'right'}}
    onPress={() => navigation.navigate('Student', { 
        param1: type, param2: course , param3: item})}>{item}</Text>
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
                <Text style={styles.pageTitle}>{course}</Text>
            </View>

            <Text style={styles.subTitle}> בחר/י את המקצוע הרצוי</Text>


            <View>
                <SectionList sections={sectionsArr} renderItem={renderItem} 
                keyExtractor={(item, index) => item.id || index.toString()}/>
            </View>

            <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('ReportPage')}>
                <MaterialIcons name="navigate-next" size={24} color="black" />
                <Text >חזור</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>

  )
}

export default ChooseStudent


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
      
      },
      subTitle:{
        color:'red',
        fontWeight:'bold',
        fontSize:18,
        textAlign:'right'
    }
    
    
      
    }
);
      