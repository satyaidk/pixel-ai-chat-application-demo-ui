import type { ReactNode } from "react"

interface PixelContainerProps {
  children: ReactNode
}

export default function PixelContainer({ children }: PixelContainerProps) {
  return (
    <div className="flex-1 flex flex-col w-full mx-auto border-4 border-pixel-primary dark:border-pixel-secondary bg-pixel-surface dark:bg-pixel-dark shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
      {children}
    </div>
  )
}

