"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import PixelContainer from "@/components/pixel-container"
import PixelButton from "@/components/pixel-button"
import PixelInput from "@/components/pixel-input"
import PixelNeonBackground from "@/components/pixel-neon-background"
import PixelAnimatedLogo from "@/components/pixel-animated-logo"
import Link from "next/link"

// Sample anime-style profile pictures
const SAMPLE_PROFILE_PICS = [
  "/profile-pics/anime-1.jpeg",
  "/profile-pics/anime-2.jpeg",
  "/profile-pics/anime-3.jpeg",
  "/profile-pics/anime-4.jpeg",
  "/profile-pics/anime-5.jpeg",
  "/profile-pics/anime-6.jpeg",
  "/profile-pics/anime-7.jpeg",
  "/profile-pics/anime-8.jpeg",
]

// Default profile picture
const DEFAULT_PROFILE_PIC = "/profile-pics/default.jpeg"

interface User {
  id: string
  email: string
  name?: string
  profilePic?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [selectedPic, setSelectedPic] = useState("")
  const [customPicFile, setCustomPicFile] = useState<File | null>(null)
  const [customPicPreview, setCustomPicPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("pixelAiUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setName(parsedUser.name || "")
        setSelectedPic(parsedUser.profilePic || DEFAULT_PROFILE_PIC)
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
        router.push("/auth/login")
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size too large. Please select an image under 5MB.")
        return
      }

      setCustomPicFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomPicPreview(reader.result as string)
        setSelectedPic("")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    if (!user) return

    setError(null)
    setSuccess(null)

    try {
      // In a real app, you would upload the image to a server
      // For this demo, we'll just use the preview URL or selected sample pic
      const profilePic = customPicPreview || selectedPic || DEFAULT_PROFILE_PIC

      // Update user in localStorage
      const updatedUser = {
        ...user,
        name: name.trim() || user.email.split("@")[0], // Use part of email as name if empty
        profilePic,
      }

      localStorage.setItem("pixelAiUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
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
              YOUR PROFILE
            </h1>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture Section */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-pixel-primary dark:text-pixel-secondary pixel-text mb-4">
                  PROFILE PICTURE
                </h2>

                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 border-4 border-pixel-primary dark:border-pixel-secondary overflow-hidden">
                    <img
                      src={customPicPreview || selectedPic || DEFAULT_PROFILE_PIC}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-pixel-dark dark:text-pixel-light pixel-text mb-2">CHOOSE FROM SAMPLES:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_PROFILE_PICS.map((pic, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedPic(pic)
                          setCustomPicPreview(null)
                          setCustomPicFile(null)
                        }}
                        className={`w-full aspect-square border-2 ${
                          selectedPic === pic
                            ? "border-pixel-primary dark:border-pixel-secondary"
                            : "border-pixel-dark/30 dark:border-pixel-light/30"
                        } overflow-hidden profile-pic-hover`}
                      >
                        <img
                          src={pic || "/placeholder.svg"}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-pixel-dark dark:text-pixel-light pixel-text mb-2">OR UPLOAD YOUR OWN:</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <PixelButton onClick={triggerFileInput} className="w-full" variant="secondary">
                    UPLOAD IMAGE
                  </PixelButton>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-pixel-primary dark:text-pixel-secondary pixel-text mb-4">
                  PROFILE INFO
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-pixel-dark dark:text-pixel-light pixel-text mb-1">
                      EMAIL (CANNOT CHANGE)
                    </label>
                    <PixelInput value={user.email} onChange={() => {}} disabled={true} />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-pixel-dark dark:text-pixel-light pixel-text mb-1">
                      DISPLAY NAME
                    </label>
                    <PixelInput
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>

                  {error && (
                    <div className="border-2 border-pixel-primary bg-pixel-primary/10 p-3 rounded-lg">
                      <p className="pixel-text text-pixel-primary text-center text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="border-2 border-green-500 bg-green-500/10 p-3 rounded-lg">
                      <p className="pixel-text text-green-500 text-center text-sm">{success}</p>
                    </div>
                  )}

                  <PixelButton onClick={handleSaveProfile} className="w-full mt-4">
                    SAVE PROFILE
                  </PixelButton>

                  <Link href="/">
                    <PixelButton variant="secondary" className="w-full">
                      BACK TO CHAT
                    </PixelButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </PixelContainer>
      </div>
    </main>
  )
}

