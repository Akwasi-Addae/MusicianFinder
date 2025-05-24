import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { account, databases, Query } from '../lib/appwrite';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from '@rneui/themed';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const Login = ({ navigation }) => {
  const { setUser, refreshUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Clear any existing session
      await account.deleteSession('current').catch(() => {});

      // Create new session
      await account.createEmailPasswordSession(email, password);

      // Refresh user context, which also fetches church data
      const updatedUser = await refreshUser();

      if (updatedUser?.church) {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          autoCapitalize="none"
          keyboardType="email-address"
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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => login(email.trim(), password)}
        disabled={loading}
      >
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
