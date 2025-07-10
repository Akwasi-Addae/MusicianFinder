import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper'; // ✅ PaperProvider import
import { UserProvider } from './contexts/UserContext';

// Screens
import Chat from "./Screens/Chat";
import Home from './Screens/Home';
import Login from './Screens/Login';
import Church from './Screens/Church';
import Signup from './Screens/Signup';
import Settings from "./Screens/Settings";
import CreateGig from "./Screens/CreateGig";
import SignupTwo from './Screens/SignupTwo';
import EditProfile from './Screens/EditProfile';
import UpdateGig from "./Screens/UpdateGig";
import HomeScreen from "./Screens/HomeScreen";
import ChurchInfo from "./Screens/ChurchInfo";
import AcceptedGigs from './Screens/AcceptedGigs';
import MusicianLogin from './Screens/MusicianLogin';
import ChurchSettings from './Screens/ChurchSettings';
import ChurchHomeScreen from "./Screens/ChurchHomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MusicianTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="All Gigs" component={AcceptedGigs} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function ChurchTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ChurchHomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="CreateGig" component={CreateGig} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={ChurchSettings} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="SignupTwo" component={SignupTwo} options={{ headerShown: false }} />
            <Stack.Screen name="Church" component={Church} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="MusicianLogin" component={MusicianLogin} options={{ headerShown: false }} />
            <Stack.Screen name="MusicianTabs" component={MusicianTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ChurchInfo" component={ChurchInfo} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="ChurchTabs" component={ChurchTabs} options={{ headerShown: false }} />
            <Stack.Screen name="UpdateGig" component={UpdateGig} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
