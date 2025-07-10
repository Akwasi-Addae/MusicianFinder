import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  Alert,
  Platform,
  Linking,
  Animated,
  Easing,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { useUser } from '../contexts/UserContext';

const ChurchInfo = ({ route }) => {
  // const { user } = useUser();
  const {
    name = 'St. Luke’s Baptist Church',
    state = 'NY',
    zip = '12208',
    city = 'Albany',
    contactName = 'Jane Doe',
    contactEmail = 'janedoe@stlukes.org',
    contactPhone = '(123) 456-7890',
    gigDate = 'Sunday, April 20',
    gigTime = '10:30 AM',
    instruments = 'Keyboard, Vocalist',
    pay = '$100',
    details = 'Lorem ipsum',
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 30,
          paddingHorizontal: 20,
          backgroundColor: '#FDF8F3',
          alignItems: 'center',
        }}
      >
        <Avatar.Image size={120} source={require('../assets/splash.png')} />
        <Text
          variant="headlineMedium"
          style={{
            marginTop: 16,
            textAlign: 'center',
            color: '#2D2D2D',
            fontWeight: 'bold',
          }}
        >
          {name}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ textAlign: 'center', color: '#666', marginBottom: 12 }}
        >
          {`${city}, ${state} ${zip}`}
        </Text>
        <Button
          mode="contained"
          onPress={openMap}
          style={{ marginBottom: 30, borderRadius: 8 }}
          icon="map-marker"
        >
          View on Map
        </Button>

        {/* Gig Details */}
        <Card style={styles.card}>
          <Card.Title title="🎶 Gig Details" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text variant="bodyMedium">📅 {gigDate}</Text>
            <Text variant="bodyMedium">🕒 {gigTime}</Text>
            <Text variant="bodyMedium">🎸 {instruments}</Text>
            <Text variant="bodyMedium">💵 {pay}</Text>
          </Card.Content>
        </Card>

        {/* Contact */}
        <Card style={styles.card}>
          <Card.Title title="📞 Contact" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text variant="bodyMedium">👤 {contactName}</Text>
            <Text variant="bodyMedium">📧 {contactEmail}</Text>
            <Text variant="bodyMedium">📱 {formatPhoneNumber(contactPhone)}</Text>
          </Card.Content>
        </Card>

        {/* Additional Info */}
        <Card style={styles.card}>
          <Card.Title title="📝 Additional Info" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text variant="bodyMedium">{details}</Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => setShowContactOptions(!showContactOptions)}
          style={{
            borderRadius: 14,
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: 10,
            marginBottom: showContactOptions ? 10 : 40,
          }}
        >
          {showContactOptions ? 'Hide Options' : 'Apply for Gig'}
        </Button>

        {showContactOptions && (
          <Animated.View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              width: '100%',
              opacity: slideAnim,
              transform: [{ translateY: slideTranslate }],
            }}
          >
            <Button
              mode="contained"
              onPress={handleCall}
              style={styles.contactBtn}
              icon="phone"
            >
              Call
            </Button>
            <Button
              mode="contained"
              onPress={handleEmail}
              style={[styles.contactBtn]}
              icon="email"
            >
              Email
            </Button>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  card: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#FFF',
  },
  cardTitle: {
    color: '#3B5998',
    fontWeight: 'bold',
  },
  contactBtn: {
    flexBasis: '30%',
    borderRadius: 12,
    marginBottom: 10,
  },
};

export default ChurchInfo;
