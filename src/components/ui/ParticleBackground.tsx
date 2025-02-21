'use client'

import { useCallback } from "react"
import { loadSlim } from "tsparticles-slim"
import Particles from "react-particles"
import { useTheme } from 'next-themes'
import type { Container, Engine } from "tsparticles-engine"

export default function ParticleBackground() {
  console.log("ParticleBackground component rendered")
  const { theme } = useTheme()
  
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log("Initializing particles")
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Particles loaded", container)
  }, [])

  return (
    <Particles
      className="absolute inset-0"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          enable: false,
          zIndex: 0
        },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: theme === 'dark' ? "#ff4444" : "#800000",
          },
          links: {
            color: theme === 'dark' ? "#ff4444" : "#800000",
            distance: 150,
            enable: true,
            opacity: theme === 'dark' ? 0.5 : 0.3,
            width: theme === 'dark' ? 1.5 : 1,
          },
          move: {
            enable: true,
            direction: "none",
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1.2,
            straight: false,
          },
          opacity: {
            value: theme === 'dark' ? 0.7 : 0.4,
          },
          size: {
            value: { min: 1, max: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  )
} 