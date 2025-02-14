import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Switch } from '@rneui/themed';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


const Home = ({route, navigation}) => {
  const [checked, setChecked] = useState(false);
  const { firstName, lastName, num, email } = route.params;
  const toggleSwitch = () => {
    setChecked(!checked);
  };

  const nav = () => {
    console.log(firstName);
    if (checked) {
      navigation.navigate("MusicianLogin", {firstName: firstName, lastName: lastName, num: num, email: email})
    } else {
      navigation.navigate("Church")
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logo}>
          <Avatar
            size={150}
            rounded
            source={require('../assets/splash.png')}
          />
      </View>

      <View style={styles.words}>
        <Text style={styles.title}> Welcome to Keyboard Assistant,
          the app that connects churches and musicians in an efficient manner. 
        </Text>

        {/* <Text> {JSON.stringify(firstName)} </Text> */}
        <Text style={styles.title}> If you are a musician, please turn the switch on. 
          Otherwise, leave it off</Text>
      </View>

      <View>
        <Switch value={checked}onValueChange={(value) => setChecked(value)}/>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => nav()}>
        <Text style={styles.loginText}> Next </Text>
      </TouchableOpacity>
    </View>
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

export default Home;
