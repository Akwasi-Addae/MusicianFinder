import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';

import { Avatar, ActivityIndicator, Text } from 'react-native-paper'; // from react-native-paper
import { UserContext } from '../contexts/UserContext';
import { databases, Query } from '../lib/appwrite';

const ChurchHomeScreen = () => {
  const { user } = useContext(UserContext);
  const church = user?.church;

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const databaseId = '';
  const gigsCollectionId = '';

  const fetchGigs = async () => {
    if (!church?.id) {
      Alert.alert('Error', 'Church ID not found');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await databases.listDocuments(
        databaseId,
        gigsCollectionId,
        [Query.equal('churchIdStr', church.id)]
      );
      setGigs(response.documents);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      Alert.alert('Error fetching gigs', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [church]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGigs();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Avatar.Image size={100} source={require('../assets/splash.png')} />
      <Text style={styles.churchName}>{church?.name || 'Your Church'}</Text>
      <Text style={styles.subtext}>
        {church?.city || 'City'}, {church?.state || 'State'}
      </Text>
      <Text style={styles.subtext}>Welcome, {user?.name || 'User'}</Text>
    </View>
  );

  const renderEmptyList = () => (
    <Text style={styles.noGigsText}>No gigs created yet.</Text>
  );

  const renderGig = ({ item }) => (
    <View style={styles.gigCard}>
      <Text style={styles.gigTitle}>{item.title}</Text>
      <Text style={styles.gigDetails}>
        {item.date} at {item.time}
      </Text>
      <Text style={styles.gigDetails}>{item.location}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator animating={true} size="large" color="#BB86FC" />
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
          ListHeaderComponent={renderHeader}
          renderItem={renderGig}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={{ paddingVertical: 30, paddingHorizontal: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#BB86FC" />
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  churchName: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 14,
    color: '#BB86FC',
    letterSpacing: 1,
  },
  subtext: {
    fontSize: 18,
    color: '#CCC',
    marginTop: 4,
    fontWeight: '500',
  },
  noGigsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  gigCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 7,
  },
  gigTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#BB86FC',
    marginBottom: 6,
  },
  gigDetails: {
    color: '#DDD',
    fontSize: 14,
  },
});

export default ChurchHomeScreen;
