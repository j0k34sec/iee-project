'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScaleIn, FadeIn } from '@/components/animations'
import { Bell, X, Menu, Rocket } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  href: string
  description?: string
}

interface Announcement {
  id: string
  title: string
  content: string
  priority: number
  createdAt: string
  updatedAt: string
}

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [readAnnouncements, setReadAnnouncements] = useState<Set<string>>(new Set())

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '#home',
      description: 'Back to main page'
    },
    {
      id: 'about',
      label: 'About',
      href: '#about',
      description: 'Learn about InnoQuest'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      href: '#timeline',
      description: 'Event schedule and phases'
    },
    {
      id: 'teams',
      label: 'Teams',
      href: '#teams',
      description: 'Shortlisted candidates'
    },
    {
      id: 'core-team',
      label: 'Core Team',
      href: '#core-team',
      description: 'Meet our organizers'
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '#contact',
      description: 'Get in touch'
    }
  ]

  useEffect(() => {
    // Load read announcements from localStorage on component mount
    const savedReadAnnouncements = localStorage.getItem('readAnnouncements')
    if (savedReadAnnouncements) {
      try {
        const parsed = JSON.parse(savedReadAnnouncements)
        setReadAnnouncements(new Set(parsed))
      } catch (error) {
        console.error('Failed to parse read announcements from localStorage:', error)
        setReadAnnouncements(new Set())
      }
    }
    
    fetchAnnouncements()
    
    // Set up periodic refresh for new announcements
    const interval = setInterval(fetchAnnouncements, 60000) // Refresh every minute
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Update unread count when announcements or readAnnouncements change
    const unread = announcements.filter(announcement => 
      !readAnnouncements.has(announcement.id)
    ).length
    setUnreadCount(unread)
  }, [announcements, readAnnouncements])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      const data = await response.json()
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements)
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    }
  }

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setActiveItem(href)
    setIsMenuOpen(false)
  }

  const handleNavClick = (item: NavItem) => {
    scrollToSection(item.href)
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'bg-red-600'
      case 2: return 'bg-yellow-600'
      default: return 'bg-blue-600'
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 3: return 'Urgent'
      case 2: return 'High'
      default: return 'Normal'
    }
  }

  const toggleAnnouncements = () => {
    setIsAnnouncementsOpen(!isAnnouncementsOpen)
    // Mark all as read when opened
    if (!isAnnouncementsOpen) {
      markAllAsRead()
    }
  }

  const markAllAsRead = () => {
    // Mark all current announcements as read
    const newReadAnnouncements = new Set(readAnnouncements)
    announcements.forEach(announcement => {
      newReadAnnouncements.add(announcement.id)
    })
    setReadAnnouncements(newReadAnnouncements)
    setUnreadCount(0)
    
    // Save to localStorage
    localStorage.setItem('readAnnouncements', JSON.stringify(Array.from(newReadAnnouncements)))
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-purple-950/90 via-blue-950/80 to-black/90 backdrop-blur-lg border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <ScaleIn delay={0.1}>
              <div className="flex items-center gap-3 transform transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)] cursor-default">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg hidden sm:block">InnoQuest 2025</span>
              </div>
            </ScaleIn>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <ScaleIn key={item.id} delay={0.1 + index * 0.05}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavClick(item)}
                  className={`
                    relative group px-4 py-2 h-9
                    bg-transparent
                    backdrop-blur-sm
                    border border-transparent hover:border-purple-400/30
                    text-purple-200 hover:text-white
                    transition-all duration-500
                    hover:bg-purple-900/20 hover:scale-105
                    hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]
                    rounded-md font-medium text-sm
                    overflow-hidden
                    ${activeItem === item.href 
                      ? 'bg-purple-900/30 border-purple-400/40 text-white shadow-purple-500/20' 
                      : ''
                    }
                  `}
                  title={item.description}
                >
                  {/* Subtle background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <span className="font-medium tracking-tight">{item.label}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {activeItem === item.href && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 shadow-lg shadow-purple-400/30"></div>
                  )}
                </Button>
              </ScaleIn>
            ))}
          </div>

          {/* Right side - Announcements and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Announcements Bell */}
            <ScaleIn delay={0.4}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAnnouncements}
                className="relative p-2 hover:bg-purple-900/20 transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]"
              >
                <Bell className="w-6 h-6 text-purple-300" />
                
                {/* Notification badge */}
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-red-600 hover:bg-red-700 animate-pulse"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </ScaleIn>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <ScaleIn delay={0.5}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative p-2 hover:bg-purple-900/20 transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </ScaleIn>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-500/20 bg-gradient-to-br from-purple-950/95 via-blue-950/90 to-black/95 backdrop-blur-lg">
            <ScaleIn>
              <div className="p-2 space-y-1">
                {navItems.map((item, index) => (
                  <FadeIn key={item.id} delay={index * 0.05}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavClick(item)}
                      className={`
                        w-full justify-start px-4 py-3 h-auto
                        bg-gradient-to-r from-purple-950/60 via-blue-950/40 to-black/60 hover:from-purple-900/50 hover:via-blue-900/30 hover:to-black/50
                        backdrop-blur-sm
                        text-purple-200 hover:text-white
                        transition-all duration-500
                        hover:scale-105
                        hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]
                        rounded-md font-medium text-sm border border-purple-500/10 hover:border-purple-400/30
                        ${activeItem === item.href 
                          ? 'bg-purple-900/60 border-purple-400/40 text-white shadow-purple-500/20' 
                          : ''
                        }
                      `}
                    >
                      <div className="flex items-center w-full">
                        <span className="font-medium tracking-tight">{item.label}</span>
                      </div>
                    </Button>
                  </FadeIn>
                ))}
              </div>
            </ScaleIn>
          </div>
        )}
      </div>

      {/* Announcements Dropdown */}
      {isAnnouncementsOpen && (
        <div className="absolute right-4 top-full mt-2 w-80 max-h-96 bg-black/95 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-2xl z-50 overflow-hidden">
          <ScaleIn>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-purple-300 text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Announcements
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-purple-400 hover:text-white text-xs h-6 px-2"
                      title="Mark all as read"
                    >
                      ✓ Read all
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAnnouncements}
                    className="text-purple-400 hover:text-white h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-purple-400 text-sm mb-3">
                Latest updates and notifications
              </p>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-purple-400 text-sm">No announcements</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-3 border-b border-purple-500/20 last:border-b-0 hover:bg-purple-900/20 transition-colors duration-200 rounded-md mb-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getPriorityColor(announcement.priority)}`}></div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-purple-200 font-semibold text-sm truncate">
                              {announcement.title}
                            </h4>
                            <Badge 
                              variant="secondary"
                              className={`text-xs ${getPriorityColor(announcement.priority)} hover:opacity-80`}
                            >
                              {getPriorityLabel(announcement.priority)}
                            </Badge>
                          </div>
                          <p className="text-purple-300 text-xs leading-relaxed mb-2 line-clamp-2">
                            {announcement.content}
                          </p>
                          <p className="text-purple-400 text-xs">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScaleIn>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </nav>
  )
}