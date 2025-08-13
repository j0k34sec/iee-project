import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { db } from '@/lib/db'

let adminCredentials = {
  username: 'innoquest',
  password: 'innoquest2025'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'auth') {
      const username = searchParams.get('username')
      const password = searchParams.get('password')
      
      if (username === adminCredentials.username && password === adminCredentials.password) {
        return NextResponse.json({ success: true, message: 'Authentication successful' })
      } else {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
      }
    }

    // Fetch teams from database
    const teams = await db.team.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, team, username, password, newPassword } = body

    // Verify admin credentials for write operations
    if (action !== 'add' && action !== 'update' && action !== 'delete' && action !== 'changePassword') {
      if (username !== adminCredentials.username || password !== adminCredentials.password) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
      }
    }

    switch (action) {
      case 'add':
        const newTeam = await db.team.create({
          data: {
            name: team.name,
            projectTitle: team.projectTitle,
            status: team.status || 'pending',
            submittedAt: new Date().toISOString().split('T')[0],
            members: team.members || 1
          }
        })
        return NextResponse.json({ success: true, team: newTeam })

      case 'update':
        const updatedTeam = await db.team.update({
          where: { id: team.id },
          data: {
            name: team.name,
            projectTitle: team.projectTitle,
            status: team.status,
            members: team.members
          }
        })
        return NextResponse.json({ success: true, team: updatedTeam })

      case 'delete':
        await db.team.delete({
          where: { id: body.teamId }
        })
        return NextResponse.json({ success: true })

      case 'changePassword':
        if (username === adminCredentials.username && password === adminCredentials.password) {
          adminCredentials.password = newPassword
          return NextResponse.json({ success: true, message: 'Password changed successfully' })
        }
        return NextResponse.json({ success: false, message: 'Invalid current credentials' }, { status: 401 })

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}