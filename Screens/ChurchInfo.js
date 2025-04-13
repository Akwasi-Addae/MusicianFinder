import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar } from '@rneui/themed';

const ChurchInfo = ({ route, navigation }) => {
  // Placeholder data – you can replace these with values from your DB
  const {
    name = 'St. Luke’s Baptist Church',
    state = 'NY',
    zip = '12208',
    city = 'Albany',
    denomination = 'Baptist',
    contactName = 'Jane Doe',
    contactRole = 'Worship Leader',
    contactEmail = 'janedoe@stlukes.org',
    contactPhone = '(123) 456-7890',
    gigDate = 'Sunday, April 20',
    gigTime = '10:30 AM',
    gigType = 'Sunday Worship',
    instruments = 'Keyboard, Vocalist',
    style = 'Contemporary Gospel',
    pay = '$100',
  } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Church Avatar and Basic Info */}
      <View style={styles.logo}>
        <Avatar
          size={120}
          rounded
          source={require('../assets/splash.png')}
        />
        <Text style={styles.churchName}>{name}</Text>
        <Text style={styles.location}>{`${city}, ${state} ${zip}`}</Text>
        <Text style={styles.denomination}>{denomination}</Text>
      </View>

      {/* Gig Details Card */}
      <View style={styles.card}>
        <Text style={styles.heading}>🎶 Gig Details</Text>
        <Text style={styles.item}>📅 Date: {gigDate}</Text>
        <Text style={styles.item}>🕒 Time: {gigTime}</Text>
        <Text style={styles.item}>📌 Type: {gigType}</Text>
        <Text style={styles.item}>🎸 Instruments: {instruments}</Text>
        <Text style={styles.item}>🎼 Style: {style}</Text>
        <Text style={styles.item}>💵 Compensation: {pay}</Text>
      </View>

      {/* Contact Info Card */}
      <View style={styles.card}>
        <Text style={styles.heading}>📞 Contact</Text>
        <Text style={styles.item}>👤 {contactName} ({contactRole})</Text>
        <Text style={styles.item}>📧 {contactEmail}</Text>
        <Text style={styles.item}>📱 {contactPhone}</Text>
      </View>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton} onPress={() => alert('Application feature coming soon!')}>
        <Text style={styles.applyButtonText}>Apply for Gig</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FDF8F3',
    alignItems: 'center',
  },
  logo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  churchName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  denomination: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3B5998',
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#3B5998',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ChurchInfo;
