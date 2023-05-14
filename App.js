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
import DataHistory from './components/DataHistory';
import Gallery from './components/Gallery';
import SpecificClass from './components/SpecificClass';
import Presence from './components/Presence';
import Scores from './components/Scores';
import Mood from './components/Mood';
import FriendStatus from './components/FriendStatus';
import Events from './components/Events';
import Violence from './components/Violence';
import Diet from './components/Diet';
import Appearances from './components/Appearances';
import MyChoice1 from './components/MyChoice1';
import MyChoice2 from './components/MyChoice2';
import ChooseClass from './components/ChooseClass';
import ChooseStudent from './components/ChooseStudent';
import Student from './components/Student';
import Profile from './components/Profile';
import ClassDetails from './components/ClassDetails';
import ChooseCourse from './components/ChooseCourse';
import SpicelEvent from './components/SpicelEvent';
import ClassData from './components/ClassData';
import StudentData from './components/StudentData';
import SelectCategory from './components/SelectCategory';
import PresenceData from './components/PresenceData';
import ScoresData from './components/ScoresData';
import MoodsData from './components/MoodsData';
import DietNAppearData from './components/DietNAppearData';
import EventsData from './components/EventsData';
import MyChoicesData from './components/MyChoicesData';

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
        <Stack.Screen name="DataHistory" component={DataHistory}/>
        <Stack.Screen name="Gallery" component={Gallery}/>
        <Stack.Screen name="SpecificClass" component={SpecificClass}/>
        <Stack.Screen name="Presence" component={Presence}/>
        <Stack.Screen name="Scores" component={Scores}/>
        <Stack.Screen name="Mood" component={Mood}/>
        <Stack.Screen name="FriendStatus" component={FriendStatus}/>
        <Stack.Screen name="Events" component={Events}/>
        <Stack.Screen name="Violence" component={Violence}/>
        <Stack.Screen name="Diet" component={Diet}/>
        <Stack.Screen name="Appearances" component={Appearances}/>
        <Stack.Screen name="MyChoice1" component={MyChoice1}/>
        <Stack.Screen name="MyChoice2" component={MyChoice2}/>
        <Stack.Screen name="ChooseClass" component={ChooseClass}/>
        <Stack.Screen name="ChooseStudent" component={ChooseStudent}/>
        <Stack.Screen name="Student" component={Student}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="ClassDetails" component={ClassDetails}/>
        <Stack.Screen name="ChooseCourse" component={ChooseCourse}/>
        <Stack.Screen name='SpicelEvent' component={SpicelEvent}/>
        <Stack.Screen name='ClassData' component={ClassData}/>
        <Stack.Screen name='StudentData' component={StudentData}/>
        <Stack.Screen name='SelectCategory' component={SelectCategory}/>
        <Stack.Screen name='PresenceData' component={PresenceData}/>
        <Stack.Screen name='ScoresData' component={ScoresData}/>
        <Stack.Screen name='MoodsData' component={MoodsData}/>
        <Stack.Screen name='DietNAppearData' component={DietNAppearData}/>
        <Stack.Screen name='EventsData' component={EventsData}/>
        <Stack.Screen name='MyChoicesData' component={MyChoicesData}/>
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;