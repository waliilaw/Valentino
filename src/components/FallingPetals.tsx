'use client'

import { useEffect, useState } from 'react'

interface Petal {
  id: number
  left: number
  animationDuration: number
  delay: number
  size: number
  rotation: number
}

export function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    const createPetal = (index: number): Petal => ({
      id: index,
      left: Math.random() * 100,
      animationDuration: 8 + Math.random() * 6, // 8-14 seconds
      delay: Math.random() * -20, // Negative delay for immediate start
      size: 15 + Math.random() * 10,
      rotation: Math.random() * 360
    })

    // Initial petals
    const petalCount = 25
    const newPetals = Array.from({ length: petalCount }, (_, i) => createPetal(i))
    setPetals(newPetals)

    // Continuously add new petals
    const interval = setInterval(() => {
      setPetals(prev => [...prev.slice(-20), createPetal(Date.now())])
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-falling"
          style={{
            left: `${petal.left}%`,
            top: '-5%',
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.animationDuration}s`,
            fontSize: `${petal.size}px`,
            transform: `rotate(${petal.rotation}deg)`
          }}
        >
          <span className="text-[#FFC0CB] opacity-70">🌸</span>
        </div>
      ))}
    </div>
  )
} 