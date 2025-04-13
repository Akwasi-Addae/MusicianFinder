import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

const CreateGigScreen = ({ navigation }) => {
  const [gigType, setGigType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [instruments, setInstruments] = useState('');
  const [style, setStyle] = useState('');
  const [pay, setPay] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleSubmit = () => {
    if (!gigType || !date || !time || !instruments || !contactName || !contactEmail) {
      Alert.alert('Missing Information', 'Please fill out all required fields.');
      return;
    }

    const gigData = {
      gigType,
      date,
      time,
      instruments,
      style,
      pay,
      contactName,
      contactEmail,
      contactPhone,
    };
    console.log('Submitting gig request:', gigData);
    Alert.alert('Success', 'Gig request submitted!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎵 Create a New Gig Request</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8F4F0',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3B5998',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#3B5998',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreateGigScreen;
