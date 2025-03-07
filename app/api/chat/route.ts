import OpenAI from "openai"


// Use the default Node.js runtime
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Log that we're entering the API route
    console.log("API route called")

    // Validate the API key is present
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set")
      return Response.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Parse the request body
    const body = await req.json()
    const { messages, model = "gpt-3.5-turbo" } = body

    console.log(`Using model: ${model}`)
    console.log(`Number of messages: ${messages.length}`)

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid or empty messages array")
      return Response.json({ error: "Messages are required" }, { status: 400 })
    }

    // Format messages for OpenAI
    const formattedMessages = messages.map((message: any) => ({
      content: message.content,
      role: message.role,
    }))

    // Create the completion (non-streaming)
    const completion = await openai.chat.completions.create({
      model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false, // Explicitly set to false
    })

    // Return the response
    return Response.json({
      role: "assistant",
      content: completion.choices[0].message.content,
    })
  } catch (error: any) {
    // Log the detailed error
    console.error("Error in chat API:", error)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)

    // Return a proper error response
    return Response.json(
      {
        error: "An error occurred while processing your request",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

