import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, View, StyleSheet } from 'react-native';
import {
  Avatar,
  TextInput,
  Button,
  Text,
  useTheme,
} from 'react-native-paper';

const Signup = ({ navigation }) => {
  const [num, setNum] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <View style={styles.logo}>
        <Avatar.Image
          size={120}
          rounded
          source={require('../assets/splash.png')}
        />
      </View>

      <View style={styles.words}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Create New Account
        </Text>
      </View>

      {/* First Name */}
      <TextInput
        mode="outlined"
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        autoCapitalize="words"
        returnKeyType="next"
      />

      {/* Last Name */}
      <TextInput
        mode="outlined"
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        autoCapitalize="words"
        returnKeyType="next"
      />

      {/* Phone Number */}
      <TextInput
        mode="outlined"
        label="Phone Number"
        value={num}
        onChangeText={setNum}
        keyboardType="phone-pad"
        style={styles.input}
        returnKeyType="done"
      />

      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate('SignupTwo', { firstName, lastName, num })
        }
        style={styles.loginButton}
        contentStyle={{ paddingVertical: 10 }}
        disabled={!firstName || !lastName || !num}
      >
        Next
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default Signup;
