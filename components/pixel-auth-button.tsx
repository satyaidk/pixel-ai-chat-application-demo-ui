interface PixelAuthButtonProps {
  onClick: () => void
  isLoggedIn: boolean
}

export default function PixelAuthButton({ onClick, isLoggedIn }: PixelAuthButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 border-2 border-[#0f380f] dark:border-[#9bbc0f] bg-[#306850] dark:bg-[#8bac0f] text-[#9bbc0f] dark:text-[#0f380f] pixel-text text-sm hover:brightness-110 active:brightness-90 transition-all"
    >
      {isLoggedIn ? "PROFILE" : "LOGIN"}
    </button>
  )
}

