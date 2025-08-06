'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { FadeIn, StaggerContainer, StaggerItem, HoverCard, AnimatedButton, ScaleIn } from '@/components/animations'
import SocialMediaManager from '@/components/SocialMediaManager'
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Youtube, 
  Music, 
  Github, 
  MessageCircle, 
  Send, 
  Globe,
  Mail
} from 'lucide-react'

interface Team {
  id: string
  name: string
  projectTitle: string
  status: 'pending' | 'under-review' | 'approved' | 'rejected'
  submittedAt: string
  members: number
}

interface TimelinePhase {
  phase: string
  description: string
  status: 'upcoming' | 'current' | 'completed'
  progress: number
}

interface CountdownConfig {
  targetDate: string
  targetTime: string
  isActive: boolean
  customMessage: string
}

interface CoreTeamMember {
  id: string
  name: string
  role: string
  linkedinUrl?: string
}

interface Announcement {
  id: string
  title: string
  content: string
  isActive: boolean
  priority: number
  createdAt: string
  updatedAt: string
}

interface EventOrganizerCategory {
  id: string
  name: string
  color: string
  members: Array<{ id: string; name: string; role: string }>
}

interface ContactInfo {
  email: string
  socialMedia: { platform: string; handle: string; url?: string }[]
  description: string
}

interface EventOrganizers {
  categories: EventOrganizerCategory[]
}

interface SocialMediaPlatform {
  id: string
  name: string
  icon: React.ReactNode
  baseUrl?: string
  placeholder: string
}

