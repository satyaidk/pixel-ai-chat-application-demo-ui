export async function GET(req: Request) {
  // Return information about the environment
  return Response.json({
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    time: new Date().toISOString(),
  })
}

