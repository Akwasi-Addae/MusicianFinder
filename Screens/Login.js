import { Avatar } from '@rneui/themed';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Client, Account, ID } from 'react-native-appwrite';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';

let client;
let account;

client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66a7b00c002771952cb7")
  // .setPlatform('com.example.KeyboardAssistant');

account = new Account(client);

const Login = ({navigation}) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try{
      await account.deleteSession('current');
    } catch (error) {
      console.log('Test');
    }

    try{
      await account.createEmailPasswordSession(email, password);
      setLoggedInUser(await account.get());
      Alert.alert('Success', 'User login succesful');
      navigation.navigate('MusicianTabs', { screen: 'HomeScreen' });
    } catch (error) {
      console.log('Error logging in user:', error);
      Alert.alert('Error', error.message || 'Failed to login user.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <Text>
        {loggedInUser ? `Logged in as ${loggedInUser.name}` : 'Not logged in'}
      </Text>
      <View style={styles.logo}>
        <Avatar
          size={120}
          rounded
          source={require('../assets/splash.png')}
        />
      </View>

      <View style={styles.words}>
        <Text style={styles.title}>Login to Your Account</Text>
      </View>

      <View style={styles.inputContainer}>
        {/* Username Field */}
        <TextInput 
          value={email}
          style={styles.input}
          placeholder="email" // Add a placeholder for guidance
          onChangeText={email => setEmail(email)}
        />
      </View>

      <View style={styles.inputContainer}>
        {/* Password Field */}
        <TextInput 
          value={password}
          style={styles.input}
          placeholder="Password" // Add a placeholder for guidance
          onChangeText={password => setPassword(password)}
          secureTextEntry={true} // Make sure the password is hidden
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => login(email, password)}>
        <Text style={styles.loginText}>{loading ? 'Logging In...' : 'Log In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

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

export default Login;
