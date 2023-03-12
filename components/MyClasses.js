import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toolbar from './Toolbar';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const MyClasses = (props) => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedColumnData, setSelectedColumnData] = useState([]);

  const getColumnNames = async () => {
    const collectionRef = collection(db, `users/${auth.currentUser.uid}/classes`);
    const querySnapshot = await getDocs(collectionRef);
    const columnNames = querySnapshot.docs.map(doc => doc.id);
    return columnNames;
  };

  const getColumnData = async (columnName) => {
    const docRef = doc(db, `users/${auth.currentUser.uid}/classes/${columnName}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSelectedColumnData(docSnap.data());
      setSelectedColumn(columnName);
      console.log(selectedColumnData[columnName])
    }
  };

  useEffect(() => {
    getColumnNames().then(setData).catch(console.error);
  }, []);


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => getColumnData(item)}>
      <Text
        style={{ padding: 10, fontSize: 22, textAlign: 'right', textDecorationLine: 'underline' }}
      >
        {item}
      </Text>
      {selectedColumn === item && selectedColumnData && selectedColumnData[item] &&
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}></Text>
          <Text>{Object.values(selectedColumnData[item]).join('\n')}</Text>
        </View>
      }
    </TouchableOpacity>
  );

  return (
    <View style={styles.allPage}>
      <Toolbar />

      <View style={styles.title}>
        <FontAwesome name="users" size={40} color="black" style={[{ paddingLeft: -50 }]} />
        <Text style={styles.pageTitle}>הכיתות שלי:</Text>
      </View>
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    
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
  },
  pageTitle: {
    color: 'black',
    fontSize: 50,
    fontWeight: 'bold',
  },
  back: {
    padding: '5%',
    alignItems: 'center',
    zIndex: 1,
    opacity: 0.7,
  },
});