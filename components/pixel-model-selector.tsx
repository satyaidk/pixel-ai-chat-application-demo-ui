"use client"

import { useState } from "react"

interface Model {
  id: string
  name: string
  description: string
}

interface PixelModelSelectorProps {
  onModelChange: (modelId: string) => void
  currentModel: string
}

export default function PixelModelSelector({ onModelChange, currentModel }: PixelModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const models: Model[] = [
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      description: "Balanced model",
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5",
      description: "Fast responses",
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 border-2 border-pixel-dark dark:border-pixel-light bg-pixel-surface dark:bg-pixel-dark text-pixel-dark dark:text-pixel-light pixel-text text-sm"
      >
        <span>MODEL: {models.find((m) => m.id === currentModel)?.name || currentModel}</span>
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border-2 border-pixel-dark dark:border-pixel-light bg-pixel-surface dark:bg-pixel-dark shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model.id)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-2 text-left hover:bg-pixel-primary/20 dark:hover:bg-pixel-secondary/20 pixel-text text-sm ${
                currentModel === model.id ? "bg-pixel-primary/20 dark:bg-pixel-secondary/20" : ""
              }`}
            >
              <div className="text-pixel-dark dark:text-pixel-light">{model.name}</div>
              <div className="text-xs text-pixel-dark/70 dark:text-pixel-light/70">{model.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

