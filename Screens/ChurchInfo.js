import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Avatar } from '@rneui/themed';

const ChurchInfo = ({ route, navigation }) => {
  const {
    name = 'St. Luke’s Baptist Church',
    state = 'NY',
    zip = '12208',
    city = 'Albany',
    contactName = 'Jane Doe',
    contactRole = 'Worship Leader',
    contactEmail = 'janedoe@stlukes.org',
    contactPhone = '(123) 456-7890',
    gigDate = 'Sunday, April 20',
    gigTime = '10:30 AM',
    gigType = 'Sunday Worship',
    instruments = 'Keyboard, Vocalist',
    pay = '$100',
    details = "Lorem ipsum"
  } = route.params || {};

  const [showContactOptions, setShowContactOptions] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showContactOptions ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [showContactOptions]);

  const slideTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length !== 10) return phone;
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  }

  const openMap = () => {
    const address = `${name}, ${city}, ${state} ${zip}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the map app');
    });
  };

  const handleCall = () => {
    const cleaned = contactPhone.replace(/\D/g, '');
    Linking.openURL(`tel:${cleaned}`).catch(() => {
      Alert.alert('Error', 'Could not open the dialer');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contactEmail}`).catch(() => {
      Alert.alert('Error', 'Could not open the email client');
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Church Avatar and Info */}
      <View style={styles.logo}>
        <Avatar size={120} rounded source={require('../assets/splash.png')} />
        <Text style={styles.churchName}>{name}</Text>
        <Text style={styles.location}>{`${city}, ${state} ${zip}`}</Text>

        <TouchableOpacity style={styles.mapButton} onPress={openMap}>
          <Text style={styles.mapButtonText}>📍 View on Map</Text>
        </TouchableOpacity>
      </View>

      {/* Gig Details */}
      <View style={styles.card}>
        <Text style={styles.heading}>🎶 Gig Details</Text>
        <Text style={styles.item}>📅 Date: {gigDate}</Text>
        <Text style={styles.item}>🕒 Time: {gigTime}</Text>
        <Text style={styles.item}>🎸 Instruments: {instruments}</Text>
        <Text style={styles.item}>💵 Compensation: {pay}</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.card}>
        <Text style={styles.heading}>📞 Contact</Text>
        <Text style={styles.item}>👤 {contactName} ({contactRole})</Text>
        <Text style={styles.item}>📧 {contactEmail}</Text>
        <Text style={styles.item}>📱 {formatPhoneNumber(contactPhone)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}> Additional Info </Text>
        <Text style={styles.item}> {details} </Text>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => setShowContactOptions(!showContactOptions)}
      >
        <Text style={styles.applyButtonText}>
          {showContactOptions ? 'Hide Options' : 'Apply for Gig'}
        </Text>
      </TouchableOpacity>

      {/* Animated Call/Email Buttons */}
      {showContactOptions && (
        <Animated.View
          style={[
            styles.optionContainer,
            {
              opacity: slideAnim,
              transform: [{ translateY: slideTranslate }],
            },
          ]}
        >
          <TouchableOpacity style={styles.optionButton} onPress={handleCall}>
            <Text style={styles.optionButtonText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleEmail}>
            <Text style={styles.optionButtonText}>📧 Email</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FDF8F3',
    alignItems: 'center',
  },
  logo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  churchName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2D2D2D',
    textAlign: 'center',
  },
  location: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  mapButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#3B5998',
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3B5998',
  },
  item: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#3B5998',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  optionContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 20,
  },
  optionButton: {
    backgroundColor: '#8B9DC3',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  optionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChurchInfo;
