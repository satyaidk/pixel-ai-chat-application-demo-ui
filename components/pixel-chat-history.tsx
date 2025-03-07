"use client"

import { useState } from "react"

interface ChatSession {
  id: string
  title: string
  date: string
  messages: Array<{
    id: string
    role: "user" | "assistant" | "system"
    content: string
  }>
}

interface PixelChatHistoryProps {
  chatHistory: ChatSession[]
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export default function PixelChatHistory({ chatHistory, onSelectChat, onDeleteChat }: PixelChatHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (chatHistory.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 border-2 border-[#306850] dark:border-[#8bac0f] bg-[#9bbc0f] dark:bg-[#306850] text-[#0f380f] dark:text-[#8bac0f] pixel-text text-sm mt-2"
      >
        <span>PREVIOUS CHATS</span>
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border-2 border-[#306850] dark:border-[#8bac0f] bg-[#9bbc0f] dark:bg-[#306850] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] max-h-60 overflow-y-auto">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="border-b border-[#306850] dark:border-[#8bac0f] last:border-b-0 p-2">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    onSelectChat(chat.id)
                    setIsOpen(false)
                  }}
                  className="text-left pixel-text text-sm text-[#0f380f] dark:text-[#8bac0f] hover:underline"
                >
                  {chat.title}
                </button>
                <button
                  onClick={() => onDeleteChat(chat.id)}
                  className="text-[#0f380f] dark:text-[#8bac0f] hover:text-red-600 dark:hover:text-red-400 pixel-text text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-[#306850] dark:text-[#9bbc0f] pixel-text">{chat.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

