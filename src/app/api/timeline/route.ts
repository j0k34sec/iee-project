import { NextRequest, NextResponse } from 'next/server'

// Timeline phases storage - in a real app, this would be in a database
let timelinePhases = [
  { 
    phase: 'Registration', 
    description: 'Teams register via the official portal.',
    status: 'upcoming' as const,
    progress: 0
  },
  { 
    phase: 'Idea Submission', 
    description: 'Upload your project brief or pitch deck.',
    status: 'upcoming' as const,
    progress: 0
  },
  { 
    phase: 'Hack Submission', 
    description: 'Submit your working demo/prototype + presentation.',
    status: 'upcoming' as const,
    progress: 0
  },
  { 
    phase: 'Review & Judging', 
    description: 'Judges review entries via a structured digital scorecard.',
    status: 'upcoming' as const,
    progress: 0
  },
  { 
    phase: 'Results Announcement', 
    description: 'Scores & feedback published, winners announced online.',
    status: 'upcoming' as const,
    progress: 0
  }
]

// Admin credentials
const ADMIN_USERNAME = 'innoquest'
const ADMIN_PASSWORD = 'innoquest2025'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      phases: timelinePhases
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch timeline' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password, phaseIndex, status, progress } = body

    // Authenticate admin
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (action === 'updatePhase') {
      if (phaseIndex === undefined || phaseIndex < 0 || phaseIndex >= timelinePhases.length) {
        return NextResponse.json(
          { success: false, message: 'Invalid phase index' },
          { status: 400 }
        )
      }

      // Update phase
      if (status !== undefined) {
        timelinePhases[phaseIndex].status = status
      }
      if (progress !== undefined) {
        timelinePhases[phaseIndex].progress = Math.max(0, Math.min(100, progress))
      }

      // Auto-advance logic: if a phase is marked as completed, set the next phase to current
      if (status === 'completed' && phaseIndex < timelinePhases.length - 1) {
        const nextPhase = timelinePhases[phaseIndex + 1]
        if (nextPhase.status === 'upcoming') {
          nextPhase.status = 'current'
        }
      }

      // If a phase is set to current, set all previous phases to completed
      if (status === 'current') {
        for (let i = 0; i < phaseIndex; i++) {
          if (timelinePhases[i].status !== 'completed') {
            timelinePhases[i].status = 'completed'
            timelinePhases[i].progress = 100
          }
        }
        // Set all subsequent phases to upcoming
        for (let i = phaseIndex + 1; i < timelinePhases.length; i++) {
          if (timelinePhases[i].status !== 'upcoming') {
            timelinePhases[i].status = 'upcoming'
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Timeline phase updated successfully',
        phases: timelinePhases
      })
    }

    if (action === 'resetTimeline') {
      // Reset to initial state
      timelinePhases = [
        { 
          phase: 'Registration', 
          description: 'Teams register via the official portal.',
          status: 'upcoming' as const,
          progress: 0
        },
        { 
          phase: 'Idea Submission', 
          description: 'Upload your project brief or pitch deck.',
          status: 'upcoming' as const,
          progress: 0
        },
        { 
          phase: 'Hack Submission', 
          description: 'Submit your working demo/prototype + presentation.',
          status: 'upcoming' as const,
          progress: 0
        },
        { 
          phase: 'Review & Judging', 
          description: 'Judges review entries via a structured digital scorecard.',
          status: 'upcoming' as const,
          progress: 0
        },
        { 
          phase: 'Results Announcement', 
          description: 'Scores & feedback published, winners announced online.',
          status: 'upcoming' as const,
          progress: 0
        }
      ]

      return NextResponse.json({
        success: true,
        message: 'Timeline reset successfully',
        phases: timelinePhases
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update timeline' },
      { status: 500 }
    )
  }
}