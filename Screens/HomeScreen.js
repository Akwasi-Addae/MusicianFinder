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
  RefreshControl,
} from 'react-native';
import {
  Button,
  Card,
  Avatar,
  Searchbar,
  Switch,
  ActivityIndicator,
  useTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../contexts/UserContext';
import { databases, Query } from '../lib/appwrite';

const radiusOptions = [5, 10, 20];
const instrumentOptions = ['Guitar', 'Organ', 'Piano', 'Voice'];
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

// Map type to icon name and color for Avatar.Icon
const getAvatarIcon = (type) => {
  switch (type) {
    case 'Church':
      return { icon: 'church', color: '#3B82F6', backgroundColor: '#DBEAFE' };
    case 'Bar':
      return { icon: 'glass-mug', color: '#F97316', backgroundColor: '#FED7AA' };
    case 'Other':
      return { icon: 'music-note', color: '#10B981', backgroundColor: '#D1FAE5' };
    default:
      return { icon: 'help-circle', color: '#9CA3AF', backgroundColor: '#E5E7EB' };
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
      const response = await databases.listDocuments('x', 'x',[Query.equal("acceptedBy", "'")]);
      console.log(response.documents);
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
      // New condition: only show gigs where acceptedBy is null or undefined
      // if (item.acceptedBy) return false;

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

  // For switching between light/dark theme using react-native-paper themes
  const paperTheme = {
    ...useTheme(),
    dark: darkMode,
    colors: {
      ...useTheme().colors,
      background: darkMode ? '#121212' : '#F9FAFB',
      surface: darkMode ? '#1E1E1E' : '#fff',
      text: darkMode ? '#fff' : '#111',
      placeholder: darkMode ? '#999' : '#555',
      primary: '#3B82F6',
      accent: '#10B981',
      error: '#EF4444',
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style={darkMode ? 'light' : 'dark'} />

        <View style={styles.headerRow}>
          <Text style={[styles.header, { color: paperTheme.colors.text }]}>Welcome, {user?.name || 'Musician'} 🎶</Text>
          <View style={styles.switchRow}>
            <Text style={[styles.text, { color: paperTheme.colors.text }]}>{darkMode ? 'Dark' : 'Light'}</Text>
            <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
          </View>
        </View>

        <Text style={[styles.subHeader, { color: paperTheme.colors.text }]}>Find your next gig</Text>

        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Search gigs"
            placeholderTextColor={paperTheme.colors.placeholder}
            onChangeText={setSearch}
            value={search}
            style={styles.searchbar}
            inputStyle={{ color: paperTheme.colors.text }}
            iconColor={paperTheme.colors.placeholder}
            clearIcon={search ? 'close' : null}
          />
          <Button
            mode={showFilters ? 'contained' : 'outlined'}
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterToggle}
            contentStyle={{ paddingHorizontal: 10 }}
          >
            Filters
          </Button>
        </View>

        {showFilters && (
          <View style={styles.filtersSection}>
            <Text style={[styles.filterLabel, { color: paperTheme.colors.placeholder }]}>Radius</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {radiusOptions.map((r) => (
                <Button
                  key={r}
                  mode={radius === r ? 'contained' : 'outlined'}
                  onPress={() => setRadius(radius === r ? null : r)}
                  style={styles.filterButton}
                  compact
                >
                  {r} mi
                </Button>
              ))}
            </ScrollView>

            <Text style={[styles.filterLabel, { color: paperTheme.colors.placeholder }]}>Instrument</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {instrumentOptions.map((inst) => (
                <Button
                  key={inst}
                  mode={instrument === inst ? 'contained' : 'outlined'}
                  onPress={() => setInstrument(inst === instrument ? null : inst)}
                  style={styles.filterButton}
                  compact
                >
                  {inst}
                </Button>
              ))}
            </ScrollView>

            <Text style={[styles.filterLabel, { color: paperTheme.colors.placeholder }]}>Organization Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {orgTypeOptions.map((type) => (
                <Button
                  key={type}
                  mode={orgType === type ? 'contained' : 'outlined'}
                  onPress={() => setOrgType(type === orgType ? null : type)}
                  style={styles.filterButton}
                  compact
                >
                  {type}
                </Button>
              ))}
            </ScrollView>
          </View>
        )}

        {loading ? (
          <ActivityIndicator animating={true} size="large" color={paperTheme.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredGigs}
            keyExtractor={(item) => item.$id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAllGigs(); }} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => {
              const churchInfo = item.churchId?.[0];

              const avatarInfo = getAvatarIcon(item.type || item.Type);

              return (
                <Card
                  style={[
                    styles.card,
                    {
                      backgroundColor: paperTheme.colors.surface,
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
                        contactName: item.createdBy,
                        type: item.type,
                      })
                    }
                    style={styles.cardTouchable}
                  >
                    <Avatar.Icon
                      icon={avatarInfo.icon}
                      size={48}
                      color={avatarInfo.color}
                      style={{ backgroundColor: avatarInfo.backgroundColor, marginRight: 15 }}
                    />
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, { color: paperTheme.colors.text }]} numberOfLines={1}>
                        {item.title || item.Title}
                      </Text>
                      <Text style={[styles.cardText, { color: paperTheme.colors.placeholder }]}>
                        {item.instrument || item.Instrument} — {item.pay ? `$${item.pay}` : 'Pay N/A'}
                      </Text>
                      <Text style={[styles.cardText, { color: paperTheme.colors.placeholder }]}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            }}
            ListEmptyComponent={() => (
              <View style={{ padding: 20 }}>
                <Text style={{ color: paperTheme.colors.placeholder, textAlign: 'center' }}>No gigs found.</Text>
              </View>
            )}
          />
        )}

        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: paperTheme.colors.error }]}
          contentStyle={{ paddingVertical: 8 }}
        >
          Logout
        </Button>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginRight: 8,
  },
  subHeader: {
    fontSize: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchbar: {
    flex: 1,
    elevation: 2,
    borderRadius: 20,
  },
  filterToggle: {
    marginLeft: 10,
  },
  filtersSection: {
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  filterLabel: {
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterButton: {
    marginRight: 6,
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
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
    margin: 20,
  },
});

export default HomeScreen;
