"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTheme } from "next-themes"

export interface CustomTheme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
  fonts: {
    size: "small" | "medium" | "large"
    family: "default" | "serif" | "mono"
  }
  accessibility: {
    highContrast: boolean
    reducedMotion: boolean
    focusVisible: boolean
  }
}

const defaultThemes: CustomTheme[] = [
  {
    id: "samsung-blue",
    name: "Samsung Blue",
    description: "Classic Samsung blue theme with modern accents",
    colors: {
      primary: "#1976D2",
      secondary: "#42A5F5",
      accent: "#2196F3",
      background: "#FFFFFF",
      foreground: "#212121",
      muted: "#F5F5F5",
      border: "#E0E0E0",
    },
    fonts: { size: "medium", family: "default" },
    accessibility: { highContrast: false, reducedMotion: false, focusVisible: true },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Clean and professional theme for business use",
    colors: {
      primary: "#2563EB",
      secondary: "#64748B",
      accent: "#0EA5E9",
      background: "#FFFFFF",
      foreground: "#0F172A",
      muted: "#F8FAFC",
      border: "#E2E8F0",
    },
    fonts: { size: "medium", family: "default" },
    accessibility: { highContrast: false, reducedMotion: false, focusVisible: true },
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Colorful and energetic theme with bright accents",
    colors: {
      primary: "#7C3AED",
      secondary: "#EC4899",
      accent: "#F59E0B",
      background: "#FFFFFF",
      foreground: "#1F2937",
      muted: "#F9FAFB",
      border: "#D1D5DB",
    },
    fonts: { size: "medium", family: "default" },
    accessibility: { highContrast: false, reducedMotion: false, focusVisible: true },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and minimal theme with subtle colors",
    colors: {
      primary: "#374151",
      secondary: "#6B7280",
      accent: "#9CA3AF",
      background: "#FFFFFF",
      foreground: "#111827",
      muted: "#F9FAFB",
      border: "#E5E7EB",
    },
    fonts: { size: "medium", family: "default" },
    accessibility: { highContrast: false, reducedMotion: false, focusVisible: true },
  },
]

interface AdvancedThemeContextType {
  customThemes: CustomTheme[]
  currentCustomTheme: CustomTheme
  setCurrentCustomTheme: (theme: CustomTheme) => void
  addCustomTheme: (theme: CustomTheme) => void
  updateCustomTheme: (id: string, updates: Partial<CustomTheme>) => void
  deleteCustomTheme: (id: string) => void
  resetToDefault: () => void
  isThemeModalOpen: boolean
  setIsThemeModalOpen: (open: boolean) => void
  applyTheme: (theme: CustomTheme) => void
}

const AdvancedThemeContext = createContext<AdvancedThemeContextType | undefined>(undefined)

export function AdvancedThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(defaultThemes)
  const [currentCustomTheme, setCurrentCustomTheme] = useState<CustomTheme>(defaultThemes[0])
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)

  // Load saved themes from localStorage
  useEffect(() => {
    const savedThemes = localStorage.getItem("calendar-custom-themes")
    const savedCurrentTheme = localStorage.getItem("calendar-current-theme")

    if (savedThemes) {
      try {
        const parsed = JSON.parse(savedThemes)
        setCustomThemes([...defaultThemes, ...parsed])
      } catch (error) {
        console.error("Failed to load custom themes:", error)
      }
    }

    if (savedCurrentTheme) {
      try {
        const parsed = JSON.parse(savedCurrentTheme)
        setCurrentCustomTheme(parsed)
        applyTheme(parsed)
      } catch (error) {
        console.error("Failed to load current theme:", error)
      }
    }
  }, [])

  // Save themes to localStorage
  const saveThemes = (themes: CustomTheme[]) => {
    const customOnly = themes.filter((t) => !defaultThemes.find((dt) => dt.id === t.id))
    localStorage.setItem("calendar-custom-themes", JSON.stringify(customOnly))
  }

  const saveCurrentTheme = (theme: CustomTheme) => {
    localStorage.setItem("calendar-current-theme", JSON.stringify(theme))
  }

  const applyTheme = (theme: CustomTheme) => {
    const root = document.documentElement

    // Apply CSS custom properties
    root.style.setProperty("--theme-primary", theme.colors.primary)
    root.style.setProperty("--theme-secondary", theme.colors.secondary)
    root.style.setProperty("--theme-accent", theme.colors.accent)
    root.style.setProperty("--theme-background", theme.colors.background)
    root.style.setProperty("--theme-foreground", theme.colors.foreground)
    root.style.setProperty("--theme-muted", theme.colors.muted)
    root.style.setProperty("--theme-border", theme.colors.border)

    // Apply font size
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }
    root.style.setProperty("--theme-font-size", fontSizes[theme.fonts.size])

    // Apply font family
    const fontFamilies = {
      default: "var(--font-sans)",
      serif: "var(--font-serif)",
      mono: "var(--font-mono)",
    }
    root.style.setProperty("--theme-font-family", fontFamilies[theme.fonts.family])

    // Apply accessibility settings
    if (theme.accessibility.reducedMotion) {
      root.style.setProperty("--theme-transition-duration", "0ms")
    } else {
      root.style.setProperty("--theme-transition-duration", "200ms")
    }

    if (theme.accessibility.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    if (theme.accessibility.focusVisible) {
      root.classList.add("focus-visible")
    } else {
      root.classList.remove("focus-visible")
    }
  }

  const handleSetCurrentCustomTheme = (theme: CustomTheme) => {
    setCurrentCustomTheme(theme)
    applyTheme(theme)
    saveCurrentTheme(theme)
  }

  const addCustomTheme = (theme: CustomTheme) => {
    const newThemes = [...customThemes, theme]
    setCustomThemes(newThemes)
    saveThemes(newThemes)
  }

  const updateCustomTheme = (id: string, updates: Partial<CustomTheme>) => {
    const newThemes = customThemes.map((theme) => (theme.id === id ? { ...theme, ...updates } : theme))
    setCustomThemes(newThemes)
    saveThemes(newThemes)

    if (currentCustomTheme.id === id) {
      const updatedTheme = { ...currentCustomTheme, ...updates }
      setCurrentCustomTheme(updatedTheme)
      applyTheme(updatedTheme)
      saveCurrentTheme(updatedTheme)
    }
  }

  const deleteCustomTheme = (id: string) => {
    // Don't delete default themes
    if (defaultThemes.find((t) => t.id === id)) return

    const newThemes = customThemes.filter((theme) => theme.id !== id)
    setCustomThemes(newThemes)
    saveThemes(newThemes)

    // If deleting current theme, switch to default
    if (currentCustomTheme.id === id) {
      handleSetCurrentCustomTheme(defaultThemes[0])
    }
  }

  const resetToDefault = () => {
    setCustomThemes(defaultThemes)
    handleSetCurrentCustomTheme(defaultThemes[0])
    localStorage.removeItem("calendar-custom-themes")
    localStorage.removeItem("calendar-current-theme")
  }

  return (
    <AdvancedThemeContext.Provider
      value={{
        customThemes,
        currentCustomTheme,
        setCurrentCustomTheme: handleSetCurrentCustomTheme,
        addCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
        resetToDefault,
        isThemeModalOpen,
        setIsThemeModalOpen,
        applyTheme,
      }}
    >
      {children}
    </AdvancedThemeContext.Provider>
  )
}

export function useAdvancedTheme() {
  const context = useContext(AdvancedThemeContext)
  if (context === undefined) {
    throw new Error("useAdvancedTheme must be used within an AdvancedThemeProvider")
  }
  return context
}
