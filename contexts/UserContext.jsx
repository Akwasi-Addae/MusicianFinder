import React, { createContext, useState, useEffect, useContext } from 'react';
import { account, databases, Query } from '../lib/appwrite';

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    refreshUser();
  }, []);

  const fetchChurchForUser = async (email) => {
    try {
      const databaseId = 'x';
      const churchCollectionId = 'x';

      const res = await databases.listDocuments(databaseId, churchCollectionId, [
        Query.equal('Email', email),
      ]);

      if (res.documents.length > 0) {
        const ch = res.documents[0];
        return {
          id: ch.$id,
          name: ch.Name,
          city: ch.City,
          state: ch.State,
          zip: ch.Zip,
          address: ch.StreetAddress,
          email: ch.Email,
          userId: ch.userId,
          type: ch.type,
        };
      }
      return null;
    } catch (e) {
      console.warn('Error fetching church:', e);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      const current = await account.get();

      const church = await fetchChurchForUser(current.email);

      const updatedUser = {
        id: current.$id,
        name: current.name,
        email: current.email,
        church,
      };
      setUser(updatedUser);
      return updatedUser;
    } catch (e) {
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (err) {
      console.warn('Logout failed:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
