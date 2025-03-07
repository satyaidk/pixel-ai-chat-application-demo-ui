"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { generateAIResponse, checkApiKey } from "./actions"
import PixelContainer from "@/components/pixel-container"
import PixelInput from "@/components/pixel-input"
import PixelMessage from "@/components/pixel-message"
import PixelLoading from "@/components/pixel-loading"
import PixelModelSelector from "@/components/pixel-model-selector"
import PixelNewChatButton from "@/components/pixel-new-chat-button"
import PixelUploadButton from "@/components/pixel-upload-button"
import PixelMenu from "@/components/pixel-menu"
import PixelNeonBackground from "@/components/pixel-neon-background"
import PixelAnimatedLogo from "@/components/pixel-animated-logo"
import Link from "next/link"
import { registerServiceWorker } from "./pwa"

// Define message type
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  attachmentUrl?: string | null
  attachmentType?: string | null
}

interface ChatSession {
  id: string
  title: string
  date: string
  messages: Message[]
}

interface User {
  id: string
  email: string
  name?: string
  profilePic?: string
}

// Add this hook at the top of the file
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
    // Register service worker when component mounts
    registerServiceWorker()
  }, [])
  return hasMounted
}

export default function Home() {
  const hasMounted = useHasMounted()
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [model, setModel] = useState("gpt-4o-mini")
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<{ configured: boolean; message: string } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add this near the top with other refs
  const inputRef = useRef<HTMLInputElement>(null)

  // Add this effect to handle input focus
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  // Check API key on load
  useEffect(() => {
    const checkKey = async () => {
      try {
        const result = await checkApiKey()
        if (result.configured) {
          setApiKeyStatus({
            configured: true,
            message: `API key configured (${result.keyPrefix}...)`,
          })
        } else {
          setApiKeyStatus({
            configured: false,
            message: "API key not configured. Please add it to your .env.local file.",
          })
          setError("OpenAI API key is not configured. Please add it to your .env.local file.")
        }
      } catch (err) {
        console.error("Failed to check API key:", err)
        setApiKeyStatus({
          configured: false,
          message: "Failed to check API key status.",
        })
      }
    }

    checkKey()

    // Get theme from localStorage or default to dark
    const storedTheme = localStorage.getItem("pixelAiTheme") || "dark"
    setTheme(storedTheme as "light" | "dark")

    // Apply theme to document
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("pixelAiUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
      }
    }
  }, [])

  // Load chat history from localStorage
  useEffect(() => {
    if (user) {
      const storedHistory = localStorage.getItem(`pixelAiChatHistory_${user.id}`)
      if (storedHistory) {
        try {
          setChatHistory(JSON.parse(storedHistory))
        } catch (err) {
          console.error("Failed to parse chat history from localStorage:", err)
        }
      }
    }
  }, [user])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

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
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // Generate a unique ID
  const generateId = () => {
    return 'id-' + Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file)

    // Create a preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // For non-image files, just show the file name
      setFilePreview(null)
    }
  }

  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if ((!input.trim() && !selectedFile) || isLoading) return

    // Clear previous errors
    setError(null)

    // Create content with file info if present
    let content = input.trim()
    let attachmentUrl = null
    let attachmentType = null

    if (selectedFile) {
      // In a real app, you would upload the file to a server and get a URL
      // For this demo, we'll just use the file name and type
      attachmentUrl = filePreview || "file://local-file"
      attachmentType = selectedFile.type

      if (!content) {
        // If no text input, create a default message about the file
        content = `Analyzing file: ${selectedFile.name}`
      }
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      attachmentUrl,
      attachmentType,
    }

    // Create a new chat if there isn't one
    if (!currentChatId) {
      const newChatId = generateId()
      setCurrentChatId(newChatId)

      // Add to chat history
      const newChat: ChatSession = {
        id: newChatId,
        title: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
        date: new Date().toISOString(),
        messages: [userMessage],
      }

      setChatHistory((prev) => [newChat, ...prev])

      // Save to localStorage if user is logged in
      if (user) {
        localStorage.setItem(`pixelAiChatHistory_${user.id}`, JSON.stringify([newChat, ...chatHistory]))
      }
    } else {
      // Update existing chat
      const updatedHistory = chatHistory.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
          }
        }
        return chat
      })

      setChatHistory(updatedHistory)

      // Save to localStorage if user is logged in
      if (user) {
        localStorage.setItem(`pixelAiChatHistory_${user.id}`, JSON.stringify(updatedHistory))
      }
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSelectedFile(null)
    setFilePreview(null)
    setIsLoading(true)

    try {
      // Format messages for OpenAI (without the id field and attachment info)
      const formattedMessages = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content,
      }))

      // Add file context if there's an attachment
      if (attachmentUrl) {
        formattedMessages.push({
          role: "system",
          content: `The user has uploaded a file of type: ${attachmentType}. Please provide analysis or response based on this context.`,
        })
      }

      // Call server action
      const result = await generateAIResponse(formattedMessages, model)

      if (!result.success) {
        // If there's a fallback suggestion, try with the fallback model
        if (result.fallback) {
          setModel("gpt-3.5-turbo")
          const fallbackResult = await generateAIResponse(formattedMessages, "gpt-3.5-turbo")

          if (!fallbackResult.success) {
            throw new Error(fallbackResult.error || "Failed to generate response with fallback model")
          }

          // Add assistant message from fallback
          const assistantMessage: Message = {
            id: generateId(),
            role: "assistant",
            content: (fallbackResult.content || "") as string,
          }

          setMessages((prev) => [...prev, assistantMessage])

          // Update chat history
          updateChatHistoryWithAssistantMessage(assistantMessage)

          return
        }

        throw new Error(result.error || "Failed to generate response")
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: (result.content || "") as string,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update chat history
      updateChatHistoryWithAssistantMessage(assistantMessage)
    } catch (err: any) {
      console.error("Error sending message:", err)
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
      // Focus the input after sending
      inputRef.current?.focus()
    }
  }

  // Helper function to update chat history with assistant message
  const updateChatHistoryWithAssistantMessage = (assistantMessage: Message) => {
    if (currentChatId) {
      const updatedHistory = chatHistory.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, assistantMessage],
          }
        }
        return chat
      })

      setChatHistory(updatedHistory)

      // Save to localStorage if user is logged in
      if (user) {
        localStorage.setItem(`pixelAiChatHistory_${user.id}`, JSON.stringify(updatedHistory))
      }
    }
  }

  // Handle new chat
  const handleNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
    setError(null)
    setSelectedFile(null)
    setFilePreview(null)
  }

  // Handle auth button click
  const handleAuthClick = () => {
    if (user) {
      // Go to profile page
      router.push("/profile")
    } else {
      // Go to login page
      router.push("/auth/login")
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("pixelAiUser")
    setUser(null)
    setChatHistory([])
    setMessages([])
    setCurrentChatId(null)
  }

  // Modify the return statement to handle pre-mount state
  if (!hasMounted) {
    return null // or a loading spinner
  }

  return (
    <main className={`min-h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <PixelNeonBackground />

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b-4 border-pixel-primary dark:border-pixel-secondary bg-pixel-surface dark:bg-pixel-dark p-4">
        <div className="flex justify-between items-center max-w-[2000px] mx-auto">
          <div className="flex items-center space-x-2">
            <PixelAnimatedLogo size={40} />
            <h1 className="text-xl font-bold text-pixel-primary dark:text-pixel-secondary pixel-text">AI CHAT</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-1 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface text-pixel-secondary dark:text-pixel-light pixel-text text-sm"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "NIGHT 🌚 " : "DAY 🌞 "}
            </button>

            {user && (
              <Link href="/profile" className="flex items-center">
                <div className="w-10 h-10 border-2 border-pixel-primary dark:border-pixel-secondary overflow-hidden">
                  <img
                    src={user.profilePic || "/profile-pics/default.jpg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            )}

            <PixelMenu isLoggedIn={!!user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-[84px]">
        <div className="flex-1 flex flex-col max-w-[2000px] mx-auto w-full px-4 py-4 h-[calc(100vh-84px)]">
          <PixelContainer>
            {/* Model Selector - Keep sticky */}
            <div className="sticky top-0 z-20 p-4 border-b-4 border-pixel-primary dark:border-pixel-secondary bg-pixel-surface dark:bg-pixel-dark">
              <PixelModelSelector onModelChange={setModel} currentModel={model} />
            </div>

            {/* Messages Container - Make it scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col space-y-4 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="pixel-art mb-4 w-16 h-16 bg-pixel-primary dark:bg-pixel-secondary"></div>
                    <p className="pixel-text text-pixel-dark dark:text-pixel-light">WELCOME TO PIXEL AI</p>
                    <p className="pixel-text text-pixel-dark dark:text-pixel-light text-sm mt-2">❤️</p>
                    {user && (
                      <p className="pixel-text text-pixel-dark dark:text-pixel-light text-xs mt-4">
                        LOGGED IN AS: {user.name || user.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div key={message.id}>
                        {/* Render attachment if present */}
                        {message.attachmentUrl && message.attachmentType?.startsWith("image/") && (
                          <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                            <div className="max-w-xs border-2 border-pixel-primary dark:border-pixel-secondary overflow-hidden">
                              <img
                                src={message.attachmentUrl || "/placeholder.svg"}
                                alt="Attachment"
                                className="max-w-full h-auto"
                              />
                            </div>
                          </div>
                        )}

                        {/* Render file info for non-image attachments */}
                        {message.attachmentUrl && !message.attachmentType?.startsWith("image/") && (
                          <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                            <div className="max-w-xs p-2 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-primary/10 dark:bg-pixel-secondary/10">
                              <p className="pixel-text text-sm text-pixel-dark dark:text-pixel-light">
                                File: {selectedFile?.name || "Attached file"}
                              </p>
                            </div>
                          </div>
                        )}

                        <PixelMessage role={message.role} content={message.content} />
                      </div>
                    ))}
                  </>
                )}
                {isLoading && <PixelLoading />}
                {error && (
                  <div className="border-2 border-pixel-primary bg-pixel-primary/10 p-3 rounded-lg">
                    <p className="pixel-text text-pixel-primary text-center text-sm">{error}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Keep sticky at bottom */}
            <div className="sticky bottom-0 z-20 bg-pixel-surface dark:bg-pixel-dark border-t-4 border-pixel-primary dark:border-pixel-secondary">
              {filePreview && (
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="pixel-text text-sm text-pixel-dark dark:text-pixel-light">
                      Selected file: {selectedFile?.name}
                    </p>
                    <button
                      onClick={clearSelectedFile}
                      className="text-pixel-primary dark:text-pixel-secondary hover:underline pixel-text text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  {selectedFile?.type.startsWith("image/") && (
                    <div className="mt-2 max-h-32 overflow-hidden">
                      <img src={filePreview} alt="Preview" className="max-w-full h-auto" />
                    </div>
                  )}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit(e)
                }}
                className="p-4"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-1 gap-2">
                    <PixelUploadButton onFileSelect={handleFileSelect} />
                    <PixelInput
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type your message..."
                      disabled={isLoading || !apiKeyStatus?.configured}
                    />
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      type="submit"
                      disabled={isLoading || (!input.trim() && !selectedFile) || !apiKeyStatus?.configured}
                      className="flex-1 sm:flex-none px-4 py-2 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface text-pixel-secondary dark:text-pixel-light disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:brightness-90 transition-all pixel-text whitespace-nowrap"
                    >
                      {isLoading ? "..." : "SEND"}
                    </button>
                    <PixelNewChatButton onClick={handleNewChat} />
                  </div>
                </div>
              </form>
            </div>
          </PixelContainer>
        </div>
      </div>
    </main>
  )
}

