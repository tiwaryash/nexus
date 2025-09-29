"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import MainLayout from '@/components/layout/MainLayout'
import Button from '@/components/ui/Button'
import { FileText, MessageSquare, Network, Brain, Search, Globe } from 'lucide-react'

const ParticleBackground = dynamic(() => import('@/components/ui/ParticleBackground'), {
  ssr: false
})

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <MainLayout>
      <div ref={containerRef} className="relative">
        <ParticleBackground />
        
        {/* Hero Section */}
        <motion.section 
          style={{ opacity, scale }}
          className="relative min-h-screen flex flex-col items-center justify-center px-4 "
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-maroon-900 dark:from-red-500 dark:to-maroon-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Knowledge AI Platform
          </motion.h1>

          <motion.p 
            className="mt-6 text-xl md:text-2xl text-center max-w-2xl text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Transform your team's knowledge management with AI-powered insights and seamless collaboration
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              className="px-8 py-4 text-lg bg-red-800 hover:bg-red-900 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-4 text-lg border-red-800 text-red-800 hover:bg-red-50 dark:border-red-700 dark:text-red-700 dark:hover:bg-red-900/10"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <h2 className="text-4xl font-bold text-center mb-12 text-red-800 dark:text-red-500">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-xl"
                >
                  <feature.icon className="w-12 h-12 text-red-800 dark:text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
const features = [
  {
    title: "Document Processing",
    description: "Advanced AI-powered document analysis and processing with support for multiple formats.",
    icon: FileText
  },
  {
    title: "RAG-Powered Chat",
    description: "Ask questions about your documents and get intelligent, context-aware answers powered by retrieval-augmented generation.",
    icon: MessageSquare
  },
  {
    title: "Knowledge Graph",
    description: "Visual exploration of document relationships and automated topic clustering.",
    icon: Network
  },
  {
    title: "AI-Powered Analysis",
    description: "Advanced text summarization and intelligent content understanding.",
    icon: Brain
  },
  {
    title: "Semantic Search",
    description: "Intelligent search capabilities that understand context and meaning.",
    icon: Search
  },
  {
    title: "Multi-Language Support",
    description: "Process and analyze content across multiple languages.",
    icon: Globe
  }
]