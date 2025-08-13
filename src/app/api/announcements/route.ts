import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { db } from '@/lib/db'

// Admin credentials
const ADMIN_USERNAME = 'innoquest'
const ADMIN_PASSWORD = 'innoquest2025'

export async function GET(request: NextRequest) {
  try {
    // Fetch active announcements from database, ordered by priority and creation date
    const announcements = await db.announcement.findMany({
      where: { isActive: true },
      orderBy: [
        { priority: 'desc' }, // Higher priority first
        { createdAt: 'desc' } // Most recent first for same priority
      ]
    })

    return NextResponse.json({
      success: true,
      announcements: announcements.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        createdAt: announcement.createdAt,
        updatedAt: announcement.updatedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
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
      case 'addAnnouncement':
        // Add new announcement
        if (!data.title || !data.content) {
          return NextResponse.json(
            { success: false, message: 'Title and content are required' },
            { status: 400 }
          )
        }

        const newAnnouncement = await db.announcement.create({
          data: {
            title: data.title.trim(),
            content: data.content.trim(),
            priority: data.priority || 1,
            isActive: data.isActive !== false // Default to true
          }
        })

        const allAnnouncements = await db.announcement.findMany({
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' }
          ]
        })

        return NextResponse.json({
          success: true,
          message: 'Announcement added successfully',
          announcements: allAnnouncements.map(announcement => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority,
            isActive: announcement.isActive,
            createdAt: announcement.createdAt,
            updatedAt: announcement.updatedAt
          }))
        })

      case 'updateAnnouncement':
        // Update existing announcement
        if (!data.id || !data.title || !data.content) {
          return NextResponse.json(
            { success: false, message: 'ID, title, and content are required' },
            { status: 400 }
          )
        }

        const updatedAnnouncement = await db.announcement.update({
          where: { id: data.id },
          data: {
            title: data.title.trim(),
            content: data.content.trim(),
            priority: data.priority || 1,
            isActive: data.isActive !== false
          }
        })

        const allAnnouncementsAfterUpdate = await db.announcement.findMany({
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' }
          ]
        })

        return NextResponse.json({
          success: true,
          message: 'Announcement updated successfully',
          announcements: allAnnouncementsAfterUpdate.map(announcement => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority,
            isActive: announcement.isActive,
            createdAt: announcement.createdAt,
            updatedAt: announcement.updatedAt
          }))
        })

      case 'deleteAnnouncement':
        // Delete announcement
        if (!data.announcementId) {
          return NextResponse.json(
            { success: false, message: 'Announcement ID is required' },
            { status: 400 }
          )
        }

        await db.announcement.delete({
          where: { id: data.announcementId }
        })

        const allAnnouncementsAfterDelete = await db.announcement.findMany({
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' }
          ]
        })

        return NextResponse.json({
          success: true,
          message: 'Announcement deleted successfully',
          announcements: allAnnouncementsAfterDelete.map(announcement => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority,
            isActive: announcement.isActive,
            createdAt: announcement.createdAt,
            updatedAt: announcement.updatedAt
          }))
        })

      case 'toggleAnnouncement':
        // Toggle announcement active status
        if (!data.announcementId) {
          return NextResponse.json(
            { success: false, message: 'Announcement ID is required' },
            { status: 400 }
          )
        }

        const announcement = await db.announcement.findUnique({
          where: { id: data.announcementId }
        })

        if (!announcement) {
          return NextResponse.json(
            { success: false, message: 'Announcement not found' },
            { status: 404 }
          )
        }

        const toggledAnnouncement = await db.announcement.update({
          where: { id: data.announcementId },
          data: { isActive: !announcement.isActive }
        })

        const allAnnouncementsAfterToggle = await db.announcement.findMany({
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'desc' }
          ]
        })

        return NextResponse.json({
          success: true,
          message: `Announcement ${toggledAnnouncement.isActive ? 'activated' : 'deactivated'} successfully`,
          announcements: allAnnouncementsAfterToggle.map(announcement => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            priority: announcement.priority,
            isActive: announcement.isActive,
            createdAt: announcement.createdAt,
            updatedAt: announcement.updatedAt
          }))
        })

      case 'resetAnnouncements':
        // Reset to empty state
        await db.announcement.deleteMany({})

        return NextResponse.json({
          success: true,
          message: 'All announcements reset successfully',
          announcements: []
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing announcement request:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process announcement request' },
      { status: 500 }
    )
  }
}