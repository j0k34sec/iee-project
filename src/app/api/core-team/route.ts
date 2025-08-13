import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { db } from '@/lib/db'

// Admin credentials
const ADMIN_USERNAME = 'innoquest'
const ADMIN_PASSWORD = 'innoquest2025'

// LinkedIn URL validation function
const isValidLinkedInUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return true // Empty URL is valid (optional field)
  
  // Remove leading/trailing whitespace
  const trimmedUrl = url.trim()
  
  // LinkedIn URL patterns to match
  const linkedinPatterns = [
    // Standard LinkedIn profile URLs
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?$/,
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_\/]*\/?$/,
    // LinkedIn profile URLs with additional parameters
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?[a-zA-Z0-9\-_&=?]*$/,
    // Short LinkedIn URLs
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]{1,100}\/?$/
  ]
  
  // Check if URL matches any LinkedIn pattern
  return linkedinPatterns.some(pattern => pattern.test(trimmedUrl))
}

export async function GET(request: NextRequest) {
  try {
    // Fetch core team members from database
    const coreTeam = await db.coreTeam.findMany({
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      success: true,
      coreTeam: coreTeam.map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        linkedinUrl: member.linkedinUrl
      }))
    })
  } catch (error) {
    console.error('Error fetching core team:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch core team data' },
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
      case 'addMember':
        // Add new team member
        if (!data.name || !data.role) {
          return NextResponse.json(
            { success: false, message: 'Name and role are required' },
            { status: 400 }
          )
        }

        // Validate LinkedIn URL if provided
        if (data.linkedinUrl && !isValidLinkedInUrl(data.linkedinUrl)) {
          return NextResponse.json(
            { success: false, message: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)' },
            { status: 400 }
          )
        }

        const newMember = await db.coreTeam.create({
          data: {
            name: data.name.trim(),
            role: data.role.trim(),
            linkedinUrl: data.linkedinUrl ? data.linkedinUrl.trim() : null
          }
        })

        const allMembers = await db.coreTeam.findMany({
          orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({
          success: true,
          message: 'Team member added successfully',
          coreTeam: allMembers.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
            linkedinUrl: member.linkedinUrl
          }))
        })

      case 'updateMember':
        // Update existing team member
        if (!data.id || !data.name || !data.role) {
          return NextResponse.json(
            { success: false, message: 'ID, name, and role are required' },
            { status: 400 }
          )
        }

        // Validate LinkedIn URL if provided
        if (data.linkedinUrl && !isValidLinkedInUrl(data.linkedinUrl)) {
          return NextResponse.json(
            { success: false, message: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)' },
            { status: 400 }
          )
        }

        const updatedMember = await db.coreTeam.update({
          where: { id: data.id },
          data: {
            name: data.name.trim(),
            role: data.role.trim(),
            linkedinUrl: data.linkedinUrl ? data.linkedinUrl.trim() : null
          }
        })

        const allMembersAfterUpdate = await db.coreTeam.findMany({
          orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({
          success: true,
          message: 'Team member updated successfully',
          coreTeam: allMembersAfterUpdate.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
            linkedinUrl: member.linkedinUrl
          }))
        })

      case 'deleteMember':
        // Delete team member
        if (!data.memberId) {
          return NextResponse.json(
            { success: false, message: 'Member ID is required' },
            { status: 400 }
          )
        }

        await db.coreTeam.delete({
          where: { id: data.memberId }
        })

        const allMembersAfterDelete = await db.coreTeam.findMany({
          orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({
          success: true,
          message: 'Team member deleted successfully',
          coreTeam: allMembersAfterDelete.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
            linkedinUrl: member.linkedinUrl
          }))
        })

      case 'reorderMembers':
        // Reorder team members (this is a frontend-only operation, database maintains creation order)
        if (!data.order || !Array.isArray(data.order)) {
          return NextResponse.json(
            { success: false, message: 'Valid order array is required' },
            { status: 400 }
          )
        }

        // For database storage, we maintain creation order
        // The frontend can handle display ordering
        const allMembersForReorder = await db.coreTeam.findMany({
          orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({
          success: true,
          message: 'Team members reordered successfully',
          coreTeam: allMembersForReorder.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
            linkedinUrl: member.linkedinUrl
          }))
        })

      case 'resetCoreTeam':
        // Reset to empty state
        await db.coreTeam.deleteMany({})

        return NextResponse.json({
          success: true,
          message: 'Core team reset to empty state',
          coreTeam: []
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing core team request:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process core team request' },
      { status: 500 }
    )
  }
}