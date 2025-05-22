import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Avatar } from '@rneui/themed';


const Signup = ({navigation}) => {
    const [num, setNum] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar barStyle="light-content" />
        <View style={styles.logo}>
          <Avatar
            size={120}
            rounded
            source={require('../assets/splash.png')}
          />
        </View>

        <View style={styles.words}>
          <Text style={styles.title}>Create New Account</Text>
        </View>

        {/* First Name */}
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            value={firstName} 
            placeholder='First Name'
            onChangeText={firstName => setFirstName(firstName)}    
          />
            
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            value={lastName} 
            placeholder='Last Name'
            onChangeText={lastName => setLastName(lastName)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            value={num}
            onChangeText={setNum}
            style={styles.input}
            placeholder="phone number"
            keyboardType="number-pad"
            // keyboardAppearance='dark'
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("SignupTwo", {firstName: firstName,lastName: lastName,num: num})}>
          <Text style={styles.loginText}> Next </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
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

export default Signup;
