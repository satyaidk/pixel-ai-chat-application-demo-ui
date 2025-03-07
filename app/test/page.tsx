"use client"

import { useState, useEffect } from "react"
import { checkEnvironment } from "../actions"

export default function TestPage() {
  const [info, setInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInfo() {
      try {
        const result = await checkEnvironment()
        setInfo(result)
      } catch (err: any) {
        setError(err.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchInfo()
  }, [])

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Environment Test</h1>

      {loading && <p>Loading environment information...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      {info && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment Info</h2>
          <pre className="whitespace-pre-wrap bg-white p-2 rounded border">{JSON.stringify(info, null, 2)}</pre>
        </div>
      )}

      <div className="mt-4">
        <a href="/" className="text-blue-500 hover:underline">
          Back to Chat
        </a>
      </div>
    </div>
  )
}

