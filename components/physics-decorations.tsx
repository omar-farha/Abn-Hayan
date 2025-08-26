"use client"

import { useEffect, useState } from "react"

export function PhysicsParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="physics-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="physics-particle animate-particle-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function AtomicStructure() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="physics-nucleus absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="physics-electron animate-electron-orbit" style={{ animationDelay: "0s" }} />
      <div
        className="physics-electron animate-electron-orbit"
        style={{ animationDelay: "1s", transform: "rotate(60deg)" }}
      />
      <div
        className="physics-electron animate-electron-orbit"
        style={{ animationDelay: "2s", transform: "rotate(120deg)" }}
      />
    </div>
  )
}

export function WaveAnimation() {
  return (
    <div className="relative w-full h-20 overflow-hidden">
      <div className="physics-wave-bg animate-wave-motion" />
      <div className="physics-wave-bg animate-wave-motion" style={{ animationDelay: "2s", opacity: 0.5 }} />
    </div>
  )
}

export function ElectromagneticField() {
  return (
    <div className="relative w-full h-40">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="physics-field-lines animate-field-pulse"
          style={{
            top: `${i * 12}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

export function PendulumMotion() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="physics-pendulum animate-pendulum-swing absolute top-0 left-1/2 transform -translate-x-1/2" />
    </div>
  )
}
