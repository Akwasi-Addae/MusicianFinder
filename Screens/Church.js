import { Avatar } from '@rneui/themed';
import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { databases, ID, Permission, Role } from '../lib/appwrite'; // Import Permission and Role from appwrite.js
import { UserContext } from '../contexts/UserContext';

const Church = ({ route, navigation }) => {
  const { setUser } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const email = user?.email;
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Register function to create the church profile
  const register = async () => {
    setLoading(true);

    try {
      const response = await databases.createDocument(
        '66ad03710020e0678318', // databaseId
        '66ad037e0022cc74d1f3', // collectionId
        ID.unique(), // Using ID.unique() from appwrite.js
        {
          Name: name,
          City: city,
          State: state,
          Email: email,
          StreetAddress: address,
          Zip: parseInt(zip),
          userId: user.id
        },
        [
          // Set document-level permissions
          Permission.read(Role.user(user.id)),   // Allow user to read
          Permission.update(Role.user(user.id)), // Allow user to update
          Permission.delete(Role.user(user.id)), // Allow user to delete
          
          // // // If you want admins or other roles to have access, you can add more permissions:
          // Permission.read(Role.users()),  // Allow any authenticated user to read the document
          // Permission.update(Role.users()) // Allow any authenticated user to update the document
        ]
      );

      console.log('Church profile created:', response);
      setUser(prev => ({
        ...prev,
        church: {
          id: response.$id,
          name: response.Name,
          city: response.City,
          state: response.State,
          zip: response.Zip,
          address: response.StreetAddress,
          email: response.Email,
        }
      }));
      navigation.navigate('ChurchTabs'); // Navigate to the next screen
    } catch (error) {
      // console.error('Error creating church profile:', error);
      console.error('Error creating organiser profile:', error);
      Alert.alert('Error', 'Could not create organiser profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />

      {/* Logo */}
      <View style={styles.logo}>
        <Avatar size={120} rounded source={require('../assets/splash.png')} />
      </View>

      {/* Church name */}
      <View style={styles.inputContainer}>
        <TextInput value={name} onChangeText={setName} autoCapitalize="none" style={styles.input} placeholder="Church Name" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput value={address} onChangeText={setAddress} autoCapitalize="none" style={styles.input} placeholder="Address" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput value={city} onChangeText={setCity} autoCapitalize="none" style={styles.input} placeholder="City" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput value={state} onChangeText={setState} autoCapitalize="none" style={styles.input} placeholder="State- NY" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput value={zip} onChangeText={setZip} autoCapitalize="none" style={styles.input} placeholder="Zip" keyboardType="number-pad"/>
      </View>

      <TouchableOpacity onPress={register} disabled={loading}>
        <View style={styles.loginButton}>
          <Text style={styles.loginText}>{loading ? 'Creating organiser Profile...' : 'Finish Setup'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={styles.signUpText}>Back</Text>
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
  words: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', // Center the text
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

export default Church;
