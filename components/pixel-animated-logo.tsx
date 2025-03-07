"use client"

import { useEffect, useRef } from "react"

interface PixelAnimatedLogoProps {
  size?: number
}

export default function PixelAnimatedLogo({ size = 40 }: PixelAnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set actual size in memory (scaled to account for extra pixel density)
    const scale = window.devicePixelRatio
    canvas.width = size * scale
    canvas.height = size * scale

    // Normalize coordinate system to use CSS pixels
    ctx.scale(scale, scale)

    let frame = 0
    let animationFrameId: number

    const render = () => {
      frame++

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Draw circle background
      ctx.fillStyle = "#261447" // Dark purple background
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw "AI" text
      ctx.fillStyle = "#FF3864" // Pink for "A"

      // Draw "A" (pixel art style)
      const aOffset = Math.sin(frame / 10) * 2
      drawPixelA(ctx, size / 2 - 10, size / 2 - 5 + aOffset, 3)

      // Draw "I" (pixel art style)
      ctx.fillStyle = "#2DE2E6" // Cyan for "I"
      const iOffset = Math.cos(frame / 10) * 2
      drawPixelI(ctx, size / 2 + 5, size / 2 - 5 + iOffset, 3)

      // Draw pulsing border
      const pulseSize = 1 + Math.sin(frame / 15) * 0.5
      ctx.strokeStyle = "#F6F740" // Yellow border
      ctx.lineWidth = 2 * pulseSize
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2)
      ctx.stroke()

      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [size])

  // Helper function to draw pixel art "A"
  const drawPixelA = (ctx: CanvasRenderingContext2D, x: number, y: number, pixelSize: number) => {
    // Top horizontal line
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + i * pixelSize, y, pixelSize, pixelSize)
    }

    // Left vertical line
    for (let i = 1; i < 5; i++) {
      ctx.fillRect(x, y + i * pixelSize, pixelSize, pixelSize)
    }

    // Right vertical line
    for (let i = 1; i < 5; i++) {
      ctx.fillRect(x + 2 * pixelSize, y + i * pixelSize, pixelSize, pixelSize)
    }

    // Middle horizontal line
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + i * pixelSize, y + 2 * pixelSize, pixelSize, pixelSize)
    }
  }

  // Helper function to draw pixel art "I"
  const drawPixelI = (ctx: CanvasRenderingContext2D, x: number, y: number, pixelSize: number) => {
    // Top horizontal line
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + i * pixelSize, y, pixelSize, pixelSize)
    }

    // Middle vertical line
    for (let i = 1; i < 4; i++) {
      ctx.fillRect(x + pixelSize, y + i * pixelSize, pixelSize, pixelSize)
    }

    // Bottom horizontal line
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + i * pixelSize, y + 4 * pixelSize, pixelSize, pixelSize)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="pixel-art"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}

