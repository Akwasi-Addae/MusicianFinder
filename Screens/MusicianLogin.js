import { Avatar } from '@rneui/themed';
import React, { useState } from 'react';
import { databases } from "../lib/appwrite";
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../contexts/UserContext';
import { Role, Account, Permission, ID } from 'react-native-appwrite';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';


const MusicianLogin = ({route, navigation}) => {
  const { firstName, lastName, num, email } = route.params;
  const [zip, setZip] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [isMale, setMale] = useState(false);
  const [organ, setOrgan] = useState(false); 
  const toggle = () => setOrgan((previousState) => !previousState);
  const toggleSwitch = () => setMale((previousState) => !previousState);

  const createUserProfile = async() => {
    console.log(organ);    
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.logo}>
        <Avatar
          size={120}
          rounded
          source={require('../assets/splash.png')}
          containerStyle={styles.avatar}
        />
      </View>

      <Text style={styles.title}>Musician Profile Setup</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={zip}
          onChangeText={setZip}
          autoCapitalize="none"
          keyboardType="numeric"
          style={styles.input}
          placeholder="Enter Zip Code"
          placeholderTextColor="#888" // Placeholder text color for better UX
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FAF0E6', // Background color for the entire screen
  },
  logo: {
    marginBottom: 30,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', // Center the text
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%', // Full width of the container for better alignment
    marginBottom: 20,
  },
  input: {
    width: '100%', // Full width to make it responsive
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
  },
});

export default MusicianLogin;
