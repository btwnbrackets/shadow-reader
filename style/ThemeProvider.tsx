import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, ThemeType } from "./theme";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


type Props = PropsWithChildren<{
}>;

export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<ThemeType>(lightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme === "dark" ? darkTheme : lightTheme);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === "dark" ? darkTheme : lightTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme.mode === "light" ? darkTheme : lightTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme.mode); // Save choice
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
