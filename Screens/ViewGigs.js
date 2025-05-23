import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { databases, Query } from '../lib/appwrite';
import { useUser } from '../contexts/UserContext';

const ViewGigs = () => {
  const { user } = useUser();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const databaseId = '66ad03710020e0678318';
  const gigsCollectionId = '682f1d14003bda54b7f8';

  useEffect(() => {
    const fetchGigs = async () => {
      if (!user?.church?.id) {
        Alert.alert('Error', 'Church ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await databases.listDocuments(
          databaseId,
          gigsCollectionId,
          [Query.equal('churchIdStr', user.church.id)]
        );
        setGigs(response.documents);
      } catch (error) {
        console.error('Error fetching gigs:', error);
        Alert.alert('Error fetching gigs', error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#BB86FC" />
        </View>
      </SafeAreaView>
    );
  }

  if (gigs.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.centered}>
          <Text style={styles.noGigsText}>No gigs created yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <FlatList
          data={gigs}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.gigCard}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.detailText}>
                {item.date} at {item.time}
              </Text>
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGigsText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  gigCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    color: '#BB86FC', // Accent purple
    marginBottom: 6,
  },
  detailText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
});

export default ViewGigs;
