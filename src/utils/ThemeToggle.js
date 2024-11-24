// Initializes the theme based on user preference or system preference
export function initializeTheme(setDarkModeOn) {
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine the initial theme
  const isDarkMode = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);
  document.documentElement.classList.toggle('dark', isDarkMode);
  setDarkModeOn(isDarkMode);

  // Function to handle system theme changes
  const handleSystemThemeChange = (e) => {
    if (!localStorage.getItem('theme')) { // Only change if user hasn't set a preference
      const isDark = e.matches;
      document.documentElement.classList.toggle('dark', isDark);
      setDarkModeOn(isDark);
    }
  };

  // Add event listener for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleSystemThemeChange);

  // Cleanup event listener on unmount
  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  };
}

// Toggles the theme based on user interaction
export function toggleTheme(setDarkModeOn) {
  const isDark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  setDarkModeOn(isDark);
}
