"use server"

import OpenAI from "openai"

// Define message type for TypeScript
interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export async function generateAIResponse(messages: Message[], model = "gpt-4o-mini") {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY

    // Log for debugging (will only appear in server logs)
    console.log("API Key exists:", !!apiKey)
    if (apiKey) {
      console.log("API Key length:", apiKey.length)
      console.log("API Key first 5 chars:", apiKey.substring(0, 5))
    }

    // Check if OpenAI API key is set
    if (!apiKey) {
      console.error("OpenAI API key is missing in environment variables")
      return {
        success: false,
        error: "OpenAI API key is not configured. Please add it to your .env.local file.",
      }
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Add a system message if none exists
    if (!messages.some((m) => m.role === "system")) {
      messages.unshift({
        role: "system",
        content:
          "You are a helpful assistant in a pixel art themed chat interface. Provide concise, friendly responses.",
      })
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Return the response
    return {
      success: true,
      content: completion.choices[0].message.content || "No response generated.",
    }
  } catch (error: any) {
    console.error("Error in generateAIResponse:", error)

    // Handle API key errors specifically
    if (error.message && error.message.includes("API key")) {
      return {
        success: false,
        error: "Invalid OpenAI API key. Please check your .env.local file and ensure the key is correct.",
      }
    }

    // Handle specific OpenAI errors
    if (error.code === "model_not_found") {
      return {
        success: false,
        error: `Model "${model}" not found. Falling back to gpt-3.5-turbo.`,
        fallback: true,
      }
    }

    return {
      success: false,
      error: error.message || "An error occurred while generating a response.",
    }
  }
}

// Add a function to check if the API key is configured
export async function checkApiKey() {
  const apiKey = process.env.OPENAI_API_KEY
  return {
    configured: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyPrefix: apiKey ? apiKey.substring(0, 5) : "",
  }
}

// Add this function at the end of the file

export async function checkEnvironment() {
  return {
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    time: new Date().toISOString(),
  }
}

