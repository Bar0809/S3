import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const MyClasses = (props) => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);

  const getClasses = async () => {
    const q = query(collection(db, 'Classes'), where('t_id', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const classNames = [];
    querySnapshot.forEach((doc) => {
      classNames.push(doc.id);
    });
    setData(classNames);
  };

  useEffect(() => {
    getClasses().catch(console.error);
  }, []);

  const handleDeleteStudents = async (className) => {
    const q = query(collection(db, 'Students'), where('t_id', '==', auth.currentUser.uid), where('class_id', '==', className));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    handleDeleteClasses(className)
  };

  const handleDeleteClasses = async (className) => {
    const q = query(collection(db, 'Classes'), where('t_id', '==', auth.currentUser.uid), where('class_name', '==', className));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    setData(prevData => prevData.filter(item => item !== className));
  };
  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => navigation.navigate('ClassDetails', { className: item })}>
        <Text style={{ padding: 10, fontSize: 22, textAlign: 'center', textDecorationLine: 'underline', flexDirection: 'column', justifyContent: 'center' }}>
          {item}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteStudents(item)}>
        <MaterialIcons name="delete" size={24} color="black" />
      </TouchableOpacity>

      

    </View>
  );

  return (
    <View style={styles.allPage}>
      <Toolbar />
      <View style={styles.title}>
        <Text style={styles.pageTitle}> הכיתות שלי:</Text>
        <FontAwesome name="users" size={30} color="black" style={[{ paddingLeft: -50 }]} />
      </View>
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>


      <TouchableOpacity style={styles.butt}  onPress={() => navigation.navigate('SetDetails')}>
          <Text >הוסף כיתה</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.back, { marginTop: 'auto' }]} onPress={() => navigation.navigate('HomePage')}>
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text>הקודם</Text>
      </TouchableOpacity>
    </View>
  );
};


export default MyClasses;

const styles = StyleSheet.create({
  allPage: {
    flex: 1,
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
  back: {
    padding: '5%',
    alignItems: 'center',
    zIndex: 1,
    opacity: 0.7,
  },
});