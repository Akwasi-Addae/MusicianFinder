import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Switch, Button } from '@rneui/themed';
import { useUser } from '../contexts/UserContext';
import { SearchBar, Header } from '@rneui/themed';
import { Client, Databases, Query } from 'react-native-appwrite';
import { StyleSheet, FlatList, Text, View, Platform, TouchableOpacity,KeyboardAvoidingView } from 'react-native';

let client;

client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66a7b00c002771952cb7")
  // .setPlatform('com.example.KeyboardAssistant');

const databases = new Databases(client);


const HomeScreen = ({navigation}) => {
  const [churches, setChurches] = useState([]);
  const [search, setSearch] = useState('');

  const getChurches = async () => {
    try {
      const response = await databases.listDocuments(
        '66ad03710020e0678318',
        '66ad037e0022cc74d1f3',
        [
          Query.equal('Zip', [12180]),
        ]
      );
      console.log(response.documents); // Debugging: Log the fetched data
      return response.documents; // Return fetched churches
    } catch (error) {
      console.error('Error fetching churches:', error);
      return [];
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChurches();
      setChurches(data);
    };
    fetchData();
  }, []);

  
  return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar barStyle="light-content" />
        <View style={styles.topContainer}>
          <SearchBar
            placeholder="First Presby"
            round="true"
            showCancel="true"
            lightTheme="true"
            value={search}
            onChangeText={search => setSearch(search)}
            />
        </View>

        <View style={styles.churches}>
          <FlatList 
            data={churches} 
            keyExtractor={(item) => item.$id} // Unique ID from Appwrite
            renderItem={({ item }) => (
              
            <View style={{ padding: 10, borderBottomWidth: 1 }}>
                <View style={styles.logo}>
                  <Avatar
                    size={120}
                    rounded
                    source={require('../assets/splash.png')}
                  />
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("ChurchInfo", {name: item.Name, State: item.State, Zip: item.Zip})}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.Name}</Text>
                </TouchableOpacity>
                <Text>{item.State}</Text>
                <Text>Zip: {item.Zip}</Text>
              </View>
            )}
          />

        </View>

        <Button onPress={() => { logout(); navigation.navigate('Login') }} title="LogOut"/>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      padding: 17,
      backgroundColor: '#FAF0E6', // Background color for the entire screen
    },
    churches: {
      // marginBottom: 30,
      width: "100%"
    },
    words: {
      marginTop: 20,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center', // Center the text
    },
    topContainer: {
      width: "100%",
      margin: 50,
    },
    logo: {
      marginBottom: 30,
      justifyContent: "center",
      alignItems: "center"
    },
    inputContainer: {
      width: '80%', // Full width of the container for better alignment
      marginBottom: 20,
    },
    input: {
      width: '100%', // Full width to make it responsive
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: '#FFF',
    }
  });
  
  export default HomeScreen;