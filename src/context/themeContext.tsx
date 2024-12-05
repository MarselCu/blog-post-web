import { createContext, useContext, useState, useEffect } from "react";

// Membuat context untuk tema
const ThemeContext = createContext({
  theme: "light", // default theme
  setTheme: (theme: string) => {}, // fungsi untuk mengubah tema
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Mengecek theme yang disimpan di localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

// Hook untuk mengakses context
export const useTheme = () => useContext(ThemeContext);
