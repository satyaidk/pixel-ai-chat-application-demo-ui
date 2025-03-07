import React, { forwardRef } from 'react'
import type { ChangeEvent } from "react"

interface PixelInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  type?: string
}

const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(
  ({ value, onChange, placeholder, disabled, type = "text" }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-2 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface text-pixel-secondary dark:text-pixel-light placeholder:text-pixel-secondary/50 dark:placeholder:text-pixel-light/50 disabled:opacity-50 disabled:cursor-not-allowed pixel-text"
      />
    )
  }
)

PixelInput.displayName = 'PixelInput'

export default PixelInput

