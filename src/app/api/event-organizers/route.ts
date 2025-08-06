import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for event organizers data (in production, use a database)
let eventOrganizersData = {
  categories: [
    {
      id: 'eventCoordinators',
      name: 'Event Coordinators',
      color: 'blue',
      members: [
        { id: '1', name: '[Coordinator Name 1]', role: '' },
        { id: '2', name: '[Coordinator Name 2]', role: '' }
      ]
    },
    {
      id: 'facultyCoordinators',
      name: 'Faculty Coordinators',
      color: 'green',
      members: [
        { id: '3', name: '[Faculty Name 1]', role: 'Technical Mentor' },
        { id: '4', name: '[Faculty Name 2]', role: 'Innovation Guide' }
      ]
    },
    {
      id: 'technicalSupport',
      name: 'Technical & Logistics Support',
      color: 'amber',
      members: [
        { id: '5', name: '[Name]', role: 'Registration & Submission System' },
        { id: '6', name: '[Name]', role: 'Scheduling & Platform Management' }
      ]
    },
    {
      id: 'marketingTeam',
      name: 'Marketing & Outreach Team',
      color: 'pink',
      members: [
        { id: '7', name: '[Name]', role: 'Social Media Promotions' },
        { id: '8', name: '[Name]', role: 'Outreach & Partnerships' }
      ]
    }
  ]
}

