import { Avatar } from '@rneui/themed';
import React, { useState } from 'react';
import { databases, Query, ID, Permission, account, Role } from "../lib/appwrite";
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../contexts/UserContext';
// import { Role  } from 'appwrite';
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
    
    const selectedDatabaseId = organ ? "66ad037800176f5a7a4e" : "66ad038300359c087531";

    try{
      const response = await databases.createDocument(
        "66ad03710020e0678318",
        selectedDatabaseId,
        ID.unique(),
        {"Name" : firstName+' '+lastName,
         "Zip" : parseInt(zip),
        "Gender" : isMale,
        "Email" : email,
        "Phone" : num},
      );

      navigation.navigate("MusicianTabs");
    } catch(error) {
      console.log(error);
    }finally{
      console.log(error);
    }
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

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Do you play the organ?</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={organ ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggle}
          value={organ}
          style={styles.switch}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Are you male?</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isMale ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isMale}
          style={styles.switch}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => createUserProfile()}>
        <Text style={styles.loginText}>Setup Profile</Text>
      </TouchableOpacity>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Increase switch size
  },
  loginButton: {
    width: '80%', // Match input field width
    backgroundColor: '#3B5998', // Facebook blue color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signUpText: {
    color: '#3B5998',
    fontWeight: 'bold',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#3B5998',
    marginTop: 5,
    textDecorationLine: 'underline', // Underline for a link effect
  },
});

export default MusicianLogin;
