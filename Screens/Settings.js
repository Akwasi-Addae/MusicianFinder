import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../contexts/UserContext';

const SettingsScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const church = user?.church;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setUser(null);
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <Text style={styles.infoText}>Name: {user?.name || 'N/A'}</Text>
          <Text style={styles.infoText}>Email: {user?.email || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Church Information</Text>
          <Text style={styles.infoText}>Name: {church?.name || 'N/A'}</Text>
          <Text style={styles.infoText}>Location: {church?.city}, {church?.state}</Text>
          <Text style={styles.infoText}>Type: {church?.type || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <Text style={styles.infoText}>Version: 1.0.0</Text>
          <Text style={styles.infoText}>Developed by Dennis Kwarteng</Text>
          <Text style={styles.infoText}>Contact: luispekerson@gmail.com</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 24,
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#BB86FC',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E0AFFF',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#DDD',
    marginBottom: 6,
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#BB86FC',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
  },
});

export default SettingsScreen;
