import React, { createContext, useState, useEffect, useContext } from 'react';
import account from '../lib/appwrite';

// Create the context
export const UserContext = createContext({
  user: null,
  setUser: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const session = await account.get();
        setUser({
          id: session.$id,
          name: session.name,
          email: session.email,
        });
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (err) {
      console.warn('Logout failed:', err);
    } finally {
      setUser(null);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const current = await account.get();
      setUser({
        id: current.$id,
        name: current.name,
        email: current.email,
      });
    } catch {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy context access
export const useUser = () => useContext(UserContext);
