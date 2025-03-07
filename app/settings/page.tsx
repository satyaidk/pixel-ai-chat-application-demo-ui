"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PixelContainer from "@/components/pixel-container"
import PixelButton from "@/components/pixel-button"
import PixelNeonBackground from "@/components/pixel-neon-background"
import PixelAnimatedLogo from "@/components/pixel-animated-logo"
import Link from "next/link"

interface User {
  id: string
  email: string
  name?: string
  profilePic?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [success, setSuccess] = useState<string | null>(null)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("pixelAiUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
        router.push("/auth/login")
      }
    } else {
      router.push("/auth/login")
    }

    // Get theme from localStorage or default to dark
    const storedTheme = localStorage.getItem("pixelAiTheme") || "dark"
    setTheme(storedTheme as "light" | "dark")

    // Apply theme to document
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [router])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    // Save to localStorage
    localStorage.setItem("pixelAiTheme", newTheme)

    // Apply to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    setSuccess("Theme updated successfully!")
  }

  const clearAllChats = () => {
    if (user) {
      localStorage.removeItem(`pixelAiChatHistory_${user.id}`)
      setSuccess("All chats cleared successfully!")
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <PixelNeonBackground />
        <div className="text-pixel-light dark:text-pixel-light pixel-text">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <PixelNeonBackground />

      <header className="w-full flex justify-between items-center mb-6 mt-4 max-w-[2000px] px-4">
        <Link href="/" className="flex items-center space-x-2">
          <PixelAnimatedLogo size={40} />
          <h1 className="text-xl font-bold text-pixel-primary dark:text-pixel-secondary pixel-text">PIXEL AI</h1>
        </Link>
      </header>

      <div className="w-full max-w-[2000px] px-4">
        <PixelContainer>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-pixel-primary dark:text-pixel-secondary pixel-text text-center mb-6">
              SETTINGS
            </h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-pixel-primary dark:text-pixel-secondary pixel-text mb-4">
                  APPEARANCE
                </h2>

                <div className="flex items-center justify-between p-4 border-2 border-pixel-dark dark:border-pixel-light">
                  <span className="text-pixel-dark dark:text-pixel-light pixel-text">
                    THEME: {theme === "light" ? "LIGHT" : "DARK"}
                  </span>
                  <PixelButton onClick={toggleTheme}>
                    {theme === "light" ? "SWITCH TO DARK" : "SWITCH TO LIGHT"}
                  </PixelButton>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-pixel-primary dark:text-pixel-secondary pixel-text mb-4">
                  DATA MANAGEMENT
                </h2>

                <div className="flex items-center justify-between p-4 border-2 border-pixel-dark dark:border-pixel-light">
                  <span className="text-pixel-dark dark:text-pixel-light pixel-text">CHAT HISTORY</span>
                  <PixelButton onClick={clearAllChats} variant="secondary">
                    CLEAR ALL CHATS
                  </PixelButton>
                </div>
              </div>

              {success && (
                <div className="border-2 border-green-500 bg-green-500/10 p-3 rounded-lg">
                  <p className="pixel-text text-green-500 text-center text-sm">{success}</p>
                </div>
              )}

              <Link href="/">
                <PixelButton className="w-full">BACK TO CHAT</PixelButton>
              </Link>
            </div>
          </div>
        </PixelContainer>
      </div>
    </main>
  )
}

