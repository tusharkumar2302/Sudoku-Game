// context/ThemeContext.js
import React, { createContext, useState } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = Appearance.getColorScheme();
  const [darkMode, setDarkMode] = useState(systemTheme === 'dark');

  const lightColors = {
    background: '#F8F9FA',
    text: '#212529',
    primary: '#6C5CE7',
    secondary: '#A29BFE',
    accent: '#FD79A8',
    success: '#00B894',
    warning: '#FDCB6E',
    card: '#FFFFFF',
    cardText: '#2D3436',
    difficultyEasy: '#55EFC4',
    difficultyMedium: '#74B9FF',
    difficultyHard: '#FF7675',
    difficultyExpert: '#A55EEA',
    icon: '#6C5CE7',
    border: '#DFE6E9',
  };

  const darkColors = {
    background: '#121212',
    text: '#E0E0E0',
    primary: '#7C4DFF',
    secondary: '#9575CD',
    accent: '#FF4081',
    success: '#00E676',
    warning: '#FFD600',
    card: '#1E1E1E',
    cardText: '#F5F5F5',
    difficultyEasy: '#00B894',
    difficultyMedium: '#0984E3',
    difficultyHard: '#D63031',
    difficultyExpert: '#6C5CE7',
    icon: '#BB86FC',
    border: '#333333',
  };

  const theme = {
    darkMode,
    colors: darkMode ? darkColors : lightColors,
    toggleDarkMode: () => setDarkMode(!darkMode),
    typography: {
      h1: {
        fontSize: 48,
        fontWeight: '800',
      },
      h2: {
        fontSize: 32,
        fontWeight: '700',
      },
      body: {
        fontSize: 16,
        fontWeight: '400',
      },
      button: {
        fontSize: 18,
        fontWeight: '600',
      },
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
      xlarge: 32,
    },
    borderRadius: {
      small: 8,
      medium: 16,
      large: 24,
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};