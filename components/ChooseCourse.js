import { View, Text , StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React , { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons'; 
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const ChooseCourse = ({ route }) => {
    const { className } = route.params;
    const {reported} = route.params;
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const navigation = useNavigation();

    function handleButtonClick(item) {
      console.log("hey")
      if (reported === 'Scores') {
        navigation.navigate('Scores', { className: className,reported: reported, courseName: item.course_name });
      } 
      else if (reported === 'Presence') {
        navigation.navigate('Presence', { className: className,reported: reported, courseName: item.course_name });
      }
      else if (reported === 'FriendStatus') {
        navigation.navigate('FriendStatus', { className: className,reported: reported,courseName: item.course_name });
      }
      else if (reported === 'Mood') {
        navigation.navigate('Mood', { className: className,reported: reported, courseName: item.course_name});
      }
      else if (reported === 'Appearances') {
        navigation.navigate('Appearances', { className: className,reported: reported, courseName: item.course_name });
      }
      else if (reported === 'Diet') {
        navigation.navigate('Diet', { className: className,reported: reported, courseName: iitem.course_nameem });
      }
      else {
        navigation.navigate('Events', { className: className,reported: reported, courseName: item.course_name });
      }
    }

    useEffect(() => {
        const getCourses = async () => {
            const q = query(collection(db, 'Courses'), where('class_id', '==', className));
            const querySnapshot = await getDocs(q);
            const courses = querySnapshot.docs.map(doc => ({id: doc.id, type: 'courses', ...doc.data()}));
            setCourses(courses);
        };
        getCourses();      
    }, [className]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
            {/* <TouchableOpacity disabled={!selectedCourse} onPress={() => handleButtonClick(item)}> */}

            <TouchableOpacity  onPress={() => handleButtonClick(item)}>
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
            <Text style={styles.subTitle}>בחר/י את המקצוע הרצוי</Text>
            <FlatList
                data={courses}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
  );
}

export default ChooseCourse;

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 70,
        borderRadius: 10,
        marginTop: 10,
        padding: 10
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    removeButton: {
        color: 'red'
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
, allPage: {
    flex:1,
    alignItems: 'center',  
  },
  title: {
    alignItems:'center',
  
  },
  pageTitle:{
   color:'black',
   fontSize:50,
   fontWeight:'bold',
  
  },
  back: {
    padding:'40%',
    alignItems:'center',
  
  },
  subTitle:{
      color:'red',
      fontWeight:'bold',
      fontSize:18,
      textAlign:'right'
  }
  
});