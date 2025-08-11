import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create Auth context
const AuthContext = createContext();

// 2. Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser(userId);
    }
  }, []); // only run once

  const value = {
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