// Admin credentials
const ADMIN_USERNAME = 'innoquest'
const ADMIN_PASSWORD = 'innoquest2025'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      eventOrganizers: eventOrganizersData
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event organizers data' },
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
        // Add new member to a specific category
        if (!data.categoryId || !data.name || !data.role) {
          return NextResponse.json(
            { success: false, message: 'Category ID, name, and role are required' },
            { status: 400 }
          )
        }

        const categoryToAdd = eventOrganizersData.categories.find(cat => cat.id === data.categoryId)
        if (!categoryToAdd) {
          return NextResponse.json(
            { success: false, message: 'Invalid category ID' },
            { status: 400 }
          )
        }

        const newMember = {
          id: Date.now().toString(),
          name: data.name.trim(),
          role: data.role.trim()
        }

        categoryToAdd.members.push(newMember)

        return NextResponse.json({
          success: true,
          message: 'Event organizer added successfully',
          eventOrganizers: eventOrganizersData
        })

      case 'updateMember':
        // Update existing member
        if (!data.categoryId || !data.id || !data.name || !data.role) {
          return NextResponse.json(
            { success: false, message: 'Category ID, member ID, name, and role are required' },
            { status: 400 }
          )
        }

        const categoryToUpdate = eventOrganizersData.categories.find(cat => cat.id === data.categoryId)
        if (!categoryToUpdate) {
          return NextResponse.json(
            { success: false, message: 'Invalid category ID' },
            { status: 400 }
          )
        }

        const memberIndex = categoryToUpdate.members.findIndex(member => member.id === data.id)
        if (memberIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Member not found' },
            { status: 404 }
          )
        }

        categoryToUpdate.members[memberIndex] = {
          id: data.id,
          name: data.name.trim(),
          role: data.role.trim()
        }

        return NextResponse.json({
          success: true,
          message: 'Event organizer updated successfully',
          eventOrganizers: eventOrganizersData
        })

      case 'deleteMember':
        // Delete member from a specific category
        if (!data.categoryId || !data.memberId) {
          return NextResponse.json(
            { success: false, message: 'Category ID and member ID are required' },
            { status: 400 }
          )
        }

        const categoryToDelete = eventOrganizersData.categories.find(cat => cat.id === data.categoryId)
        if (!categoryToDelete) {
          return NextResponse.json(
            { success: false, message: 'Invalid category ID' },
            { status: 400 }
          )
        }

        const initialLength = categoryToDelete.members.length
        categoryToDelete.members = categoryToDelete.members.filter(member => member.id !== data.memberId)

        if (categoryToDelete.members.length === initialLength) {
          return NextResponse.json(
            { success: false, message: 'Member not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Event organizer deleted successfully',
          eventOrganizers: eventOrganizersData
        })

      case 'addCategory':
        // Add a new category
        if (!data.name || !data.color) {
          return NextResponse.json(
            { success: false, message: 'Category name and color are required' },
            { status: 400 }
          )
        }

        const categoryId = data.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
        
        // Check if category ID already exists
        if (eventOrganizersData.categories.find(cat => cat.id === categoryId)) {
          return NextResponse.json(
            { success: false, message: 'Category with this name already exists' },
            { status: 400 }
          )
        }

        const newCategory = {
          id: categoryId,
          name: data.name.trim(),
          color: data.color.trim(),
          members: []
        }

        eventOrganizersData.categories.push(newCategory)

        return NextResponse.json({
          success: true,
          message: 'Category added successfully',
          eventOrganizers: eventOrganizersData
        })

      case 'updateCategory':
        // Update an existing category
        if (!data.categoryId || !data.name || !data.color) {
          return NextResponse.json(
            { success: false, message: 'Category ID, name, and color are required' },
            { status: 400 }
          )
        }

        const categoryIndex = eventOrganizersData.categories.findIndex(cat => cat.id === data.categoryId)
        if (categoryIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Category not found' },
            { status: 404 }
          )
        }

        // If name is changing, check if new name would create duplicate
        if (data.name !== eventOrganizersData.categories[categoryIndex].name) {
          const newCategoryId = data.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
          if (eventOrganizersData.categories.find(cat => cat.id === newCategoryId && cat.id !== data.categoryId)) {
            return NextResponse.json(
              { success: false, message: 'Category with this name already exists' },
              { status: 400 }
            )
          }
          eventOrganizersData.categories[categoryIndex].id = newCategoryId
        }

        eventOrganizersData.categories[categoryIndex].name = data.name.trim()
        eventOrganizersData.categories[categoryIndex].color = data.color.trim()

        return NextResponse.json({
          success: true,
          message: 'Category updated successfully',
          eventOrganizers: eventOrganizersData
        })

      case 'deleteCategory':
        // Delete a category
        if (!data.categoryId) {
          return NextResponse.json(
            { success: false, message: 'Category ID is required' },
            { status: 400 }
          )
        }

        const initialCategoryLength = eventOrganizersData.categories.length
        eventOrganizersData.categories = eventOrganizersData.categories.filter(cat => cat.id !== data.categoryId)

        if (eventOrganizersData.categories.length === initialCategoryLength) {
          return NextResponse.json(
            { success: false, message: 'Category not found' },
            { status: 404 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Category deleted successfully',
          eventOrganizers: eventOrganizersData
        })

      case 'resetEventOrganizers':
        // Reset to default values
        eventOrganizersData = {
          categories: [
            {
              id: 'eventCoordinators',
              name: 'Event Coordinators',
              color: 'blue',
              members: [
                { id: '1', name: '[Coordinator Name 1]', role: '' },
                { id: '2', name: '[Coordinator Name 2]', role: '' }
              ]
            },
            {
              id: 'facultyCoordinators',
              name: 'Faculty Coordinators',
              color: 'green',
              members: [
                { id: '3', name: '[Faculty Name 1]', role: 'Technical Mentor' },
                { id: '4', name: '[Faculty Name 2]', role: 'Innovation Guide' }
              ]
            },
            {
              id: 'technicalSupport',
              name: 'Technical & Logistics Support',
              color: 'amber',
              members: [
                { id: '5', name: '[Name]', role: 'Registration & Submission System' },
                { id: '6', name: '[Name]', role: 'Scheduling & Platform Management' }
              ]
            },
            {
              id: 'marketingTeam',
              name: 'Marketing & Outreach Team',
              color: 'pink',
              members: [
                { id: '7', name: '[Name]', role: 'Social Media Promotions' },
                { id: '8', name: '[Name]', role: 'Outreach & Partnerships' }
              ]
            }
          ]
        }

        return NextResponse.json({
          success: true,
          message: 'Event organizers reset to defaults',
          eventOrganizers: eventOrganizersData
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process event organizers request' },
      { status: 500 }
    )
  }
}