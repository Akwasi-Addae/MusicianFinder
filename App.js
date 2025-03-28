import Info from './Screens/Info';
import Chat from "./Screens/Chat";
import Home from './Screens/Home';
import Login from './Screens/Login';
import Church from './Screens/Church';
import ChurchInfo from "./Screens/ChurchInfo";
import Signup from './Screens/Signup';
import React, { useState } from 'react';
import { StyleSheet} from 'react-native';
import Settings from "./Screens/Settings";
import SignupTwo from './Screens/SignupTwo';
import HomeScreen from "./Screens/HomeScreen";
import MusicianLogin from './Screens/MusicianLogin';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MusicianTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
      <Tab.Screen name="Chat" component={Chat} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default function App() { 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
        <Stack.Screen name="SignupTwo" component={SignupTwo} options={{headerShown: false}}/>
        <Stack.Screen name="Church" component={Church} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        <Stack.Screen name="MusicianLogin" component={MusicianLogin} options={{headerShown: false}}/>
        {/* Use MusicianTabs instead of MusicianScreen */}
        <Stack.Screen name="MusicianTabs" component={MusicianTabs} options={{headerShown: false}}/>
        <Stack.Screen name="ChurchInfo" component={ChurchInfo} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
});
