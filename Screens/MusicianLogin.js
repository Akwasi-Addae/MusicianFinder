import React, { useState } from 'react';
import { databases, ID } from "../lib/appwrite";
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../contexts/UserContext';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Avatar, TextInput, Switch, Text, Button } from 'react-native-paper';

const MusicianLogin = ({ route, navigation }) => {
  const { firstName, lastName, num, email } = route.params;
  const [zip, setZip] = useState('');
  const [isMale, setMale] = useState(false);
  const [organ, setOrgan] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleOrgan = () => setOrgan(!organ);
  const toggleMale = () => setMale(!isMale);

  const createUserProfile = async () => {
    setLoading(true);
    const selectedDatabaseId = organ ? "x" : "x";

    try {
      await databases.createDocument(
        "66ad03710020e0678318",
        selectedDatabaseId,
        ID.unique(),
        {
          "Name": firstName + ' ' + lastName,
          "Zip": parseInt(zip),
          "Gender": isMale,
          "Email": email,
          "Phone": num,
        },
      );

      navigation.navigate("MusicianTabs");
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to create user profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <View style={styles.logo}>
        <Avatar.Image
          size={120}
          rounded
          source={require('../assets/splash.png')}
          containerStyle={styles.avatar}
        />
      </View>

      <Text variant="headlineMedium" style={styles.title}>
        Musician Profile Setup
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Enter Zip Code"
          value={zip}
          onChangeText={setZip}
          keyboardType="numeric"
          mode="outlined"
          disabled={loading}
          style={styles.input}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Do you play the organ?</Text>
        <Switch
          value={organ}
          onValueChange={toggleOrgan}
          color="#f5dd4b"
          disabled={loading}
          style={styles.switch}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Are you male?</Text>
        <Switch
          value={isMale}
          onValueChange={toggleMale}
          color="#f5dd4b"
          disabled={loading}
          style={styles.switch}
        />
      </View>

      <Button
        mode="contained"
        onPress={createUserProfile}
        loading={loading}
        disabled={loading || !zip.trim()}
        style={styles.loginButton}
        contentStyle={{ paddingVertical: 8 }}
      >
        Setup Profile
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
    backgroundColor: '#FAF0E6',
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
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
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  loginButton: {
    width: '80%',
    borderRadius: 8,
    marginTop: 20,
  },
});

export default MusicianLogin;
