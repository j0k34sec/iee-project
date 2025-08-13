import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { db } from '@/lib/db'

interface SocialMediaLink {
  platform: string
  handle: string
  url?: string
}

interface ContactInfo {
  email: string
  discord: string
  socialMedia: SocialMediaLink[]
  description: string
}

export async function GET(request: NextRequest) {
  try {
    // Get the first contact info record
    const contactInfo = await db.contactInfo.findFirst()
    
    if (!contactInfo) {
      // Return default contact info if none exists
      const defaultContactInfo = {
        email: 'innoquest2025@example.com',
        discord: 'Join our community server',
        socialMedia: [
          {
            platform: 'twitter',
            handle: '@InnoQuest2025',
            url: 'https://twitter.com/InnoQuest2025'
          }
        ],
        description: 'Have questions about InnoQuest 2025? Reach out to our team and we\'ll be happy to help you on your journey to innovation!'
      }
      
      return NextResponse.json({
        success: true,
        contactInfo: defaultContactInfo
      })
    }
    
    // Parse social media if it's a string, otherwise use as-is
    const parsedContactInfo = {
      ...contactInfo,
      socialMedia: typeof contactInfo.socialMedia === 'string' 
        ? JSON.parse(contactInfo.socialMedia) 
        : contactInfo.socialMedia
    }
    
    return NextResponse.json({
      success: true,
      contactInfo: parsedContactInfo
    })
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, discord, socialMedia, description, username, password } = await request.json()
    
    // Simple authentication (you might want to improve this)
    if (username !== 'innoquest' || password !== 'innoquest2025') {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    if (action === 'updateContact') {
      if (!email || !discord || !socialMedia || !description) {
        return NextResponse.json(
          { success: false, message: 'All fields are required' },
          { status: 400 }
        )
      }
      
      // Parse social media if it's a string, otherwise use as-is
      const socialMediaData = typeof socialMedia === 'string' ? JSON.parse(socialMedia) : socialMedia
      
      // Check if contact info exists
      const existingContact = await db.contactInfo.findFirst()
      
      if (existingContact) {
        // Update existing contact info
        const updatedContact = await db.contactInfo.update({
          where: { id: existingContact.id },
          data: {
            email,
            discord,
            socialMedia: JSON.stringify(socialMediaData),
            description,
            updatedAt: new Date()
          }
        })
        
        return NextResponse.json({
          success: true,
          message: 'Contact info updated successfully',
          contactInfo: {
            ...updatedContact,
            socialMedia: socialMediaData
          }
        })
      } else {
        // Create new contact info
        const newContact = await db.contactInfo.create({
          data: {
            email,
            discord,
            socialMedia: JSON.stringify(socialMediaData),
            description
          }
        })
        
        return NextResponse.json({
          success: true,
          message: 'Contact info created successfully',
          contactInfo: {
            ...newContact,
            socialMedia: socialMediaData
          }
        })
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}