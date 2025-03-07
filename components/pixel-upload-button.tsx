"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface PixelUploadButtonProps {
  onFileSelect: (file: File) => void
  acceptedFileTypes?: string
}

export default function PixelUploadButton({
  onFileSelect,
  acceptedFileTypes = "image/*,.pdf,.doc,.docx,.txt",
}: PixelUploadButtonProps) {
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      // Reset the input so the same file can be selected again
      e.target.value = ""
    }
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault()
          handleClick()
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="p-3 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface text-pixel-secondary dark:text-pixel-light hover:brightness-110 active:brightness-90 transition-all"
        aria-label="Upload file"
        type="button"
      >
        <Upload className="w-5 h-5" />
      </button>

      {isHovering && (
        <div className="absolute bottom-full left-0 mb-2 w-max bg-pixel-dark dark:bg-pixel-surface border-2 border-pixel-primary dark:border-pixel-secondary p-2 text-pixel-secondary dark:text-pixel-light pixel-text text-xs">
          Upload image or file
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={acceptedFileTypes} className="hidden" />
    </div>
  )
}

