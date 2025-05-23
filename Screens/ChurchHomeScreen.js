import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar } from '@rneui/themed';
import { UserContext } from '../contexts/UserContext';
import { databases } from '../lib/appwrite'; // adjust import if needed

const ChurchHomeScreen = ({ navigation }) => {
  // You can pass actual church data from login or database later
  const { user } = useContext(UserContext);
  const church = user?.church;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar
          size={100}
          rounded
          source={require('../assets/splash.png')}
        />
        <Text style={styles.churchName}>{church?.name}</Text>
        <Text style={styles.subtext}>{church?.city}, {church?.state}</Text>
        <Text style={styles.subtext}>Welcome, {user?.name}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateGig')}
        >
          <Text style={styles.buttonText}>➕ Create New Gig</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.buttonText}>⚙️ Manage Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F0EA',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  churchName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#3B5998',
  },
  subtext: {
    fontSize: 16,
    color: '#555',
  },
  buttonGroup: {
    width: '100%',
  },
  button: {
    backgroundColor: '#3B5998',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ChurchHomeScreen;
