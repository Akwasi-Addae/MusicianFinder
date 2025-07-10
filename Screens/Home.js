import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
// import {  } from '@rneui/themed';
import {StyleSheet, View } from 'react-native';
import {Avatar, Text, Switch, Button, useTheme } from 'react-native-paper';

const Home = ({ route, navigation }) => {
  const { colors } = useTheme();
  const [checked, setChecked] = useState(false);
  const { firstName, lastName, num, email } = route.params;

  const nav = () => {
    if (checked) {
      navigation.navigate('MusicianLogin', {
        firstName,
        lastName,
        num,
        email,
      });
    } else {
      navigation.navigate('Church', {
        firstName,
        lastName,
        num,
        email,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <View style={styles.logo}>
        <Avatar.Image size={150} rounded source={require('../assets/splash.png')} />
      </View>

      <View style={styles.words}>
        <Text variant="headlineSmall" style={{ color: colors.onBackground, textAlign: 'center', marginBottom: 16 }}>
          Welcome to Keyboard Assistant, the app that connects churches and musicians in an efficient manner.
        </Text>

        <Text variant="titleMedium" style={{ color: colors.onBackground, textAlign: 'center' }}>
          If you are a musician, please turn the switch on. Otherwise, leave it off.
        </Text>
      </View>

      <View style={styles.switchContainer}>
        <Switch value={checked} onValueChange={setChecked} color={colors.primary} />
      </View>

      <Button
        mode="contained"
        onPress={nav}
        style={styles.loginButton}
        contentStyle={{ paddingVertical: 8 }}
        disabled={!firstName || !lastName} // optional, enable if you want to block navigation without data
      >
        Next
      </Button>
    </View>
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
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  switchContainer: {
    marginVertical: 10,
  },
  loginButton: {
    width: '80%',
    marginTop: 20,
    borderRadius: 8,
  },
});

export default Home;
