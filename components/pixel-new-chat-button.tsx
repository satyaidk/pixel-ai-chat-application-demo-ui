"use client"

interface PixelNewChatButtonProps {
  onClick: () => void
}

export default function PixelNewChatButton({ onClick }: PixelNewChatButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex-1 sm:flex-none px-4 py-2 border-2 border-pixel-primary dark:border-pixel-secondary bg-pixel-dark dark:bg-pixel-surface text-pixel-secondary dark:text-pixel-light hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center pixel-text whitespace-nowrap"
      aria-label="New Chat"
    >
      NEW CHAT
    </button>
  )
}

