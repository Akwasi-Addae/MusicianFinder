import { Avatar } from '@rneui/themed';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const SignupTwo = ({ route, navigation }) => {

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logo}>
        <Avatar size={120} rounded source={require('../assets/splash.png')}/>
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
  inputContainer: {
    width: '80%', // Full width of the container for better alignment
    marginBottom: 20,
  },
});

export default SignupTwo;
