import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.appearance?.theme) {
        setTheme(settings.appearance.theme);
        applyTheme(settings.appearance.theme);
      }
    }
  }, []);

  // Apply theme to document
  const applyTheme = (newTheme) => {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  // Update theme
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);

    // Save to localStorage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      settings.appearance = { ...settings.appearance, theme: newTheme };
      localStorage.setItem("userSettings", JSON.stringify(settings));
    } else {
      // Create default settings if none exist
      const defaultSettings = {
        appearance: { theme: newTheme, fontSize: "medium", animations: true },
        notifications: {
          email: true,
          push: true,
          achievements: true,
          reminders: true,
        },
        privacy: {
          profileVisibility: "public",
          showProgress: true,
          showAchievements: true,
        },
        audio: { soundEffects: true, backgroundMusic: false, volume: 50 },
      };
      localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
    }
  };

  const value = {
    theme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
