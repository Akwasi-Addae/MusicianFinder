import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Button, Card, SearchBar, Avatar } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { databases } from '../lib/appwrite';

const radiusOptions = [5, 10, 20];
const instrumentOptions = ['Guitar', 'Drums', 'Piano', 'Vocals'];
const orgTypeOptions = ['Church', 'Bar', 'Other'];

const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Dummy map of type to icon config (can adjust if needed)
const getAvatarIcon = (type) => {
  switch (type) {
    case 'Church':
      return { name: 'church', type: 'material-community', color: '#3B82F6', backgroundColor: '#DBEAFE' };
    case 'Bar':
      return { name: 'glass-mug', type: 'material-community', color: '#F97316', backgroundColor: '#FED7AA' };
    case 'Other':
      return { name: 'music-note', type: 'ionicon', color: '#10B981', backgroundColor: '#D1FAE5' };
    default:
      return { name: 'help-circle', type: 'ionicon', color: '#9CA3AF', backgroundColor: '#E5E7EB' };
  }
};

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [allGigs, setAllGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [radius, setRadius] = useState(10);
  const [instrument, setInstrument] = useState(null);
  const [orgType, setOrgType] = useState(null);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch gigs from Appwrite collection
  const fetchAllGigs = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments('66ad03710020e0678318', "682f1d14003bda54b7f8");
      // Example: response.documents is array of gigs
      setAllGigs(response.documents);
      applyFilters(response.documents);
    } catch (error) {
      console.error('Failed to fetch gigs', error);
      setAllGigs([]);
      setFilteredGigs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter gigs based on current filters & search
  const applyFilters = (gigs = allGigs) => {
    const userZip = user?.zip || 12180;

    // Mock nearby zips by radius (example)
    const mockNearbyZips = {
      5: [userZip],
      10: [userZip, userZip + 2],
      20: [userZip, userZip + 2, userZip + 3, userZip + 4],
    };

    const isRadiusActive = radius !== null;
    const isInstrumentActive = instrument !== null;
    const isOrgTypeActive = orgType !== null;
    const isSearchActive = search.trim().length > 0;

    const radiusZips = isRadiusActive ? mockNearbyZips[radius] : null;

    const filtered = gigs.filter((item) => {
      const matchesZip = isRadiusActive ? radiusZips.includes(item.zip || item.Zip) : true;
      const matchesInstrument = isInstrumentActive
        ? (item.instrument || item.Instrument || '').toLowerCase().includes(instrument.toLowerCase())
        : true;
      const matchesOrgType = isOrgTypeActive ? (item.type || item.Type) === orgType : true;
      const matchesSearch = isSearchActive
        ? (item.title || item.Title || '').toLowerCase().includes(search.toLowerCase())
        : true;

      return matchesZip && matchesInstrument && matchesOrgType && matchesSearch;
    });

    setFilteredGigs(filtered);
  };

  useEffect(() => {
    fetchAllGigs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [radius, instrument, orgType, search]);

  const handleLogout = () => {
    setUser(null);
    navigation.replace('Login');
  };
  
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <KeyboardAvoidingView style={theme.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <View style={theme.headerRow}>
        <Text style={theme.header}>Welcome, {user?.name || 'Musician'} 🎶</Text>
        <View style={theme.switchRow}>
          <Text style={theme.text}>{darkMode ? 'Dark' : 'Light'}</Text>
          <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
        </View>
      </View>
      <Text style={theme.subHeader}>Find your next gig</Text>

      <View style={theme.searchRow}>
        <SearchBar
          placeholder="Search gigs"
          placeholderTextColor={darkMode ? '#999' : '#555'}
          inputStyle={{ color: darkMode ? '#fff' : '#000' }}
          lightTheme={!darkMode}
          containerStyle={theme.searchContainer}
          inputContainerStyle={theme.searchInput}
          value={search}
          round
          onChangeText={setSearch}
          clearIcon={{ color: darkMode ? '#fff' : '#000' }}
        />
        <Button title="Filters" onPress={() => setShowFilters(!showFilters)} buttonStyle={theme.filterToggle} />
      </View>

      {showFilters && (
        <View style={theme.filtersSection}>
          <Text style={theme.filterLabel}>Radius</Text>
          <ScrollView horizontal style={theme.filterRow} showsHorizontalScrollIndicator={false}>
            {radiusOptions.map((r) => (
              <Button
                key={r}
                title={`${r} mi`}
                type={radius === r ? 'solid' : 'outline'}
                color={radius === r ? '#3B82F6' : '#888'}
                onPress={() => setRadius(radius === r ? null : r)}
                buttonStyle={theme.filterButton}
                containerStyle={theme.filterButtonContainer}
              />
            ))}
          </ScrollView>

          <Text style={theme.filterLabel}>Instrument</Text>
          <ScrollView horizontal style={theme.filterRow} showsHorizontalScrollIndicator={false}>
            {instrumentOptions.map((inst) => (
              <Button
                key={inst}
                title={inst}
                type={instrument === inst ? 'solid' : 'outline'}
                color={instrument === inst ? '#3B82F6' : '#888'}
                onPress={() => setInstrument(inst === instrument ? null : inst)}
                buttonStyle={theme.filterButton}
                containerStyle={theme.filterButtonContainer}
              />
            ))}
          </ScrollView>

          <Text style={theme.filterLabel}>Organization Type</Text>
          <ScrollView horizontal style={theme.filterRow} showsHorizontalScrollIndicator={false}>
            {orgTypeOptions.map((type) => (
              <Button
                key={type}
                title={type}
                type={orgType === type ? 'solid' : 'outline'}
                color={orgType === type ? '#3B82F6' : '#888'}
                onPress={() => setOrgType(type === orgType ? null : type)}
                buttonStyle={theme.filterButton}
                containerStyle={theme.filterButtonContainer}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredGigs}
          keyExtractor={(item) => item.$id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAllGigs(); }} />}
          renderItem={({ item }) => {
            const churchInfo = item.churchId?.[0];

            return(
              <Card
                containerStyle={[
                  theme.card,
                  {
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 4,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ChurchInfo', {
                      name: item.title,
                      description: item.description,
                      pay: `$${item.pay}`,
                      gigDate: formatDate(item.date),
                      gigTime: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      instruments: item.Instrument,
                      contactEmail: churchInfo?.Email,
                      city: churchInfo?.City,
                      state: churchInfo?.State,
                      zip: churchInfo?.Zip,
                      name: churchInfo?.Name,
                      contactPhone: churchInfo?.Num,
                      // contactName: churchInfo?.Contact,
                      details: item.description,
                      contactName: item.createdBy,
                      type: item.type,
                    })
                  }
                  style={theme.cardTouchable}
                >
                  <Avatar
                    rounded
                    size="medium"
                    containerStyle={{
                      backgroundColor: getAvatarIcon(item.type || item.Type).backgroundColor,
                      marginRight: 15,
                    }}
                    icon={{
                      name: getAvatarIcon(item.type || item.Type).name,
                      type: getAvatarIcon(item.type || item.Type).type,
                      color: getAvatarIcon(item.type || item.Type).color,
                    }}
                  />
                  <View style={theme.cardContent}>
                    <Text style={[theme.cardTitle, { color: darkMode ? '#fff' : '#000' }]} numberOfLines={1}>
                      {item.title || item.Title}
                    </Text>
                    <Text style={[theme.cardText, { color: darkMode ? '#ccc' : '#444' }]}>
                      {item.instrument || item.Instrument} — {item.pay ? `$${item.pay}` : 'Pay N/A'}
                    </Text>
                    <Text style={[theme.cardText, { color: darkMode ? '#ccc' : '#444' }]}>
                      {formatDate(item.date)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Card>
            );
          }}
          ListEmptyComponent={() => (
            <View style={{ padding: 20 }}>
              <Text style={{ color: darkMode ? '#999' : '#666', textAlign: 'center' }}>No gigs found.</Text>
            </View>
          )}
        />
      )}

      <Button title="Logout" onPress={handleLogout} buttonStyle={theme.logoutButton} containerStyle={{ margin: 20 }} />
    </KeyboardAvoidingView>
  );
};

const darkTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginRight: 8,
    color: '#fff',
  },
  subHeader: {
    fontSize: 18,
    color: '#ddd',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  searchInput: {
    backgroundColor: '#222',
    borderRadius: 20,
    height: 38,
  },
  filterToggle: { marginLeft: 10, backgroundColor: '#3B82F6', borderRadius: 10, paddingHorizontal: 10 },
  filtersSection: {
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  filterLabel: {
    color: '#aaa',
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterButtonContainer: {
    marginRight: 6,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
  },
  cardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardText: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
});

const lightTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginRight: 8,
    color: '#111',
  },
  subHeader: {
    fontSize: 18,
    color: '#444',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  searchInput: {
    backgroundColor: '#eee',
    borderRadius: 20,
    height: 38,
  },
  filterToggle: {
    marginLeft: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#3B82F6',
  },
  filtersSection: {
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  filterLabel: {
    color: '#444',
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterButtonContainer: {
    marginRight: 6,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
  },
  cardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardText: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
});

export default HomeScreen;
