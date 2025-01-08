import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
    // Get saved theme from localStorage, default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    const [theme, setTheme] = useState(savedTheme);

    // Toggle theme between light and dark
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Store theme in localStorage
    };

    // Update body class for theme changes
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};