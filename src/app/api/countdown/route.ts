import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for countdown data (in production, use a database)
let countdownData = {
  targetDate: "", // Empty date for no countdown
  targetTime: "", // Empty time for no countdown
  isActive: false, // Inactive by default
  customMessage: "Countdown to Launch" // Custom message for countdown
}

// Admin credentials
const ADMIN_USERNAME = 'innoquest'
const ADMIN_PASSWORD = 'innoquest2025'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      countdown: countdownData
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch countdown data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password, ...data } = body

    // Authenticate admin
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    switch (action) {
      case 'updateCountdown':
        // Update countdown settings
        if (data.targetDate) {
          // Validate date format (DD-MM-YYYY)
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/
          if (!dateRegex.test(data.targetDate)) {
            return NextResponse.json(
              { success: false, message: 'Invalid date format. Use DD-MM-YYYY' },
              { status: 400 }
            )
          }
          countdownData.targetDate = data.targetDate
        }

        if (data.targetTime) {
          // Validate time format (HH:MM)
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
          if (!timeRegex.test(data.targetTime)) {
            return NextResponse.json(
              { success: false, message: 'Invalid time format. Use HH:MM' },
              { status: 400 }
            )
          }
          countdownData.targetTime = data.targetTime
        }

        if (typeof data.isActive === 'boolean') {
          countdownData.isActive = data.isActive
        }

        if (data.customMessage !== undefined) {
          countdownData.customMessage = data.customMessage
        }

        return NextResponse.json({
          success: true,
          message: 'Countdown updated successfully',
          countdown: countdownData
        })

      case 'resetCountdown':
        // Reset to inactive state (null countdown)
        countdownData = {
          targetDate: "",
          targetTime: "",
          isActive: false,
          customMessage: "Countdown to Launch"
        }

        return NextResponse.json({
          success: true,
          message: 'Countdown reset to inactive state',
          countdown: countdownData
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process countdown request' },
      { status: 500 }
    )
  }
}