import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Switch } from '@rneui/themed';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


const Home = ({route, navigation}) => {
  const [checked, setChecked] = useState(false);
  const { firstName, lastName, num, email } = route.params;

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

        <Text style={styles.title}> If you are a musician, please turn the switch on. 
          Otherwise, leave it off</Text>
      </View>
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
});

export default Home;
