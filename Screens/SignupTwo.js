import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
// import { Avatar } from '@rneui/themed';
import { Avatar, TextInput, Button, Text, useTheme } from 'react-native-paper';
import { ID } from 'appwrite';
import { account } from '../lib/appwrite';
import { UserContext } from '../contexts/UserContext';

const SignupTwo = ({ route, navigation }) => {
  const { firstName, lastName, num } = route.params;
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // You don't currently use username in register, but it's captured here
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const theme = useTheme();

  const register = async () => {
    setLoading(true);
    try {
      await account.deleteSession('current');
    } catch (error) {
      if (error.message.includes('missing scope')) {
        console.log('No user session to clear — continuing.');
      } else {
        console.log('Error clearing session:', error);
      }
    }

    try {
      const user = await account.create(ID.unique(), email, password, firstName);
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();

      setUser({ id: userData.$id, name: userData.name, email: userData.email });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Home', { firstName, lastName, num, email }); 
    } catch (error) {
      if (
        error.message ===
        'A user with the same id, email, or phone already exists in this project.'
      ) {
        Alert.alert('Error', error.message, [
          { text: 'Ok', onPress: () => console.log('Ok Pressed') },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', error.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <View style={styles.logo}>
        <Avatar.Image size={120} rounded source={require('../assets/splash.png')} />
      </View>

      <View style={styles.words}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Create New Account
        </Text>
        <Text style={{ color: theme.colors.onBackground }}>First Name: {firstName}</Text>
        <Text style={{ color: theme.colors.onBackground }}>Last Name: {lastName}</Text>
        <Text style={{ color: theme.colors.onBackground }}>Phone Number: {num}</Text>
      </View>

      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        returnKeyType="next"
      />

      <TextInput
        mode="outlined"
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
        returnKeyType="next"
      />

      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        returnKeyType="done"
      />

      <Button
        mode="contained"
        onPress={register}
        loading={loading}
        disabled={loading || !email || !password}
        style={styles.loginButton}
        contentStyle={{ paddingVertical: 10 }}
      >
        Create Account
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        disabled={loading}
        labelStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
        style={{ marginTop: 10 }}
      >
        Back
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  logo: {
    marginBottom: 30,
  },
  words: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    width: '80%',
    marginBottom: 16,
  },
  loginButton: {
    width: '80%',
    marginTop: 20,
  },
});

export default SignupTwo;
