interface PixelHeaderProps {
  onThemeToggle: () => void
  theme: "light" | "dark"
}

export default function PixelHeader({ onThemeToggle, theme }: PixelHeaderProps) {
  return (
    <header className="border-b-4 border-[#306850] dark:border-[#8bac0f] bg-[#9bbc0f] dark:bg-[#306850] p-4 max-w-3xl mx-auto w-full mt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#0f380f] dark:text-[#8bac0f] pixel-text">PIXEL AI</h1>
        <button
          onClick={onThemeToggle}
          className="px-3 py-1 border-2 border-[#0f380f] dark:border-[#8bac0f] text-[#0f380f] dark:text-[#8bac0f] pixel-text text-sm"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "NIGHT 🌚 " : "DAY 🌞 "}
        </button>
      </div>
    </header>
  )
}

