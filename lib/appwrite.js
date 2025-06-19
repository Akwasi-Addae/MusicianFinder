import { Client, Account, Databases, ID, Permission, Role, Query } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint('') // Use your Appwrite endpoint
  .setProject('');         // Your project ID

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases, ID,  Permission, Role, Query };
