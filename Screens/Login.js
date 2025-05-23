import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext'; // Import useUser
import { account, Query, databases } from '../lib/appwrite'; // Import appwrite account
import { StatusBar } from 'expo-status-bar';
import { Avatar } from '@rneui/themed';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const Login = ({ navigation }) => {
  const { setUser } = useUser(); // Access setUser from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.log('No existing session to clear:', error.message);
    }

    try {
      await account.createEmailPasswordSession(email, password);

      const user = await account.get();

      // Fetch the church document
      const databaseId = "66ad03710020e0678318";
      const churchCollectionId = "66ad037e0022cc74d1f3";

      const churchRes = await databases.listDocuments(
        databaseId,
        churchCollectionId,
        [Query.equal('Email', email)]
      );

      let church = null;
      if (churchRes.documents.length > 0) {
        const ch = churchRes.documents[0];
        church = {
          id: ch.$id,
          name: ch.Name,
          city: ch.City,
          state: ch.State,
          zip: ch.Zip,
          address: ch.StreetAddress,
          email: ch.Email,
          userId: ch.userId,
          type: ch.type,
        };
      }

      // Attach church info to user context
      setUser({
        ...user,
        church,
      });

      if (church) {
        navigation.navigate('ChurchTabs', { screen: 'ChurchHome' });
      } else {
        navigation.navigate('MusicianTabs', { screen: 'HomeScreen' });
      }
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
      <View style={styles.logo}>
        <Avatar size={120} rounded source={require('../assets/splash.png')} />
      </View>

      <View style={styles.words}>
        <Text style={styles.title}>Login to Your Account</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => login(email, password)}>
        <Text style={styles.loginText}>{loading ? 'Logging In...' : 'Log In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
    backgroundColor: '#FAF0E6',
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
    textAlign: 'center',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#3B5998',
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
    textDecorationLine: 'underline',
  },
});

export default Login;