export default function AdminDashboard() {
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

  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      amber: 'bg-amber-600',
      pink: 'bg-pink-600',
      purple: 'bg-purple-600',
      red: 'bg-red-600',
      indigo: 'bg-indigo-600',
      teal: 'bg-teal-600'
    }
    return colorMap[color] || 'bg-gray-600'
  }

  const getCategoryButtonClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
      green: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
      amber: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
      pink: 'from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700',
      purple: 'from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700',
      red: 'from-red-600 to-red-600 hover:from-red-700 hover:to-red-700',
      indigo: 'from-indigo-600 to-indigo-600 hover:from-indigo-700 hover:to-indigo-700',
      teal: 'from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700'
    }
    return colorMap[color] || 'from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700'
  }

  const socialMediaPlatforms: SocialMediaPlatform[] = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, baseUrl: 'https://instagram.com/', placeholder: '@username' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, baseUrl: 'https://linkedin.com/in/', placeholder: 'profile-name' },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-5 h-5" />, baseUrl: 'https://twitter.com/', placeholder: '@username' },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, baseUrl: 'https://facebook.com/', placeholder: 'page-name' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, baseUrl: 'https://youtube.com/', placeholder: 'channel-name' },
    { id: 'tiktok', name: 'TikTok', icon: <Music className="w-5 h-5" />, baseUrl: 'https://tiktok.com/@', placeholder: '@username' },
    { id: 'github', name: 'GitHub', icon: <Github className="w-5 h-5" />, baseUrl: 'https://github.com/', placeholder: 'username' },
    { id: 'discord', name: 'Discord Server', icon: <MessageCircle className="w-5 h-5" />, placeholder: 'server-invite' },
    { id: 'telegram', name: 'Telegram', icon: <Send className="w-5 h-5" />, baseUrl: 'https://t.me/', placeholder: '@username' },
    { id: 'website', name: 'Website', icon: <Globe className="w-5 h-5" />, placeholder: 'https://example.com' }
  ]

  const [teams, setTeams] = useState<Team[]>([])
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>([])
  const [countdownConfig, setCountdownConfig] = useState<CountdownConfig>({
    targetDate: "",
    targetTime: "",
    isActive: false,
    customMessage: "Countdown to Launch"
  })
  const [coreTeam, setCoreTeam] = useState<CoreTeamMember[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [eventOrganizers, setEventOrganizers] = useState<EventOrganizers>({
    categories: []
  })
  const [isEditingCountdown, setIsEditingCountdown] = useState(false)
  const [isEditingCoreTeam, setIsEditingCoreTeam] = useState(false)
  const [isEditingAnnouncements, setIsEditingAnnouncements] = useState(false)
  const [isEditingEventOrganizers, setIsEditingEventOrganizers] = useState(false)
  const [currentMember, setCurrentMember] = useState<Partial<CoreTeamMember> | null>(null)
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement> | null>(null)
  const [currentEventOrganizer, setCurrentEventOrganizer] = useState<{ categoryId: string; member: Partial<{ id: string; name: string; role: string }> } | null>(null)
  const [currentCategory, setCurrentCategory] = useState<Partial<EventOrganizerCategory> | null>(null)
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<Partial<Team> | null>(null)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [registrationLink, setRegistrationLink] = useState("https://forms.google.com/example")
  const [isEditingRegistrationLink, setIsEditingRegistrationLink] = useState(false)
  const [newRegistrationLink, setNewRegistrationLink] = useState("")
  const [contactInfo, setContactInfo] = useState({
    email: 'innoquest2025@example.com',
    socialMedia: [],
    description: 'Have questions about InnoQuest 2025? Reach out to our team and we\'ll be happy to help you on your journey to innovation!'
  })
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false)
  const [newContactInfo, setNewContactInfo] = useState({
    email: '',
    socialMedia: [] as { platform: string; handle: string; url?: string }[],
    description: ''
  })
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated')
    if (!isAuthenticated) {
      router.push('/admin')
      return
    }
    fetchTeams()
    fetchTimeline()
    fetchCountdown()
    fetchCoreTeam()
    fetchAnnouncements()
    fetchEventOrganizers()
    fetchRegistrationLink()
    fetchContactInfo()
  }, [router])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive",
      })
    }
  }

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/timeline')
      const data = await response.json()
      setTimelinePhases(data.phases || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch timeline",
        variant: "destructive",
      })
    }
  }

  const fetchCountdown = async () => {
    try {
      const response = await fetch('/api/countdown')
      const data = await response.json()
      if (data.success && data.countdown) {
        setCountdownConfig(data.countdown)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch countdown config",
        variant: "destructive",
      })
    }
  }

  const fetchCoreTeam = async () => {
    try {
      const response = await fetch('/api/core-team')
      const data = await response.json()
      if (data.success && data.coreTeam) {
        setCoreTeam(data.coreTeam)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch core team data",
        variant: "destructive",
      })
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      const data = await response.json()
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements data",
        variant: "destructive",
      })
    }
  }

  const fetchEventOrganizers = async () => {
    try {
      const response = await fetch('/api/event-organizers')
      const data = await response.json()
      if (data.success && data.eventOrganizers) {
        setEventOrganizers(data.eventOrganizers)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event organizers data",
        variant: "destructive",
      })
    }
  }

  const fetchRegistrationLink = async () => {
    try {
      const response = await fetch('/api/registration-link')
      const data = await response.json()
      if (data.success && data.registrationLink) {
        setRegistrationLink(data.registrationLink)
        setNewRegistrationLink(data.registrationLink)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch registration link",
        variant: "destructive",
      })
    }
  }

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-us')
      const data = await response.json()
      if (data.success && data.contactInfo) {
        // Parse social media if it's a string, otherwise use as-is
        const parsedContactInfo = {
          ...data.contactInfo,
          socialMedia: typeof data.contactInfo.socialMedia === 'string' 
            ? JSON.parse(data.contactInfo.socialMedia) 
            : (Array.isArray(data.contactInfo.socialMedia) ? data.contactInfo.socialMedia : [data.contactInfo.socialMedia])
        }
        setContactInfo(parsedContactInfo)
        setNewContactInfo(parsedContactInfo)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact info",
        variant: "destructive",
      })
    }
  }

  const handleAddTeam = () => {
    setCurrentTeam({
      name: '',
      projectTitle: '',
      status: 'pending',
      members: 1
    })
    setIsEditing(true)
  }

  const handleEditTeam = (team: Team) => {
    setCurrentTeam(team)
    setIsEditing(true)
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          teamId,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Team deleted successfully",
        })
        fetchTeams()
        fetchTimeline()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete team",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTeam = async () => {
    if (!currentTeam?.name || !currentTeam?.projectTitle) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const action = currentTeam.id ? 'update' : 'add'
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          team: currentTeam,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: currentTeam.id ? "Team updated successfully" : "Team added successfully",
        })
        setIsEditing(false)
        setCurrentTeam(null)
        fetchTeams()
        fetchTimeline()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save team",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          username: 'innoquest',
          password: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        })
        setShowPasswordChange(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to change password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    router.push('/admin')
  }

  const handleUpdateTimelinePhase = async (phaseIndex: number, status: TimelinePhase['status']) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePhase',
          phaseIndex,
          status,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Timeline phase updated successfully",
        })
        setTimelinePhases(data.phases)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update timeline",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update timeline",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetTimeline = async () => {
    if (!confirm('Are you sure you want to reset the timeline to its initial state?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetTimeline',
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Timeline reset successfully",
        })
        setTimelinePhases(data.phases)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset timeline",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset timeline",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCountdown = async (updates: Partial<CountdownConfig>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/countdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateCountdown',
          ...updates,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Countdown updated successfully",
        })
        setCountdownConfig(data.countdown)
        setIsEditingCountdown(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update countdown",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update countdown",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetCountdown = async () => {
    if (!confirm('Are you sure you want to reset the countdown to default values?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/countdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetCountdown',
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Countdown reset successfully",
        })
        setCountdownConfig(data.countdown)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset countdown",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset countdown",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRegistrationLink = async () => {
    if (!newRegistrationLink || typeof newRegistrationLink !== 'string') {
      toast({
        title: "Error",
        description: "Please provide a valid registration link",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/registration-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateLink',
          registrationLink: newRegistrationLink,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Registration link updated successfully",
        })
        setRegistrationLink(data.registrationLink)
        setIsEditingRegistrationLink(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update registration link",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update registration link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateContactInfo = async () => {
    if (!newContactInfo.email || !newContactInfo.discord || !newContactInfo.description) {
      toast({
        title: "Error",
        description: "Email, Discord, and Description are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/contact-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateContact',
          email: newContactInfo.email,
          discord: newContactInfo.discord,
          socialMedia: newContactInfo.socialMedia,
          description: newContactInfo.description,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Contact info updated successfully",
        })
        setIsEditingContactInfo(false)
        setContactInfo(newContactInfo)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update contact info",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact info",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetRegistrationLink = async () => {
    if (!confirm('Are you sure you want to reset the registration link to default?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/registration-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetLink',
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Registration link reset successfully",
        })
        setRegistrationLink(data.registrationLink)
        setNewRegistrationLink(data.registrationLink)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset registration link",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset registration link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMember = () => {
    setCurrentMember({
      name: '',
      role: ''
    })
    setIsEditingCoreTeam(true)
  }

  const handleEditMember = (member: CoreTeamMember) => {
    setCurrentMember(member)
    setIsEditingCoreTeam(true)
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/core-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteMember',
          memberId,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Team member deleted successfully",
        })
        setCoreTeam(data.coreTeam)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete team member",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMember = async () => {
    if (!currentMember?.name || !currentMember?.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate LinkedIn URL if provided
    if (currentMember.linkedinUrl && !isValidLinkedInUrl(currentMember.linkedinUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const action = currentMember.id ? 'updateMember' : 'addMember'
      const response = await fetch('/api/core-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...currentMember,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: currentMember.id ? "Team member updated successfully" : "Team member added successfully",
        })
        setIsEditingCoreTeam(false)
        setCurrentMember(null)
        setCoreTeam(data.coreTeam)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save team member",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAnnouncement = () => {
    setCurrentAnnouncement({
      title: '',
      content: '',
      priority: 1,
      isActive: true
    })
    setIsEditingAnnouncements(true)
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement)
    setIsEditingAnnouncements(true)
  }

  const handleSaveAnnouncement = async () => {
    if (!currentAnnouncement?.title || !currentAnnouncement?.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const action = currentAnnouncement.id ? 'updateAnnouncement' : 'addAnnouncement'
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...currentAnnouncement,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: currentAnnouncement.id ? "Announcement updated successfully" : "Announcement added successfully",
        })
        setIsEditingAnnouncements(false)
        setCurrentAnnouncement(null)
        setAnnouncements(data.announcements)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save announcement",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save announcement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteAnnouncement',
          announcementId,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Announcement deleted successfully",
        })
        setAnnouncements(data.announcements)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete announcement",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAnnouncement = async (announcementId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleAnnouncement',
          announcementId,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        setAnnouncements(data.announcements)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to toggle announcement",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle announcement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetAnnouncements = async () => {
    if (!confirm('Are you sure you want to remove all announcements? This will make the announcement section empty.')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetAnnouncements',
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "All announcements reset successfully",
        })
        setAnnouncements(data.announcements)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset announcements",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset announcements",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetCoreTeam = async () => {
    if (!confirm('Are you sure you want to remove all core team members? This will make the core team section empty.')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/core-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetCoreTeam',
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Core team reset successfully",
        })
        setCoreTeam(data.coreTeam)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset core team",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset core team",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEventOrganizer = (categoryId: string) => {
    setCurrentEventOrganizer({
      categoryId,
      member: { name: '', role: '' }
    })
    setIsEditingEventOrganizers(true)
  }

  const handleEditEventOrganizer = (categoryId: string, member: { id: string; name: string; role: string }) => {
    setCurrentEventOrganizer({
      categoryId,
      member
    })
    setIsEditingEventOrganizers(true)
  }

  const handleDeleteEventOrganizer = async (categoryId: string, memberId: string) => {
    if (!confirm('Are you sure you want to delete this event organizer?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/event-organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteMember',
          categoryId,
          memberId,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Event organizer deleted successfully",
        })
        setEventOrganizers(data.eventOrganizers)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete event organizer",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event organizer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEventOrganizer = async () => {
    if (!currentEventOrganizer?.member?.name || !currentEventOrganizer?.member?.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const action = currentEventOrganizer.member.id ? 'updateMember' : 'addMember'
      const response = await fetch('/api/event-organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          categoryId: currentEventOrganizer.categoryId,
          ...currentEventOrganizer.member,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: currentEventOrganizer.member.id ? "Event organizer updated successfully" : "Event organizer added successfully",
        })
        setIsEditingEventOrganizers(false)
        setCurrentEventOrganizer(null)
        setEventOrganizers(data.eventOrganizers)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save event organizer",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event organizer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Category management handlers
  const handleEditCategory = (category: EventOrganizerCategory) => {
    setCurrentCategory(category)
    setIsEditingCategory(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? All members in this category will also be deleted.')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/event-organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteCategory',
          categoryId,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        setEventOrganizers(data.eventOrganizers)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveCategory = async () => {
    if (!currentCategory?.name || !currentCategory?.color) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const action = currentCategory.id ? 'updateCategory' : 'addCategory'
      const response = await fetch('/api/event-organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          categoryId: currentCategory.id,
          name: currentCategory.name,
          color: currentCategory.color,
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: currentCategory.id ? "Category updated successfully" : "Category added successfully",
        })
        setIsEditingCategory(false)
        setCurrentCategory(null)
        setEventOrganizers(data.eventOrganizers)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetEventOrganizers = async () => {
    if (!confirm('Are you sure you want to reset event organizers to default values?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/event-organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetEventOrganizers',
          username: 'innoquest',
          password: 'innoquest2025'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Event organizers reset successfully",
        })
        setEventOrganizers(data.eventOrganizers)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset event organizers",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset event organizers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Team['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-600'
      case 'under-review': return 'bg-yellow-600'
      case 'rejected': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-purple-300">🛸 Admin Dashboard</h1>
              <p className="text-purple-200">Manage InnoQuest Hackathon 2025 Teams</p>
            </div>
            <div className="flex gap-2">
              <AnimatedButton>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordChange(true)}
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 transition-all duration-300"
                >
                  🔐 Change Password
                </Button>
              </AnimatedButton>
              <AnimatedButton>
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl border-0 transition-all duration-300"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </Button>
              </AnimatedButton>
            </div>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerContainer delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StaggerItem>
              <HoverCard>
                <Card className="bg-black/40 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-300">{teams.length}</div>
                    <div className="text-sm text-purple-200">Total Teams</div>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard>
                <Card className="bg-black/40 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {teams.filter(t => t.status === 'approved').length}
                    </div>
                    <div className="text-sm text-purple-200">Approved</div>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard>
                <Card className="bg-black/40 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {teams.filter(t => t.status === 'under-review').length}
                    </div>
                    <div className="text-sm text-purple-200">Under Review</div>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
            <StaggerItem>
              <HoverCard>
                <Card className="bg-black/40 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-400">
                      {teams.filter(t => t.status === 'pending').length}
                    </div>
                    <div className="text-sm text-purple-200">Pending</div>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Timeline Control Section */}
        <FadeIn delay={0.4}>
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-8 hover:border-purple-400/50 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-purple-300">📅 Hackathon Timeline Control</CardTitle>
                  <CardDescription className="text-purple-200">
                    Manage timeline phases and track progress
                  </CardDescription>
                </div>
                <AnimatedButton>
                  <Button
                    onClick={handleResetTimeline}
                    disabled={isLoading}
                    variant="outline"
                    className="border-orange-500/50 text-orange-300 hover:bg-orange-900/30 transition-all duration-300"
                  >
                    🔄 Reset Timeline
                  </Button>
                </AnimatedButton>
              </div>
            </CardHeader>
            <CardContent>
              <StaggerContainer delay={0.5}>
                <div className="space-y-4" id="timeline-phases">
                  {timelinePhases.map((phase, index) => (
                    <StaggerItem key={index}>
                      <HoverCard>
                        <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              phase.status === 'completed' ? 'bg-green-600' :
                              phase.status === 'current' ? 'bg-purple-600' : 'bg-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-purple-300">{phase.phase}</h3>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  phase.status === 'completed' ? 'bg-green-600' :
                                  phase.status === 'current' ? 'bg-purple-600' : 'bg-gray-600'
                                }>
                                  {phase.status === 'completed' ? '✓ Completed' :
                                   phase.status === 'current' ? '🔄 Current' : '⏳ Upcoming'}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-purple-200">{phase.description}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <Select
                              value={phase.status}
                              onValueChange={(value) => handleUpdateTimelinePhase(index, value as TimelinePhase['status'])}
                            >
                              <SelectTrigger className="w-32 bg-black/50 border-purple-500/30 text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="upcoming">⏳ Upcoming</SelectItem>
                                <SelectItem value="current">🔄 Current</SelectItem>
                                <SelectItem value="completed">✓ Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
          </CardContent>
        </Card>
        </FadeIn>

        {/* Countdown Control Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-300">⏳ Countdown Control</CardTitle>
                <CardDescription className="text-purple-200">
                  Manage countdown timer settings and target date
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsEditingCountdown(!isEditingCountdown)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  {isEditingCountdown ? (
                    <>
                      <span className="mr-2">❌</span>
                      Cancel
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✏️</span>
                      Edit Countdown
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleResetCountdown}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">🔄</span>
                  Reset Countdown
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingCountdown ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Target Date (DD-MM-YYYY)</Label>
                    <Input
                      value={countdownConfig.targetDate}
                      onChange={(e) => setCountdownConfig(prev => ({ ...prev, targetDate: e.target.value }))}
                      className="bg-black/50 border-purple-500/30 text-white"
                      placeholder="25-08-2025"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Target Time (HH:MM)</Label>
                    <Input
                      value={countdownConfig.targetTime}
                      onChange={(e) => setCountdownConfig(prev => ({ ...prev, targetTime: e.target.value }))}
                      className="bg-black/50 border-purple-500/30 text-white"
                      placeholder="09:00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Custom Message</Label>
                  <Input
                    value={countdownConfig.customMessage}
                    onChange={(e) => setCountdownConfig(prev => ({ ...prev, customMessage: e.target.value }))}
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="Countdown to Launch"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={countdownConfig.isActive}
                    onChange={(e) => setCountdownConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Label htmlFor="isActive" className="text-purple-300">Enable Countdown</Label>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleUpdateCountdown(countdownConfig)}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                  >
                    <span className="mr-2">💾</span>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingCountdown(false)}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <span className="mr-2">❌</span>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="text-sm text-purple-200 mb-1">Target Date</div>
                    <div className="text-lg font-semibold text-purple-300">{countdownConfig.targetDate}</div>
                  </div>
                  <div className="p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="text-sm text-purple-200 mb-1">Target Time</div>
                    <div className="text-lg font-semibold text-purple-300">{countdownConfig.targetTime}</div>
                  </div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg border border-purple-500/20">
                  <div className="text-sm text-purple-200 mb-1">Custom Message</div>
                  <div className="text-lg font-semibold text-purple-300">{countdownConfig.customMessage}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${countdownConfig.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-purple-200">
                    Status: {countdownConfig.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registration Link Control Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-300">🔗 Registration Link Control</CardTitle>
                <CardDescription className="text-purple-200">
                  Manage the Google Form registration link
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsEditingRegistrationLink(!isEditingRegistrationLink)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  {isEditingRegistrationLink ? (
                    <>
                      <span className="mr-2">❌</span>
                      Cancel
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✏️</span>
                      Edit Link
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleResetRegistrationLink}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">🔄</span>
                  Reset Link
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingRegistrationLink ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="registrationLink" className="text-purple-300">Registration Link</Label>
                  <Input
                    id="registrationLink"
                    type="url"
                    value={newRegistrationLink}
                    onChange={(e) => setNewRegistrationLink(e.target.value)}
                    placeholder="https://forms.google.com/your-form"
                    className="bg-black/20 border-purple-500/50 text-white placeholder-purple-400"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdateRegistrationLink}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                  >
                    <span className="mr-2">💾</span>
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingRegistrationLink(false)
                      setNewRegistrationLink(registrationLink)
                    }}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                  >
                    <span className="mr-2">❌</span>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-purple-300">Current Registration Link:</Label>
                  <div className="mt-2 p-3 bg-black/20 rounded border border-purple-500/30">
                    <a 
                      href={registrationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 break-all"
                    >
                      {registrationLink}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-purple-200">
                    Status: Active
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Announcements Control Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-300">📢 Announcements Control</CardTitle>
                <CardDescription className="text-purple-200">
                  Manage announcements and notifications
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddAnnouncement}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">📢</span>
                  Add Announcement
                </Button>
                <Button
                  onClick={handleResetAnnouncements}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">🗑️</span>
                  Reset All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Announcement Form */}
            {isEditingAnnouncements && (
              <Card className="bg-black/30 border-purple-500/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-purple-300">
                    {currentAnnouncement?.id ? 'Edit Announcement' : 'Add New Announcement'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Title *</Label>
                    <Input
                      value={currentAnnouncement?.title || ''}
                      onChange={(e) => setCurrentAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-black/50 border-purple-500/30 text-white"
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">Content *</Label>
                    <Textarea
                      value={currentAnnouncement?.content || ''}
                      onChange={(e) => setCurrentAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                      className="bg-black/50 border-purple-500/30 text-white min-h-[100px]"
                      placeholder="Enter announcement content"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-purple-300">Priority</Label>
                      <Select
                        value={currentAnnouncement?.priority?.toString() || '1'}
                        onValueChange={(value) => setCurrentAnnouncement(prev => ({ ...prev, priority: parseInt(value) }))}
                      >
                        <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-500/30">
                          <SelectItem value="1" className="text-white">Normal</SelectItem>
                          <SelectItem value="2" className="text-white">High</SelectItem>
                          <SelectItem value="3" className="text-white">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-purple-300">Status</Label>
                      <Select
                        value={currentAnnouncement?.isActive ? 'true' : 'false'}
                        onValueChange={(value) => setCurrentAnnouncement(prev => ({ ...prev, isActive: value === 'true' }))}
                      >
                        <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-500/30">
                          <SelectItem value="true" className="text-white">Active</SelectItem>
                          <SelectItem value="false" className="text-white">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveAnnouncement}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                    >
                      <span className="mr-2">💾</span>
                      {isLoading ? 'Saving...' : 'Save Announcement'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingAnnouncements(false)
                        setCurrentAnnouncement(null)
                      }}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <span className="mr-2">❌</span>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-purple-400">No announcements found. Add your first announcement to get started!</p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <Card key={announcement.id} className="bg-black/30 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-purple-200 font-semibold">{announcement.title}</h4>
                            <Badge 
                              variant={announcement.priority === 3 ? "destructive" : announcement.priority === 2 ? "default" : "secondary"}
                              className={
                                announcement.priority === 3 
                                  ? "bg-red-600 hover:bg-red-700" 
                                  : announcement.priority === 2 
                                  ? "bg-yellow-600 hover:bg-yellow-700" 
                                  : "bg-gray-600 hover:bg-gray-700"
                              }
                            >
                              {announcement.priority === 3 ? "Urgent" : announcement.priority === 2 ? "High" : "Normal"}
                            </Badge>
                            <Badge 
                              variant={announcement.isActive ? "default" : "secondary"}
                              className={announcement.isActive ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}
                            >
                              {announcement.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-purple-300 text-sm mb-2">{announcement.content}</p>
                          <p className="text-purple-400 text-xs">
                            Created: {new Date(announcement.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAnnouncement(announcement.id)}
                            disabled={isLoading}
                            className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                          >
                            {announcement.isActive ? "🔕" : "🔔"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAnnouncement(announcement)}
                            disabled={isLoading}
                            className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            disabled={isLoading}
                            className="border-red-500/50 text-red-300 hover:bg-red-900/30"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Core Team Control Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-300">💡 Core Team Control</CardTitle>
                <CardDescription className="text-purple-200">
                  Manage core team members and their roles
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddMember}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">➕</span>
                  Add Member
                </Button>
                <Button
                  onClick={handleResetCoreTeam}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">🔄</span>
                  Reset Team
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Team Member Form */}
            {isEditingCoreTeam && (
              <Card className="bg-black/30 border-purple-500/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-purple-300">
                    {currentMember?.id ? 'Edit Team Member' : 'Add New Team Member'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-purple-300">Name *</Label>
                      <Input
                        value={currentMember?.name || ''}
                        onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-black/50 border-purple-500/30 text-white"
                        placeholder="Enter member name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-purple-300">Role *</Label>
                      <Input
                        value={currentMember?.role || ''}
                        onChange={(e) => setCurrentMember(prev => ({ ...prev, role: e.target.value }))}
                        className="bg-black/50 border-purple-500/30 text-white"
                        placeholder="Enter member role"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-purple-300">LinkedIn Profile URL (Optional)</Label>
                    <Input
                      value={currentMember?.linkedinUrl || ''}
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      className="bg-black/50 border-purple-500/30 text-white"
                      placeholder="https://linkedin.com/in/username"
                      type="url"
                    />
                    <p className="text-xs text-purple-400">
                      💡 Only LinkedIn profile URLs are accepted (e.g., https://linkedin.com/in/username)
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveMember}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                    >
                      <span className="mr-2">💾</span>
                      {isLoading ? 'Saving...' : 'Save Member'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingCoreTeam(false)
                        setCurrentMember(null)
                      }}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <span className="mr-2">❌</span>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Members List */}
            <div className="space-y-4">
              {coreTeam.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/20">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-purple-300">{member.name}</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditMember(member)}
                          disabled={isLoading}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={isLoading}
                          size="sm"
                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                        >
                          <span className="mr-1">🗑️</span>
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-purple-200">{member.role}</p>
                  </div>
                </div>
              ))}
              {coreTeam.length === 0 && (
                <div className="text-center py-8 text-purple-400">
                  No team members found. Click "Add Member" to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Organizers Control Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-300">🔧 Event Organizers & Support Control</CardTitle>
                <CardDescription className="text-purple-200">
                  Manage event organizers, faculty coordinators, and support teams
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleResetEventOrganizers}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">🔄</span>
                  Reset All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Category Management */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-300">Manage Categories</h3>
                <Button
                  onClick={() => {
                    setCurrentCategory({ name: '', color: 'blue' })
                    setIsEditingCategory(true)
                  }}
                  disabled={isLoading}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-1">➕</span>
                  Add Category
                </Button>
              </div>
              
              {/* Category Form */}
              {isEditingCategory && currentCategory && (
                <Card className="bg-black/30 border-purple-500/20 mb-4">
                  <CardHeader>
                    <CardTitle className="text-purple-300">
                      {currentCategory.id ? 'Edit Category' : 'Add New Category'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-purple-300">Category Name *</Label>
                        <Input
                          value={currentCategory.name || ''}
                          onChange={(e) => setCurrentCategory(prev => ({
                            ...prev!,
                            name: e.target.value
                          }))}
                          className="bg-black/50 border-purple-500/30 text-white"
                          placeholder="Enter category name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-purple-300">Color *</Label>
                        <Select
                          value={currentCategory.color || 'blue'}
                          onValueChange={(value) => setCurrentCategory(prev => ({
                            ...prev!,
                            color: value
                          }))}
                        >
                          <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="amber">Amber</SelectItem>
                            <SelectItem value="pink">Pink</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="indigo">Indigo</SelectItem>
                            <SelectItem value="teal">Teal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveCategory}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                      >
                        <span className="mr-2">💾</span>
                        {isLoading ? 'Saving...' : 'Save Category'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingCategory(false)
                          setCurrentCategory(null)
                        }}
                        className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <span className="mr-2">❌</span>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Categories List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventOrganizers.categories.map((category) => (
                  <div key={category.id} className="p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getCategoryColorClass(category.color)}`}></div>
                        <h4 className="font-medium text-purple-300">{category.name}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleEditCategory(category)}
                          disabled={isLoading}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 p-1 h-6 w-6"
                        >
                          <span className="text-xs">✏️</span>
                        </Button>
                        <Button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isLoading}
                          size="sm"
                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0 p-1 h-6 w-6"
                        >
                          <span className="text-xs">🗑️</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-purple-400">
                      {category.members.length} member{category.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Organizer Form */}
            {isEditingEventOrganizers && currentEventOrganizer && (
              <Card className="bg-black/30 border-purple-500/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-purple-300">
                    {currentEventOrganizer.member.id ? 'Edit Event Organizer' : 'Add New Event Organizer'}
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Category: {eventOrganizers.categories.find(cat => cat.id === currentEventOrganizer.categoryId)?.name || currentEventOrganizer.categoryId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-purple-300">Name *</Label>
                      <Input
                        value={currentEventOrganizer.member.name || ''}
                        onChange={(e) => setCurrentEventOrganizer(prev => ({
                          ...prev!,
                          member: { ...prev!.member, name: e.target.value }
                        }))}
                        className="bg-black/50 border-purple-500/30 text-white"
                        placeholder="Enter organizer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-purple-300">Role *</Label>
                      <Input
                        value={currentEventOrganizer.member.role || ''}
                        onChange={(e) => setCurrentEventOrganizer(prev => ({
                          ...prev!,
                          member: { ...prev!.member, role: e.target.value }
                        }))}
                        className="bg-black/50 border-purple-500/30 text-white"
                        placeholder="Enter organizer role"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveEventOrganizer}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                    >
                      <span className="mr-2">💾</span>
                      {isLoading ? 'Saving...' : 'Save Organizer'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingEventOrganizers(false)
                        setCurrentEventOrganizer(null)
                      }}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <span className="mr-2">❌</span>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Organizers Categories */}
            <div className="space-y-6">
              {eventOrganizers.categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-purple-300">{category.name}</h3>
                    <Button
                      onClick={() => handleAddEventOrganizer(category.id)}
                      disabled={isLoading}
                      size="sm"
                      className={`bg-gradient-to-r ${getCategoryButtonClass(category.color)} text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0`}
                    >
                      <span className="mr-1">➕</span>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {category.members.map((member, index) => (
                      <div key={member.id} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-purple-500/20">
                        <div className="flex-shrink-0">
                          <div className={`w-6 h-6 ${getCategoryColorClass(category.color)} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-purple-300">{member.name}</h4>
                              {member.role && (
                                <p className="text-sm text-purple-200">{member.role}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleEditEventOrganizer(category.id, member)}
                                disabled={isLoading}
                                size="sm"
                                className={`bg-gradient-to-r ${getCategoryButtonClass(category.color)} text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0`}
                              >
                                <span className="mr-1">✏️</span>
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteEventOrganizer(category.id, member.id)}
                                disabled={isLoading}
                                size="sm"
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                              >
                                <span className="mr-1">🗑️</span>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {category.members.length === 0 && (
                      <div className="text-center py-4 text-purple-400 bg-black/10 rounded-lg">
                        No {category.name.toLowerCase()} found. Click "Add" to get started.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Team Button */}
        <div className="mb-6">
          <Button
            onClick={handleAddTeam}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
          >
            <span className="mr-2">➕</span>
            Add New Team
          </Button>
        </div>

        {/* Team Form Modal */}
        {isEditing && (
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-6">
            <CardHeader>
              <CardTitle className="text-purple-300">
                {currentTeam?.id ? 'Edit Team' : 'Add New Team'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">Team Name *</Label>
                  <Input
                    value={currentTeam?.name || ''}
                    onChange={(e) => setCurrentTeam(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="Enter team name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Project Title *</Label>
                  <Input
                    value={currentTeam?.projectTitle || ''}
                    onChange={(e) => setCurrentTeam(prev => ({ ...prev, projectTitle: e.target.value }))}
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="Enter project title"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Status</Label>
                  <Select
                    value={currentTeam?.status || 'pending'}
                    onValueChange={(value) => setCurrentTeam(prev => ({ ...prev, status: value as Team['status'] }))}
                  >
                    <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Number of Members</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={currentTeam?.members || 1}
                    onChange={(e) => setCurrentTeam(prev => ({ ...prev, members: parseInt(e.target.value) || 1 }))}
                    className="bg-black/50 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveTeam}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  <span className="mr-2">💾</span>
                  {isLoading ? 'Saving...' : 'Save Team'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setCurrentTeam(null)
                  }}
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <span className="mr-2">❌</span>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teams Table */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-300">Registered Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left p-4 text-purple-300">Team Name</th>
                    <th className="text-left p-4 text-purple-300">Project Title</th>
                    <th className="text-left p-4 text-purple-300">Status</th>
                    <th className="text-left p-4 text-purple-300">Members</th>
                    <th className="text-left p-4 text-purple-300">Submitted</th>
                    <th className="text-left p-4 text-purple-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b border-purple-500/20 hover:bg-purple-900/20">
                      <td className="p-4 text-purple-200">{team.name}</td>
                      <td className="p-4 text-purple-200">{team.projectTitle}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(team.status)}>
                          {team.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4 text-purple-200">{team.members}</td>
                      <td className="p-4 text-purple-200">{team.submittedAt}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditTeam(team)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                          >
                            <span className="mr-1">✏️</span>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteTeam(team.id)}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                          >
                            <span className="mr-1">🗑️</span>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {teams.length === 0 && (
                <div className="text-center py-8 text-purple-400">
                  No teams registered yet. Click "Add New Team" to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Us Control Section */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Us Control
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Manage contact information displayed on the Contact Us section
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsEditingContactInfo(!isEditingContactInfo)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  {isEditingContactInfo ? (
                    <>
                      <span className="mr-2">❌</span>
                      Cancel
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✏️</span>
                      Edit Contact Info
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingContactInfo ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">Email Address</Label>
                  <Input
                    value={newContactInfo.email}
                    onChange={(e) => setNewContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@example.com"
                    className="bg-black/20 border-purple-500/50 text-white placeholder-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Social Media Links</Label>
                  <SocialMediaManager
                    socialMediaLinks={newContactInfo.socialMedia}
                    onChange={(links) => setNewContactInfo(prev => ({ ...prev, socialMedia: links }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Description</Label>
                  <Textarea
                    value={newContactInfo.description}
                    onChange={(e) => setNewContactInfo(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Have questions about InnoQuest 2025? Reach out to our team..."
                    className="bg-black/20 border-purple-500/50 text-white placeholder-purple-400 min-h-[100px]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpdateContactInfo}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                  >
                    <span className="mr-2">💾</span>
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingContactInfo(false)
                      setNewContactInfo(contactInfo)
                    }}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                  >
                    <span className="mr-2">❌</span>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-purple-300">Email Address:</Label>
                  <div className="mt-2 p-3 bg-black/20 rounded border border-purple-500/30">
                    <p className="text-purple-300">{contactInfo.email}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-purple-300">Social Media:</Label>
                  <div className="mt-2 p-3 bg-black/20 rounded border border-purple-500/30">
                    {contactInfo.socialMedia && contactInfo.socialMedia.length > 0 ? (
                      <div className="space-y-2">
                        {contactInfo.socialMedia.map((social, index) => {
                          const platform = socialMediaPlatforms.find(p => p.id === social.platform)
                          return (
                            <div key={index} className="flex items-center gap-2 text-purple-300">
                              <span>{platform?.icon || <Globe className="w-5 h-5" />}</span>
                              <span className="font-medium">{platform?.name || 'Social Media'}:</span>
                              <span>{social.handle}</span>
                              {social.url && (
                                <a 
                                  href={social.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 ml-1"
                                >
                                  🔗
                                </a>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-purple-400">No social media links added</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-purple-300">Description:</Label>
                  <div className="mt-2 p-3 bg-black/20 rounded border border-purple-500/30">
                    <p className="text-purple-300">{contactInfo.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-purple-200">
                    Status: Active
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Change Modal */}
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">Current Password</Label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="bg-black/50 border-purple-500/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-black/50 border-purple-500/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-black/50 border-purple-500/30 text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                  >
                    <span className="mr-2">🔐</span>
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordChange(false)}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <span className="mr-2">❌</span>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}