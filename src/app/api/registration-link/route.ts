import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Default registration link
const DEFAULT_REGISTRATION_LINK = "https://forms.google.com/example"

// In-memory storage (in production, you'd use a database)
let registrationLink = DEFAULT_REGISTRATION_LINK

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      registrationLink: registrationLink
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch registration link' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, registrationLink: newLink, username, password } = body

    // Simple authentication (in production, use proper auth)
    if (username !== 'innoquest' || password !== 'innoquest2025') {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    switch (action) {
      case 'updateLink':
        if (!newLink || typeof newLink !== 'string') {
          return NextResponse.json(
            { success: false, message: 'Valid registration link is required' },
            { status: 400 }
          )
        }
        
        // Basic URL validation
        try {
          new URL(newLink)
        } catch {
          return NextResponse.json(
            { success: false, message: 'Please provide a valid URL' },
            { status: 400 }
          )
        }

        registrationLink = newLink
        return NextResponse.json({
          success: true,
          message: 'Registration link updated successfully',
          registrationLink: registrationLink
        })

      case 'resetLink':
        registrationLink = DEFAULT_REGISTRATION_LINK
        return NextResponse.json({
          success: true,
          message: 'Registration link reset to default',
          registrationLink: registrationLink
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    )
  }
}