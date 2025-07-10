import React, { useState } from 'react';
import {
  View,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { databases, ID, Permission, Role } from '../lib/appwrite';
import { useUser } from '../contexts/UserContext';

const CreateGig = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useUser();  // use custom hook for user context
  const church = user?.church;

  const [title, setTitle] = useState('');
  const [pay, setPay] = useState('');
  const [description, setDescription] = useState('');
  const [instrument, setInstrument] = useState('');
  const [date, setDate] = useState(new Date());
  const [pickerMode, setPickerMode] = useState(null); // 'date' or 'time'
  const [loading, setLoading] = useState(false);

  // For validation error display (simple example)
  const [titleError, setTitleError] = useState(false);
  const [payError, setPayError] = useState(false);

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
    setTitleError(!title.trim());
    setPayError(!pay.trim() || isNaN(parseInt(pay, 10)));

    if (!title.trim() || !pay.trim() || isNaN(parseInt(pay, 10))) {
      Alert.alert('Error', 'Please fill out all required fields with valid values.');
      return;
    }
    if (!church?.id) {
      Alert.alert('Error', 'No church associated with this user. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const response = await databases.createDocument(
        'x',
        'x',
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
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: colors.background }}>
        <Text variant="headlineMedium" style={{ marginBottom: 20, color: colors.primary }}>
          Create New Gig
        </Text>

        <TextInput
          label="Gig Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          error={titleError}
          style={{ marginBottom: 10 }}
        />
        {titleError && <HelperText type="error">Title is required.</HelperText>}

        <Button
          mode="outlined"
          onPress={() => showPicker('date')}
          style={{ marginBottom: 10 }}
        >
          Select Date: {date.toDateString()}
        </Button>

        <Button
          mode="outlined"
          onPress={() => showPicker('time')}
          style={{ marginBottom: 10 }}
        >
          Select Time: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Button>

        <TextInput
          label="Pay *"
          value={pay}
          onChangeText={setPay}
          mode="outlined"
          keyboardType="numeric"
          error={payError}
          style={{ marginBottom: 10 }}
        />
        {payError && <HelperText type="error">Valid numeric pay is required.</HelperText>}

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={{ marginBottom: 10 }}
        />

        <TextInput
          label="Instrument"
          value={instrument}
          onChangeText={setInstrument}
          mode="outlined"
          style={{ marginBottom: 20 }}
        />

        <Button
          mode="contained"
          onPress={createGig}
          loading={loading}
          disabled={loading}
          contentStyle={{ paddingVertical: 8 }}
        >
          Create Gig
        </Button>

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

export default CreateGig;
