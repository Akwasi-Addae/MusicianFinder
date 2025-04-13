import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar } from '@rneui/themed';

const ChurchHomeScreen = ({ navigation }) => {
  // You can pass actual church data from login or database later
  const churchName = 'St. Luke’s Baptist Church';
  const contactPerson = 'Jane Doe';
  const city = 'Albany';
  const state = 'NY';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Avatar
          size={100}
          rounded
          source={require('../assets/splash.png')}
        />
  
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
});

export default ChurchHomeScreen;
