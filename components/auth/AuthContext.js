import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const checkAuthState = () => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitializing(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = checkAuthState();
    return () => unsubscribe();
  }, []);

  const contextValue = {
    user,
    checkAuthState,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {initializing ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
