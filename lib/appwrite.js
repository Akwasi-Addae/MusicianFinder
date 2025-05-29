import { Client, Account, Databases, ID, Permission, Role, Query } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Use your Appwrite endpoint
  .setProject('66a7b00c002771952cb7');         // Your project ID

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases, ID,  Permission, Role, Query };
