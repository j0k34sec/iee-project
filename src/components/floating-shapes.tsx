'use client'

import { useEffect, useRef } from 'react'

interface Shape {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  color: string
  type: 'circle' | 'triangle' | 'square'
}

export default function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create shapes
    const shapes: Shape[] = []
    const shapeCount = 8

    for (let i = 0; i < shapeCount; i++) {
      const shapeType = ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)] as 'circle' | 'triangle' | 'square'
      const size = Math.random() * 100 + 50
      
      shapes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: size,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? 'from-purple-600/10 to-blue-600/10' : 'from-blue-600/10 to-purple-600/10',
        type: shapeType
      })
    }

    // Create shape elements
    const shapeElements: HTMLDivElement[] = []
    shapes.forEach((shape, index) => {
      const element = document.createElement('div')
      element.className = 'absolute pointer-events-none transition-all duration-1000 ease-in-out'
      element.style.width = `${shape.size}px`
      element.style.height = `${shape.size}px`
      element.style.background = `linear-gradient(135deg, ${shape.color})`
      element.style.borderRadius = shape.type === 'circle' ? '50%' : shape.type === 'triangle' ? '0' : '10%'
      element.style.filter = 'blur(20px)'
      element.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotation}deg)`
      
      if (shape.type === 'triangle') {
        element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'
      }
      
      container.appendChild(element)
      shapeElements.push(element)
    })

    // Animation loop
    let animationId: number
    const animate = () => {
      shapes.forEach((shape, index) => {
        // Update position
        shape.x += shape.speedX
        shape.y += shape.speedY
        shape.rotation += shape.rotationSpeed

        // Wrap around screen
        if (shape.x < -shape.size) shape.x = window.innerWidth + shape.size
        if (shape.x > window.innerWidth + shape.size) shape.x = -shape.size
        if (shape.y < -shape.size) shape.y = window.innerHeight + shape.size
        if (shape.y > window.innerHeight + shape.size) shape.y = -shape.size

        // Update element
        const element = shapeElements[index]
        if (element) {
          element.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotation}deg)`
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      shapeElements.forEach(element => element.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ background: 'transparent' }}
    />
  )
}