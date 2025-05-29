import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { databases, ID, Permission, Role } from '../lib/appwrite';
import { useUser } from '../contexts/UserContext';

const CreateGig = ({ navigation }) => {
  const { user } = useUser();  // use custom hook for user context
  const church = user?.church;

  const [title, setTitle] = useState('');
  const [pay, setPay] = useState('');
  const [description, setDescription] = useState('');
  const [instrument, setInstrument] = useState('');
  const [date, setDate] = useState(new Date());
  const [pickerMode, setPickerMode] = useState(null); // 'date' or 'time'
  const [loading, setLoading] = useState(false);

  const showPicker = (mode) => setPickerMode(mode);
  const hidePicker = () => setPickerMode(null);

  const handleConfirm = (selected) => {
    const newDate = new Date(date);
    if (pickerMode === 'date') {
      newDate.setFullYear(selected.getFullYear());
      newDate.setMonth(selected.getMonth());
      newDate.setDate(selected.getDate());
    } else if (pickerMode === 'time') {
      newDate.setHours(selected.getHours());
      newDate.setMinutes(selected.getMinutes());
      newDate.setSeconds(0);
    }
    setDate(newDate);
    hidePicker();
  };

  const formatDateTimeForAppwrite = (date) => date.toISOString();

  const createGig = async () => {
    if (!title || !date || !pay) {
      Alert.alert('Error', 'Please fill out the required fields');
      return;
    }
    if (!church?.id) {
      Alert.alert('Error', 'No church associated with this user. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const response = await databases.createDocument(
        '66ad03710020e0678318',
        '682f1d14003bda54b7f8',
        ID.unique(),
        {
          pay: parseInt(pay, 10),
          title,
          description,
          createdBy: user.name,
          churchId: [church.id],  // array for relationship field in Appwrite
          churchIdStr: church.id,
          type: church.type || 'Church',
          location: church.StreetAddress,
          Instrument: instrument,
          date: formatDateTimeForAppwrite(date),
        },
        [
          Permission.read(Role.user(user.id)),
          Permission.update(Role.user(user.id)),
          Permission.delete(Role.user(user.id)),
        ]
      );

      console.log('Gig created:', response);
      Alert.alert('Success', 'Gig created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating gig:', error);
      Alert.alert('Error', 'Could not create gig.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create New Gig</Text>

        <TextInput
          style={styles.input}
          placeholder="Gig Title"
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity style={styles.input} onPress={() => showPicker('date')}>
          <Text>Select Date: {date.toDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.input} onPress={() => showPicker('time')}>
          <Text>
            Select Time: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Pay (e.g. 50 or 50/hour)"
          value={pay}
          onChangeText={setPay}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={[styles.input]}
          placeholder="Instrument"
          multiline
          value={instrument}
          onChangeText={setInstrument}
        />

        <TouchableOpacity style={styles.button} onPress={createGig} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Gig'}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={!!pickerMode}
          mode={pickerMode}
          date={date}
          onConfirm={handleConfirm}
          onCancel={hidePicker}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          themeVariant="light"
          minimumDate={new Date()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3B5998',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3B5998',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateGig;
