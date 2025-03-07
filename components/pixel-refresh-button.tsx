import { RefreshCw } from "lucide-react"

interface PixelRefreshButtonProps {
  onClick: () => void
}

export default function PixelRefreshButton({ onClick }: PixelRefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center p-2 border-2 border-[#0f380f] dark:border-[#9bbc0f] bg-[#306850] dark:bg-[#8bac0f] text-[#9bbc0f] dark:text-[#0f380f] hover:brightness-110 active:brightness-90 transition-all"
      aria-label="Start new chat"
    >
      <RefreshCw className="w-5 h-5" />
    </button>
  )
}

