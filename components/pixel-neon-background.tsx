export default function PixelNeonBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-pixel-background dark:bg-pixel-dark">
        {/* Horizontal lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px w-full bg-pixel-secondary/20 dark:bg-pixel-light/20"
            style={{
              top: `${i * 5 + 2.5}%`,
              animation: `neonPulse 3s infinite alternate ${i * 0.1}s`
            }}
          />
        ))}

        {/* Vertical lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px h-full bg-pixel-primary/20 dark:bg-pixel-accent/20"
            style={{
              left: `${i * 5 + 2.5}%`,
              animation: `neonPulse 4s infinite alternate ${i * 0.15}s`
            }}
          />
        ))}

        {/* Random pixels */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute w-2 h-2 bg-pixel-highlight dark:bg-pixel-accent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.5,
              animation: `pixelFade 4s infinite alternate ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

