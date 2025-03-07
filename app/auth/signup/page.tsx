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

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, you would call an API here
      // For now, we'll just simulate a signup with localStorage
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Simple validation
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Store user in localStorage
      const user = { email, id: Date.now().toString() }
      localStorage.setItem("pixelAiUser", JSON.stringify(user))

      // Redirect to home page
      router.push("/")
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
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
              SIGN UP
            </h1>

            <form onSubmit={handleSignup} className="space-y-4">
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
                {isLoading ? "SIGNING UP..." : "SIGN UP"}
              </PixelButton>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-pixel-dark dark:text-pixel-light hover:underline pixel-text text-sm"
              >
                ALREADY HAVE AN ACCOUNT? LOGIN
              </Link>
            </div>
          </div>
        </PixelContainer>
      </div>
    </main>
  )
}

