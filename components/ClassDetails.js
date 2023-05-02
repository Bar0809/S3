import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';


const ClassDetails = ({ navigation, route }) => {
    const { className } = route.params;
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [newCourseName, setNewCourseName] = useState('');


    useEffect(() => {
      const getCourses = async () => {
        const q = query(collection(db, 'Courses'), where('class_id', '==', className));
        const querySnapshot = await getDocs(q);
        const courses = querySnapshot.docs.map(doc => ({id: doc.id, type: 'courses', ...doc.data()}));
        setCourses(courses);
      };
      const getStudents = async () => {
        const q = query(collection(db, 'Students'), where('class_id', '==', className));
        const querySnapshot = await getDocs(q);
        const students = querySnapshot.docs.map(doc => ({ id: doc.id, type: 'student', ...doc.data() }));
        setStudents(students);
    };
      getCourses();
      getStudents();
    
    }, []);
  
    const handleDeleteStudent = async (student) => {
        const q = query(collection(db, 'Students'), where('name', '==', student.name)
          .where('class_id', '==', className)
          .where('t_id', '==', auth.currentUser.uid));
      
        const querySnapshot = await getDocs(q);
        const studentDocs = querySnapshot.docs.map(doc => doc.ref);
        await Promise.all(studentDocs.map(deleteDoc));
      };

      const handleRemoveCourse = async (id) => {
        try {
          await deleteDoc(doc(db, 'Courses', id));
          setCourses(courses.filter(course => course.id !== id));
        } catch (error) {
          console.error('Error removing document: ', error);
        }
      };
  
      const handleAddCourse = async () => {
        if (newCourseName.trim() === '') {
            return;
        }
        const course = { course_name: newCourseName.trim(), class_id: className };
        try {
            const docRef = await addDoc(collection(db, 'Courses'), course);
            setCourses([...courses, { id: docRef.id, type: 'courses', ...course }]);
            setNewCourseName('');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const renderItem = ({ item, index }) => {
        if (item.type === 'courses') {
          return (
            <View style={styles.listItem}>
              <Text style={styles.courseName}>{item.course_name}</Text>
              <TouchableOpacity onPress={() => handleRemoveCourse(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          return (
            <View style={styles.listItem}>
              <Text style={styles.studentName}>{item.student_name}</Text>
              {item.type === 'student' && (
                <TouchableOpacity onPress={() => handleDeleteStudent(item)}>
                  <Text style={styles.removeButton}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }
      };
      


  return (
    <View >
        <Toolbar/>
        
        <View style={styles.title}>
            <Text style={styles.pageTitle}> {className} </Text>
            <FontAwesome name="users" size={30} color="black" style={[{ paddingLeft: -50 }]} />
        </View>

        <View>
            <Text>מקצועות הלימוד:</Text>
            <View style={styles.container}>
            <FlatList
  data={courses}
  renderItem={renderItem}
  keyExtractor={item => item.id}
/>
    </View>

    <View>
        <Text>רשימת תלמידים:</Text>
        <FlatList
  data={students}
  renderItem={renderItem}
  keyExtractor={item => item.id}
/>
    </View>

        </View>



    </View>
  )
}

export default ClassDetails

const styles = StyleSheet.create({
    allPage: {
        // flex: 1,
         alignItems: 'center',
       },
       title: {
         alignItems: 'center',
         flexDirection: 'row',
       },
       pageTitle: {
         color: 'black',
         fontSize: 30,
         fontWeight: 'bold',
       },
       

})