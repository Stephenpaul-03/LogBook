import { useEffect, useState } from "react"
import type React from "react"

import {
  ThemeProviderContext,
  type Theme,
} from "@/components/theme/theme-context"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light"
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      const storedTheme = localStorage.getItem(storageKey)

      return isTheme(storedTheme)
        ? storedTheme
        : defaultTheme
    }
  )
  const [splash, setSplash] = useState<{ x: number; y: number; color: string } | null>(null)

  useEffect(() => {
    const root = window.document.documentElement

    // Disable transitions temporarily to prevent lag when switching themes
    const css = document.createElement("style")
    css.type = "text/css"
    css.appendChild(
      document.createTextNode(
        `* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`
      )
    )
    document.head.appendChild(css)

    root.classList.remove("light", "dark")
    root.classList.add(theme)

    // Force a reflow
    void window.getComputedStyle(css).opacity

    // Re-enable transitions
    setTimeout(() => {
      document.head.removeChild(css)
    }, 0)
  }, [theme])

  const value = {
    theme,
    setTheme: (nextTheme: Theme, event?: React.MouseEvent | { clientX: number; clientY: number }) => {
      if (event) {
        const { clientX, clientY } = event

        setSplash({
          x: clientX,
          y: clientY,
          color: nextTheme === "light" ? "#ffffff" : "#09090b",
        })

        setTimeout(() => {
          localStorage.setItem(storageKey, nextTheme)
          setTheme(nextTheme)
        }, 400)

        setTimeout(() => {
          setSplash(null)
        }, 1000)
      } else {
        localStorage.setItem(storageKey, nextTheme)
        setTheme(nextTheme)
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
      {splash && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          <div
            className="project-splash-circle"
            style={{
              left: `${splash.x}px`,
              top: `${splash.y}px`,
              backgroundColor: splash.color,
            }}
          />
        </div>
      )}
    </ThemeProviderContext.Provider>
  )
}
