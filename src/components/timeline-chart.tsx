'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Check, RefreshCw, Clock } from 'lucide-react'

interface TimelinePhase {
  phase: string
  description: string
  status: 'upcoming' | 'current' | 'completed'
  progress: number
}

interface TimelineChartProps {
  phases: TimelinePhase[]
}

export default function TimelineChart({ phases }: TimelineChartProps) {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null)

  const getStatusColor = (status: TimelinePhase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'current':
        return 'bg-purple-500'
      case 'upcoming':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: TimelinePhase['status']) => {
    switch (status) {
      case 'completed':
        return (
          <div className="relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 border border-green-500/30">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span className="font-semibold">Completed</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )
      case 'current':
        return (
          <div className="relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 border border-purple-500/30 animate-pulse">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="font-semibold">In Progress</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )
      case 'upcoming':
        return (
          <div className="relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-600 to-slate-600 text-white/80 shadow-md hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 border border-gray-500/30 hover:border-gray-400/50">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Upcoming</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-full blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )
      default:
        return (
          <div className="relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-gray-600 to-slate-600 text-white/80 shadow-md hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 border border-gray-500/30 hover:border-gray-400/50">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">Upcoming</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-full blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Interactive Timeline Visualization */}
      <Card className="bg-black/30 backdrop-blur-sm border-purple-500/30 p-6 mb-8">
        <CardContent className="p-0">
          <h3 className="text-xl font-semibold text-purple-300 mb-6 text-center flex items-center justify-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Interactive Timeline
          </h3>
          
          {/* Phase Circles and Connections */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-8 left-8 right-8 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-gray-600 rounded-full"></div>
            
            <div className="relative flex justify-between">
              {phases.map((phase, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Phase Circle */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 cursor-pointer transition-all duration-300 hover:scale-110 border-2 ${
                      hoveredPhase === index ? 'border-purple-300 scale-110' : 'border-transparent'
                    } ${getStatusColor(phase.status)}`}
                    onMouseEnter={() => setHoveredPhase(index)}
                    onMouseLeave={() => setHoveredPhase(null)}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Phase Label */}
                  <div className="text-center max-w-[120px]">
                    <div className="text-sm font-semibold text-purple-200 mb-1">
                      {phase.phase.split(' ')[0]}
                    </div>
                    {getStatusBadge(phase.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hover Details */}
          {hoveredPhase !== null && (
            <Card className="mt-6 bg-purple-900/20 border-purple-500/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-purple-200">
                    Phase {hoveredPhase + 1}: {phases[hoveredPhase].phase}
                  </h4>
                  {getStatusBadge(phases[hoveredPhase].status)}
                </div>
                <p className="text-sm text-purple-300">
                  {phases[hoveredPhase].description}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}