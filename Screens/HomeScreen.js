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
import { useUser } from '../contexts/UserContext';
import { databases } from '../lib/appwrite';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const radiusOptions = [5, 10, 20];
const instrumentOptions = ['Guitar', 'Drums', 'Piano', 'Vocals'];
const orgTypeOptions = ['Church', 'Bar', 'Other'];

const COLLECTION_IDS = {
  Church: '68213152001494825105',
  Bar: '682145c20031dba38947',
  Other: '682145cd00396cb3de84',
};

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
  const [filtered, setFiltered] = useState([]);
  const [radius, setRadius] = useState(10);
  const [instrument, setInstrument] = useState(null);
  const [orgType, setOrgType] = useState(null);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllGigs = async () => {
    setLoading(true);
    try {
      const allDocs = [];
      for (const [type, id] of Object.entries(COLLECTION_IDS)) {
        const response = await databases.listDocuments('68212fc200168f50228f', id);
        allDocs.push(...response.documents.map(doc => ({ ...doc, Type: type })));
        console.log('Sample gig:', response.documents);
      }
      console.log("");
      console.log("");
      setAllGigs(allDocs);
      filterGigs(allDocs);
    } catch (err) {
      console.error('Error fetching data:', err);
      setFiltered([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterGigs = (data = allGigs) => {
    const userZip = user?.zip || 12180;
    const mockNearbyZips = {
      5: [userZip],
      10: [userZip, userZip + 2],
      20: [userZip, userZip + 2, userZip + 3, userZip + 4],
    };

    // If all filters deselected, show all gigs
    const isRadiusActive = radius !== null;
    const isInstrumentActive = instrument !== null;
    const isOrgTypeActive = orgType !== null;
    const isSearchActive = search.trim().length > 0;

    // Compose radius zips only if radius filter active
    const radiusZips = isRadiusActive ? mockNearbyZips[radius] : null;

    const filteredList = data.filter(item => {
      // Zip filter: if radius active, check zip inclusion, else allow all
      const matchesZip = isRadiusActive ? radiusZips.includes(item.Zip) : true;
      // Instrument filter
      const matchesInstrument = isInstrumentActive ? item.Instruments?.includes(instrument) : true;
      // Org type filter
      const matchesOrgType = isOrgTypeActive ? item.Type === orgType : true;
      // Search filter
      const matchesSearch = isSearchActive ? item.Name.toLowerCase().includes(search.toLowerCase()) : true;

      return matchesZip && matchesInstrument && matchesOrgType && matchesSearch;
    });

    setFiltered(filteredList);
  };

  useEffect(() => {
    fetchAllGigs();
  }, []);

  useEffect(() => {
    filterGigs();
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
            {radiusOptions.map(r => (
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
            {instrumentOptions.map(inst => (
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
            {orgTypeOptions.map(type => (
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
          data={filtered}
          keyExtractor={item => item.$id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAllGigs(); }} />}
          renderItem={({ item }) => (
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
                onPress={() => navigation.navigate('ChurchInfo', {name: item.Name,
                  zip: item.Zip,
                  city: item.StreetAddress, // or pull this from your database if available
                  state: item.State,     // default or database-provided
                  contactName: 'Jane Doe',  // hardcoded or fetched
                  contactRole: 'Worship Leader',
                  contactEmail: item.Email,
                  contactPhone: item.Num,
                  gigDate: new Date(item.Date).toLocaleDateString(), // format as needed
                  gigTime: new Date(item.Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  instruments: item.Instrument,
                  pay: `$${item.Compensation}`,
                  details: item.Details
                })}
                style={{ flexDirection: 'row', alignItems: 'center' }}
                activeOpacity={0.7}
              >
                <Avatar
                  rounded
                  icon={getAvatarIcon(item.Type)}
                  size="medium"
                  containerStyle={{ marginRight: 12 }}
                />

                <View style={{ flex: 1 }}>
                  <Text style={theme.churchName} numberOfLines={1}>
                    {item.Name}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons name="location-outline" size={14} color="#888" />
                    <Text style={theme.churchDetails}> {item.State} • {item.Zip} •   ${item.Compensation}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <MaterialCommunityIcons name="music-note-outline" size={14} color="#4ADE80" />
                    <Text style={theme.instrumentTag}>{item.Instrument}</Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: getAvatarIcon(item.Type).backgroundColor,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 8,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text style={{ color: getAvatarIcon(item.Type).color, fontWeight: '600' }}>
                    {item.Type}
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          )}
          ListEmptyComponent={<Text style={theme.noResults}>No matches found.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Button title="Log Out" onPress={handleLogout} buttonStyle={theme.logoutButton} />
    </KeyboardAvoidingView>
  );
};

const darkTheme = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', paddingHorizontal: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 50, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subHeader: { fontSize: 16, color: '#aaa', marginBottom: 15 },
  text: { color: '#fff' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center' },
  searchContainer: { flex: 1, backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 },
  searchInput: { backgroundColor: '#333' },
  filterToggle: { marginLeft: 10, backgroundColor: '#3B82F6', borderRadius: 10, paddingHorizontal: 10 },
  filtersSection: { marginBottom: 10 },
  filterLabel: { fontSize: 14, color: '#fff', marginBottom: 5, marginTop: 10 },
  filterRow: { flexDirection: 'row', marginBottom: 5 },
  filterButton: { borderRadius: 20, paddingHorizontal: 10 },
  filterButtonContainer: { marginHorizontal: 5 },
  card: { backgroundColor: '#2c2c2c', borderColor: '#444' },
  churchName: { fontSize: 18, color: '#fff', fontWeight: '600' },
  churchDetails: { fontSize: 14, color: '#ccc' },
  instrumentTag: { fontSize: 14, color: '#4ADE80', marginTop: 5 },
  noResults: { color: '#888', textAlign: 'center', marginTop: 20 },
  logoutButton: { backgroundColor: '#EF4444', marginVertical: 20, borderRadius: 10 },
});

const lightTheme = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', paddingHorizontal: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 50, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  subHeader: { fontSize: 16, color: '#555', marginBottom: 15 },
  text: { color: '#222' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center' },
  searchContainer: { flex: 1, backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 },
  searchInput: { backgroundColor: '#eee' },
  filterToggle: { marginLeft: 10, backgroundColor: '#3B82F6', borderRadius: 10, paddingHorizontal: 10 },
  filtersSection: { marginBottom: 10 },
  filterLabel: { fontSize: 14, color: '#222', marginBottom: 5, marginTop: 10 },
  filterRow: { flexDirection: 'row', marginBottom: 5 },
  filterButton: { borderRadius: 20, paddingHorizontal: 10 },
  filterButtonContainer: { marginHorizontal: 5 },
  card: { backgroundColor: '#fff', borderColor: '#ddd' },
  churchName: { fontSize: 18, color: '#222', fontWeight: '600' },
  churchDetails: { fontSize: 14, color: '#555' },
  instrumentTag: { fontSize: 14, color: '#16a34a', marginTop: 5 },
  noResults: { color: '#888', textAlign: 'center', marginTop: 20 },
  logoutButton: { backgroundColor: '#EF4444', marginVertical: 20, borderRadius: 10 },
});

export default HomeScreen;
