'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Team {
  id: string
  name: string
  projectTitle: string
  status: 'pending' | 'under-review' | 'approved' | 'rejected'
  submittedAt: string
  members: number
}

interface ShortlistedCandidatesProps {
  teams?: Team[]
}

export default function ShortlistedCandidates({ teams = [] }: ShortlistedCandidatesProps) {
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'submittedAt'>('name')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter teams based on search term
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const displayTeams = filteredTeams

  const getStatusColor = (status: Team['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600 hover:bg-green-700'
      case 'under-review':
        return 'bg-yellow-600 hover:bg-yellow-700'
      case 'rejected':
        return 'bg-red-600 hover:bg-red-700'
      case 'pending':
        return 'bg-gray-600 hover:bg-gray-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const getStatusIcon = (status: Team['status']) => {
    switch (status) {
      case 'approved':
        return '✅'
      case 'under-review':
        return '🔍'
      case 'rejected':
        return '❌'
      case 'pending':
        return '⏳'
      default:
        return '⏳'
    }
  }

  const sortedTeams = [...displayTeams].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'submittedAt':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      default:
        return 0
    }
  })

  const statusCounts = displayTeams.reduce((acc, team) => {
    acc[team.status] = (acc[team.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-black/30 backdrop-blur-sm border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            🌠 Shortlisted Candidates
            <Badge variant="outline" className="ml-auto border-purple-500/50 text-purple-300">
              {displayTeams.length} Teams
            </Badge>
          </CardTitle>
          
          {/* Search Input */}
          <div className="mt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search team names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border-purple-500/30 text-white placeholder-purple-400/70 focus:border-purple-400/50 focus:ring-purple-500/20 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                🔍
              </div>
            </div>
            {searchTerm && (
              <div className="mt-2 text-xs text-purple-400">
                Showing {displayTeams.length} of {teams.length} teams matching "{searchTerm}"
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Card key={status} className="bg-black/40 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{getStatusIcon(status as Team['status'])}</div>
                  <div className="text-lg font-semibold text-purple-200">{count}</div>
                  <div className="text-xs text-purple-400 capitalize">{status.replace('-', ' ')}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sorting Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-purple-300">Sort by:</span>
              <div className="flex bg-black/40 rounded-lg p-1 border border-purple-500/20">
                {(['name', 'status', 'submittedAt'] as const).map((sortOption) => (
                  <button
                    key={sortOption}
                    onClick={() => setSortBy(sortOption)}
                    className={`
                      relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                      ${sortBy === sortOption 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                        : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
                      }
                    `}
                  >
                    {sortBy === sortOption && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md blur-sm"></div>
                    )}
                    <span className="relative z-10">
                      {sortOption === 'name' ? 'Team Name' : 
                       sortOption === 'status' ? 'Status' : 'Submission Date'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Active Sort Indicator */}
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              Currently sorted by: {
                sortBy === 'name' ? 'Team Name' : 
                sortBy === 'status' ? 'Status' : 'Submission Date'
              }
            </div>
          </div>

          {/* Teams Table */}
          <div className="bg-black/40 rounded-lg border border-purple-500/30 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-purple-900/20 border-b border-purple-500/30 font-semibold text-purple-300 text-sm">
              <div className="md:col-span-3">Team Name</div>
              <div className="md:col-span-4">Project Title</div>
              <div className="md:col-span-2">Status</div>
              <div className="md:col-span-2">Members</div>
              <div className="md:col-span-1">Submitted</div>
            </div>
            
            <div 
              className="divide-y divide-purple-500/20 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-purple-500/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-purple-500/50"
              style={{ scrollbarGutter: 'stable' }}>
              {sortedTeams.map((team) => (
                <div key={team.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-purple-900/20 transition-colors">
                  <div className="md:col-span-3">
                    <div className="font-medium text-purple-200">{team.name}</div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-purple-300 text-sm">{team.projectTitle}</div>
                  </div>
                  <div className="md:col-span-2">
                    <Badge className={getStatusColor(team.status)}>
                      {getStatusIcon(team.status)} {team.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-purple-300 text-sm">
                      👥 {team.members} member{team.members !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-purple-300 text-xs">
                      {new Date(team.submittedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-update Notice */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-xs text-purple-400 bg-purple-900/20 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Auto-updated after each evaluation phase
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}