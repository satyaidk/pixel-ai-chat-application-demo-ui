interface PixelMessageProps {
  role: "user" | "assistant" | "system"
  content: string
}

export default function PixelMessage({ role, content }: PixelMessageProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[80%] p-3 border-2 
          ${
            role === "user"
              ? "border-pixel-primary dark:border-pixel-accent bg-pixel-primary/10 dark:bg-pixel-accent/10"
              : "border-pixel-secondary dark:border-pixel-secondary bg-pixel-secondary/10 dark:bg-pixel-secondary/10"
          }
          ${role === "user" ? "rounded-tl-lg rounded-bl-lg rounded-tr-lg" : "rounded-tr-lg rounded-br-lg rounded-tl-lg"}
        `}
      >
        <p
          className={`
          whitespace-pre-wrap break-words pixel-text text-sm
          ${role === "user" ? "text-pixel-dark dark:text-pixel-light" : "text-pixel-dark dark:text-pixel-light"}
        `}
        >
          {content}
        </p>
      </div>
    </div>
  )
}

