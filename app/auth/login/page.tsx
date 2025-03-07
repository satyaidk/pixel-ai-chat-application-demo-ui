"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PixelContainer from "@/components/pixel-container"
import PixelButton from "@/components/pixel-button"
import PixelInput from "@/components/pixel-input"
import PixelNeonBackground from "@/components/pixel-neon-background"
import PixelAnimatedLogo from "@/components/pixel-animated-logo"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, you would call an API here
      // For now, we'll just simulate a login with localStorage
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // For demo purposes, we'll just check if the user exists
      // and set them as logged in
      const storedUser = localStorage.getItem("pixelAiUser")

      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.email === email) {
          // User exists, log them in
          localStorage.setItem("pixelAiUser", JSON.stringify(user))
          router.push("/")
          return
        }
      }

      throw new Error("Invalid email or password")
    } catch (err: any) {
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <PixelNeonBackground />

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <PixelAnimatedLogo size={50} />
            <h1 className="text-2xl font-bold text-pixel-primary dark:text-pixel-secondary pixel-text">PIXEL AI</h1>
          </Link>
        </div>

        <PixelContainer>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-pixel-primary dark:text-pixel-secondary pixel-text text-center mb-6">
              LOGIN
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-pixel-dark dark:text-pixel-light pixel-text mb-1">
                  EMAIL
                </label>
                <PixelInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
              </div>

              <div>
                <label htmlFor="password" className="block text-pixel-dark dark:text-pixel-light pixel-text mb-1">
                  PASSWORD
                </label>
                <PixelInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                />
              </div>

              {error && (
                <div className="border-2 border-pixel-primary bg-pixel-primary/10 p-3 rounded-lg">
                  <p className="pixel-text text-pixel-primary text-center text-sm">{error}</p>
                </div>
              )}

              <PixelButton type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </PixelButton>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/auth/signup"
                className="text-pixel-dark dark:text-pixel-light hover:underline pixel-text text-sm"
              >
                DON'T HAVE AN ACCOUNT? SIGN UP
              </Link>
            </div>
          </div>
        </PixelContainer>
      </div>
    </main>
  )
}

