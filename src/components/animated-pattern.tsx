'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Pattern properties
    let time = 0
    const gridSize = 50
    const maxOffset = 10

    const drawPattern = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create animated grid pattern
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          // Calculate wave offset
          const waveX = Math.sin((x + time) * 0.01) * maxOffset
          const waveY = Math.cos((y + time) * 0.01) * maxOffset
          
          // Calculate opacity based on position and time
          const opacity = (Math.sin((x + y + time) * 0.005) + 1) * 0.1
          
          // Draw grid point
          ctx.beginPath()
          ctx.arc(x + waveX, y + waveY, 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`
          ctx.fill()
          
          // Draw connecting lines with varying opacity
          if (x < canvas.width - gridSize) {
            ctx.beginPath()
            ctx.moveTo(x + waveX, y + waveY)
            ctx.lineTo(x + gridSize + Math.sin((x + gridSize + time) * 0.01) * maxOffset, y + Math.cos((y + time) * 0.01) * maxOffset)
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
          
          if (y < canvas.height - gridSize) {
            ctx.beginPath()
            ctx.moveTo(x + waveX, y + waveY)
            ctx.lineTo(x + Math.sin((x + time) * 0.01) * maxOffset, y + gridSize + Math.cos((y + gridSize + time) * 0.01) * maxOffset)
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      
      time += 1
      requestAnimationFrame(drawPattern)
    }

    drawPattern()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5"
      style={{ background: 'transparent' }}
    />
  )
}