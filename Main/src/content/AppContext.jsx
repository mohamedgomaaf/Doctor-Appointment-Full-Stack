import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { doctors } from "../assets/assets";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:3000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const value = {
    doctors,
    currencySymbol: "$",
    user,
    setUser,
    fetchUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
