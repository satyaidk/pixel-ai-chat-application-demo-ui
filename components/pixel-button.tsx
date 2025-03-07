import type { ButtonHTMLAttributes } from "react"

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
}

export default function PixelButton({ children, variant = "primary", className = "", ...props }: PixelButtonProps) {
  return (
    <button
      className={`
        px-4 py-2 border-2 
        ${
          variant === "primary"
            ? "border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface text-pixel-secondary dark:text-pixel-light"
            : "border-pixel-dark dark:border-pixel-light bg-transparent text-pixel-dark dark:text-pixel-light"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:brightness-110 active:brightness-90
        transition-all pixel-text
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

