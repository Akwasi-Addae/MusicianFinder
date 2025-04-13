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

    // Placeholder for actual submission logic (e.g., Appwrite)
    console.log('Submitting gig request:', gigData);
    Alert.alert('Success', 'Gig request submitted!');

    // Optional: navigate back or reset fields
    // navigation.goBack();
    // or clear fields
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎵 Create a New Gig Request</Text>

      <TextInput
        style={styles.input}
        placeholder="Gig Type (e.g., Sunday Worship)*"
        value={gigType}
        onChangeText={setGigType}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (e.g., April 21)*"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (e.g., 10:30 AM)*"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Instruments Needed (e.g., Piano, Guitar)*"
        value={instruments}
        onChangeText={setInstruments}
      />
      <TextInput
        style={styles.input}
        placeholder="Music Style (e.g., Gospel, Contemporary)"
        value={style}
        onChangeText={setStyle}
      />
      <TextInput
        style={styles.input}
        placeholder="Pay / Compensation (e.g., $100)"
        value={pay}
        onChangeText={setPay}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Name*"
        value={contactName}
        onChangeText={setContactName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Email*"
        value={contactEmail}
        onChangeText={setContactEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Phone"
        value={contactPhone}
        onChangeText={setContactPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Gig</Text>
      </TouchableOpacity>
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
