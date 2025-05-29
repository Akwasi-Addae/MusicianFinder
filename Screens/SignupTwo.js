import { Avatar } from '@rneui/themed';
import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ID } from 'appwrite';
import { account } from "../lib/appwrite";
import { UserContext } from '../contexts/UserContext';

const SignupTwo = ({ route, navigation }) => {
  const { firstName, lastName, num } = route.params;
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);

  const register = async () => {
    setLoading(true);
    // Close any active sessions
    try {
      await account.deleteSession('current');
    } catch (error) {
      if (error.message.includes('missing scope')) {
        console.log('No user session to clear — continuing.');
      } else {
        console.log('Error clearing session:', error);
      }
    }


    // Create account
    try {
      const user = await account.create(ID.unique(), email, password, firstName);
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();

      setUser({ id: userData.$id, name: userData.name, email: userData.email, });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Home', {firstName: firstName, lastName: lastName, num: num, email: email}); // Assuming Home reads from UserContext
    } catch (error) {
      // console.error('Error creating user:', error);
      // Alert.alert('Error', error.message || 'Failed to create account.');
      if (error.message == "A user with the same id, email, or phone already exists in this project."){
        console.log("Same user info");
        Alert.alert('Error', error.message, [
          {text: 'Ok', onPress: () => console.log('Ok Pressed')}, 
          {text: 'Login', onPress: () => navigation.navigate("Login")}
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logo}>
        <Avatar size={120} rounded source={require('../assets/splash.png')} />
      </View>

      <View style={styles.words}>
        <Text style={styles.title}>Create New Account</Text>
        <Text>First Name: {firstName}</Text>
        <Text>Last Name: {lastName}</Text>
        <Text>Phone Number: {num}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize='none'
          style={styles.input}
          placeholder="Username"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          style={styles.input}
          secureTextEntry={true}
          onChangeText={setPassword}
          placeholder="Password"
        />
      </View>

      <TouchableOpacity onPress={register} disabled={loading}>
        <View style={styles.loginButton}>
          <Text style={styles.loginText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
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

export default SignupTwo;
