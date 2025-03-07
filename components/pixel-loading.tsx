export default function PixelLoading() {
  return (
    <div className="flex justify-center items-center py-2">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-pixel-primary dark:bg-pixel-secondary animate-pulse"
            style={{
              animationDelay: `${i * 0.15}s`,
              imageRendering: "pixelated",
            }}
          />
        ))}
      </div>
    </div>
  )
}

