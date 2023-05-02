import { View, Text , StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React , { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';


const ChooseStudent = ({ route }) => {
    const { className } = route.params;
    const [students, setStudents] = useState([]);
    const navigation = useNavigation();


    useEffect(() => {
        const getStudents = async () => {
          const q = query(collection(db, 'Students'), where('class_id', '==', className));
          const querySnapshot = await getDocs(q);
          const students = querySnapshot.docs.map(doc => ({ id: doc.id, type: 'student', ...doc.data() }));
          setStudents(students);
      };
      console.log(students);
        getStudents();
      
      }, []);

      const renderItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
                <TouchableOpacity onPress={() => navigation.navigate('ChooseStudent', { courseName: item.course_name })}>
                <Text style={styles.courseName}>{item.course_name}</Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <View>
            <Toolbar />
            <View style={styles.title}>
                <Text style={styles.pageTitle}>{className}</Text>
                <FontAwesome name="users" size={30} color="black" style={[{ paddingLeft: -50 }]} />
            </View>
            <Text style={styles.subTitle}>בחר/י את התלמיד/ה הרצוי/ה</Text>
            <FlatList
                data={students}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
  );
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
      