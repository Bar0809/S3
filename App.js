import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FullLogin from './components/FullLogin';
import HomePage from './components/HomePage';
import Fpassword from './components/Fpassword';
import SignUp from './components/SignUp';
import ReportPage from './components/ReportPage';
import SetDetails from './components/SetDetails';
import MyClasses from './components/MyClasses';
import GraphsNData from './components/GraphsNData';
import Gallery from './components/Gallery';
import SpecificClass from './components/SpecificClass';
import Presence from './components/Presence';
import Scores from './components/Scores';
import MentalState from './components/MentalState';
import FriendStatus from './components/FriendStatus';
import Events from './components/Events';
import Violence from './components/Violence';
import Diet from './components/Diet';
import Visibility from './components/Visibility';
import Temp1 from './components/Temp1';
import Temp2 from './components/Temp2';
import ChooseClass from './components/ChooseClass';
import ChooseStudent from './components/ChooseStudent';
import Student from './components/Student'
import Profile from './components/Profile'


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="FullLogin" component={FullLogin}/>
        <Stack.Screen name="HomePage" component={HomePage}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="Fpassword" component={Fpassword}/>
        <Stack.Screen name="SetDetails" component={SetDetails}/>
        <Stack.Screen name="ReportPage" component={ReportPage}/>
        <Stack.Screen name="MyClasses" component={MyClasses}/>
        <Stack.Screen name="GraphsNData" component={GraphsNData}/>
        <Stack.Screen name="Gallery" component={Gallery}/>
        <Stack.Screen name="SpecificClass" component={SpecificClass}/>
        <Stack.Screen name="Presence" component={Presence}/>
        <Stack.Screen name="Scores" component={Scores}/>
        <Stack.Screen name="MentalState" component={MentalState}/>
        <Stack.Screen name="FriendStatus" component={FriendStatus}/>
        <Stack.Screen name="Events" component={Events}/>
        <Stack.Screen name="Violence" component={Violence}/>
        <Stack.Screen name="Diet" component={Diet}/>
        <Stack.Screen name="Visibility" component={Visibility}/>
        <Stack.Screen name="Temp1" component={Temp1}/>
        <Stack.Screen name="Temp2" component={Temp2}/>
        <Stack.Screen name="ChooseClass" component={ChooseClass}/>
        <Stack.Screen name="ChooseStudent" component={ChooseStudent}/>
        <Stack.Screen name="Student" component={Student}/>
        <Stack.Screen name="Profile" component={Profile}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;