import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'theme-neon';
  });

  useEffect(() => {
    // Remove all previous theme classes
    document.documentElement.classList.remove(
      'theme-neon',
      'theme-dark-blue',
      'theme-red-energy',
      'theme-purple-neon',
      'theme-light-pro'
    );
    
    // Add new theme class
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
