'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDisplayDate, parseHackathonDate } from '@/lib/config-utils'
import TimelineChart from '@/components/timeline-chart'
import ShortlistedCandidates from '@/components/shortlisted-candidates'
import Navbar from '@/components/navbar'
import AnimatedBackground from '@/components/animated-background'
import FloatingShapes from '@/components/floating-shapes'
import ParallaxSection from '@/components/parallax-section'
import EnhancedCard, { EnhancedCardHeader, EnhancedCardTitle, EnhancedCardDescription, EnhancedCardContent } from '@/components/enhanced-card'
import AnimatedPattern from '@/components/animated-pattern'
import { FadeIn, SlideInLeft, SlideInRight, ScaleIn, StaggerContainer, StaggerItem, PulseNumber, HoverCard, AnimatedButton, AnimatedRegisterButton, AnimatedRegisterButtonSubtle } from '@/components/animations'
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
  ExternalLink,
  Mail,
  Rocket,
  Users,
  Lightbulb,
  Target,
  Star,
  Zap,
  Play,
  Wrench,
  BookOpen,
  Trophy,
  ArrowUpRight,
  Clock
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

interface CoreTeamMember {
  id: string
  name: string
  role: string
  linkedinUrl?: string
}

interface EventOrganizerCategory {
  id: string
  name: string
  color: string
  members: Array<{ id: string; name: string; role: string }>
}

interface EventOrganizers {
  categories: EventOrganizerCategory[]
}

interface EventOrganizerMember {
  id: string
  name: string
  role: string
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  const [countdownConfig, setCountdownConfig] = useState({
    targetDate: "",
    targetTime: "",
    isActive: false,
    customMessage: "Countdown to Launch"
  })
  
  const [isCountdownConfigured, setIsCountdownConfigured] = useState(false)
  
  const [teams, setTeams] = useState<Team[]>([])

  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>([])

  const [coreTeam, setCoreTeam] = useState<CoreTeamMember[]>([])

  const [eventOrganizers, setEventOrganizers] = useState<EventOrganizers>({
    categories: []
  })

  const [registrationLink, setRegistrationLink] = useState("https://forms.google.com/example")
  const [contactInfo, setContactInfo] = useState({
    email: 'innoquest2025@example.com',
    socialMedia: [],
    description: 'Have questions about InnoQuest 2025? Reach out to our team and we\'ll be happy to help you on your journey to innovation!'
  })

  useEffect(() => {
    let targetDate: number
    
    const updateCountdown = () => {
      if (!isCountdownConfigured) {
        // Show 0000 when countdown is not configured
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      
      const now = new Date().getTime()
      const difference = targetDate - now
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        // Hackathon has started
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    // Function to update target date from countdown config
    const updateTargetDate = () => {
      if (countdownConfig.isActive && isCountdownConfigured) {
        targetDate = parseHackathonDate(countdownConfig.targetDate, countdownConfig.targetTime)
      } else {
        // Don't use config fallback when not configured - this ensures 0000 display
        targetDate = 0
      }
    }
    
    updateTargetDate()
    updateCountdown()
    const timer = setInterval(() => {
      updateCountdown()
    }, 1000)
    
    return () => clearInterval(timer)
  }, [countdownConfig, isCountdownConfigured])

  useEffect(() => {
    // Fetch teams, timeline, countdown, core team, and event organizers from API
    const fetchData = async () => {
      try {
        const [teamsResponse, timelineResponse, countdownResponse, coreTeamResponse, eventOrganizersResponse, registrationLinkResponse, contactInfoResponse] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/timeline'),
          fetch('/api/countdown'),
          fetch('/api/core-team'),
          fetch('/api/event-organizers'),
          fetch('/api/registration-link'),
          fetch('/api/contact-us')
        ])
        
        const teamsData = await teamsResponse.json()
        const timelineData = await timelineResponse.json()
        const countdownData = await countdownResponse.json()
        const coreTeamData = await coreTeamResponse.json()
        const eventOrganizersData = await eventOrganizersResponse.json()
        const registrationLinkData = await registrationLinkResponse.json()
        const contactInfoData = await contactInfoResponse.json()
        
        setTeams(teamsData.teams || [])
        setTimelinePhases(timelineData.phases || [])
        
        if (countdownData.success && countdownData.countdown) {
          setCountdownConfig(countdownData.countdown)
          // Check if countdown is properly configured with valid date
          const isValidConfig = countdownData.countdown.isActive && 
                               countdownData.countdown.targetDate && 
                               countdownData.countdown.targetTime &&
                               countdownData.countdown.targetDate.trim() !== "" &&
                               countdownData.countdown.targetTime.trim() !== ""
          setIsCountdownConfigured(isValidConfig)
        } else {
          setIsCountdownConfigured(false)
        }
        
        if (coreTeamData.success && coreTeamData.coreTeam) {
          setCoreTeam(coreTeamData.coreTeam)
        }
        
        if (eventOrganizersData.success && eventOrganizersData.eventOrganizers) {
          setEventOrganizers(eventOrganizersData.eventOrganizers)
        }
        
        if (registrationLinkData.success && registrationLinkData.registrationLink) {
          setRegistrationLink(registrationLinkData.registrationLink)
        }
        
        if (contactInfoData.success && contactInfoData.contactInfo) {
          // Parse social media if it's a string, otherwise use as-is
          const parsedContactInfo = {
            ...contactInfoData.contactInfo,
            socialMedia: typeof contactInfoData.contactInfo.socialMedia === 'string' 
              ? JSON.parse(contactInfoData.contactInfo.socialMedia) 
              : (Array.isArray(contactInfoData.contactInfo.socialMedia) ? contactInfoData.contactInfo.socialMedia : [contactInfoData.contactInfo.socialMedia])
          }
          setContactInfo(parsedContactInfo)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    
    fetchData()
    
    // Set up periodic refresh for auto-updates
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  // Get the formatted display date from countdown config
  const targetDateDisplay = countdownConfig.isActive && countdownConfig.targetDate && countdownConfig.targetTime
    ? formatDisplayDate(parseHackathonDate(countdownConfig.targetDate, countdownConfig.targetTime))
    : "Not set"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <AnimatedBackground />
      <FloatingShapes />
      <AnimatedPattern />
      
      {/* Custom styles for animated gradient */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Unified Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <ParallaxSection speed={0.3}>
        <div id="home" className="relative overflow-hidden pt-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative container mx-auto px-4 py-16 text-center">
            <FadeIn delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x transform transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.6)] cursor-default animate-float">
                InnoQuest: Hackathon 2025
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-xl md:text-2xl mb-8 text-purple-200 animate-float" style={{ animationDelay: '0.5s' }}>
                Innovate Beyond Stars. Code the Cosmos.
              </p>
            </FadeIn>
          
          {/* Countdown Timer */}
          <FadeIn delay={0.5}>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-3">
                <Clock className="w-8 h-8 text-purple-400" />
                {countdownConfig.customMessage}
              </h2>
              <div className="mb-4">
                <p className="text-purple-200 text-sm">
                  {isCountdownConfigured 
                    ? `Target Date: ${targetDateDisplay}` 
                    : <span className="text-purple-400 italic">Countdown not configured</span>
                  }
                </p>
              </div>
              <div className="flex justify-center gap-4 md:gap-8">
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <div key={unit} className="text-center">
                    <PulseNumber>
                      <div className={`bg-black/40 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px] border transition-all duration-300 ${
                        isCountdownConfigured 
                          ? 'border-purple-500/30 hover:border-purple-400/50' 
                          : 'border-purple-500/10 opacity-60'
                      }`}>
                        <div className={`text-3xl md:text-4xl font-bold ${
                          isCountdownConfigured ? 'text-purple-300' : 'text-purple-400'
                        }`}>
                          {isCountdownConfigured ? value.toString().padStart(2, '0') : '00'}
                        </div>
                        <div className={`text-sm md:text-base mt-2 capitalize ${
                          isCountdownConfigured ? 'text-purple-200' : 'text-purple-400'
                        }`}>
                          {unit}
                        </div>
                      </div>
                    </PulseNumber>
                  </div>
                ))}
              </div>
              {!isCountdownConfigured && (
                <div className="mt-4 text-center">
                  <p className="text-purple-400 text-sm italic">
                    Please configure countdown settings in admin dashboard
                  </p>
                </div>
              )}
            </div>
          </FadeIn>
          
          {/* Register Button */}
          <AnimatedRegisterButtonSubtle>
            <Button 
              size="lg" 
              className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold py-5 px-10 text-xl rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 border-2 border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm"
              onClick={() => window.open(registrationLink, '_blank')}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                <span>Register Now</span>
                <Play className="w-6 h-6 text-white transform rotate-[-30deg]" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </AnimatedRegisterButtonSubtle>
        </div>
      </div>
      </ParallaxSection>

      {/* About Us Section */}
      <ParallaxSection speed={0.2}>
        <section id="about" className="py-16 bg-black/40">
        <div className="container mx-auto px-4">
          <FadeIn delay={0.7}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3">
                <Rocket className="w-10 h-10 text-purple-400" />
                About Us
                <Star className="w-8 h-8 text-purple-400" />
              </h2>
              <p className="text-lg md:text-xl text-purple-200 leading-relaxed mb-8">
                InnoQuest isn't just a hackathon – it's a launchpad for aspiring innovators and tech visionaries to solve real-world challenges through futuristic, space-inspired solutions.
              </p>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <EnhancedCard hoverScale={1.08} glowColor="rgba(139, 92, 246, 0.4)">
                  <EnhancedCardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <EnhancedCardTitle className="text-center">Innovation</EnhancedCardTitle>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <EnhancedCardDescription className="text-center">
                      Pushing boundaries with creative solutions and cutting-edge technology
                    </EnhancedCardDescription>
                  </EnhancedCardContent>
                </EnhancedCard>
                
                <EnhancedCard hoverScale={1.08} glowColor="rgba(59, 130, 246, 0.4)">
                  <EnhancedCardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow" style={{ animationDelay: '0.2s' }}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <EnhancedCardTitle className="text-center">Collaboration</EnhancedCardTitle>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <EnhancedCardDescription className="text-center">
                      Bringing together diverse minds to create something extraordinary
                    </EnhancedCardDescription>
                  </EnhancedCardContent>
                </EnhancedCard>
                
                <EnhancedCard hoverScale={1.08} glowColor="rgba(139, 92, 246, 0.4)">
                  <EnhancedCardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow" style={{ animationDelay: '0.4s' }}>
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <EnhancedCardTitle className="text-center">Impact</EnhancedCardTitle>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <EnhancedCardDescription className="text-center">
                      Creating solutions that make a real difference in the world
                    </EnhancedCardDescription>
                  </EnhancedCardContent>
                </EnhancedCard>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      </ParallaxSection>

      {/* Core Team Section */}
      <ParallaxSection speed={0.15}>
        <section id="core-team" className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn delay={0.9}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transform transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.6)] cursor-default">Core Team</h2>
          </FadeIn>
          <StaggerContainer delay={1.0}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {coreTeam.map((member, index) => (
                <StaggerItem key={index}>
                  <HoverCard>
                    {member.linkedinUrl ? (
                      <a 
                        href={member.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="group bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden cursor-pointer">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <CardHeader className="relative z-10 pb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-grow">
                                <CardTitle className="text-purple-300 group-hover:text-white transition-colors duration-300 text-lg flex items-center gap-2">
                                  {member.name}
                                  <span className="text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    🔗
                                  </span>
                                </CardTitle>
                                <CardDescription className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">{member.role}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </a>
                    ) : (
                      <Card className="group bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardHeader className="relative z-10 pb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow">
                              <CardTitle className="text-purple-300 group-hover:text-white transition-colors duration-300 text-lg">{member.name}</CardTitle>
                              <CardDescription className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">{member.role}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    )}
                  </HoverCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Event Organizers Section */}
      <section className="py-16 bg-black/40">
        <div className="container mx-auto px-4">
          <FadeIn delay={1.2}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transform transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.6)] cursor-default">Event Organizers & Support</h2>
          </FadeIn>
          
          <StaggerContainer delay={1.3}>
            <div className="max-w-6xl mx-auto space-y-8">
              {eventOrganizers.categories.map((category) => (
                <StaggerItem key={category.id}>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></span>
                      {category.name}:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.members.map((member) => (
                        <HoverCard key={member.id}>
                          <Card className="group bg-gradient-to-br from-black/30 to-purple-900/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20">
                            <CardContent className="p-4 relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-grow">
                                  <p className="text-purple-200 group-hover:text-white transition-colors duration-300 font-medium">
                                    {member.name}
                                  </p>
                                  {member.role && (
                                    <p className="text-purple-300/80 group-hover:text-purple-200/90 transition-colors duration-300 text-sm">
                                      {member.role}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </HoverCard>
                      ))}
                      {category.members.length === 0 && (
                        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 border-dashed">
                          <CardContent className="p-4 text-center">
                            <p className="text-purple-400 italic">No {category.name.toLowerCase()} listed</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn delay={1.5}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 transform transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.6)] cursor-default">Why Join Us?</h2>
              <p className="text-xl mb-8 text-purple-200 font-semibold">
                Motto: Code. Collaborate. Conquer the Cosmos.
              </p>
              <p className="text-lg text-purple-100 mb-8 leading-relaxed">
                Join InnoQuest 2025 to push your limits, collaborate with brilliant minds, and engineer solutions that are truly out of this world.
              </p>
            </div>
          </FadeIn>
          
          <StaggerContainer delay={1.6}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {['Build', 'Learn', 'Compete', 'Launch'].map((item, index) => (
                <StaggerItem key={index}>
                  <HoverCard>
                    <div className="group relative h-full bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-purple-900/30 rounded-2xl p-8 text-center border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 backdrop-blur-sm overflow-hidden">
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-purple-600/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex-1">
                          <div className="bg-gradient-to-br from-purple-600/40 via-blue-600/30 to-purple-600/40 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-purple-500/40 border border-purple-400/30">
                            <span className="text-4xl text-white group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                              {index === 0 ? <Wrench className="w-10 h-10" /> : 
                               index === 1 ? <BookOpen className="w-10 h-10" /> : 
                               index === 2 ? <Trophy className="w-10 h-10" /> : 
                               <ArrowUpRight className="w-10 h-10" />}
                            </span>
                          </div>
                          <p className="text-purple-100 font-bold text-xl leading-tight group-hover:text-white transition-colors duration-300 mb-3 whitespace-nowrap">
                            {item}
                          </p>
                        </div>
                        
                        {/* Decorative bottom line */}
                        <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full group-hover:via-purple-400/70 transition-all duration-300"></div>
                      </div>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
      </ParallaxSection>

      {/* Hackathon Timeline Section */}
      <ParallaxSection speed={0.1}>
        <section id="timeline" className="py-16 bg-black/40">
        <div className="container mx-auto px-4">
          <FadeIn delay={1.8}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 transform transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.6)] cursor-default">Hackathon Timeline</h2>
          </FadeIn>
          
          <ScaleIn delay={1.9}>
            <TimelineChart phases={timelinePhases} />
          </ScaleIn>
          
          <StaggerContainer delay={2.0}>
            <div className="max-w-4xl mx-auto mt-12">
              <div className="space-y-6">
                {timelinePhases.map((phase, index) => (
                  <StaggerItem key={index}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-700 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-110">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <HoverCard>
                          <Card className="group bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-purple-300 group-hover:text-white transition-colors duration-300 text-lg">{phase.phase}</CardTitle>
                                {phase.status === 'completed' && (
                                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">✓ Completed</Badge>
                                )}
                                {phase.status === 'current' && (
                                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg animate-pulse">🔄 In Progress</Badge>
                                )}
                                {phase.status === 'upcoming' && (
                                  <Badge variant="secondary" className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Upcoming
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300 leading-relaxed">{phase.description}</p>
                            </CardContent>
                          </Card>
                        </HoverCard>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </div>
          </StaggerContainer>
        </div>
      </section>
      </ParallaxSection>

      {/* Shortlisted Candidates Section */}
      <ParallaxSection speed={0.05}>
        <section id="teams" className="py-24 mb-16">
        <div className="container mx-auto px-4">
          <FadeIn delay={2.2}>
            <ShortlistedCandidates teams={teams} />
          </FadeIn>
        </div>
      </section>
      </ParallaxSection>

      {/* Contact Section */}
      <ParallaxSection speed={0.08}>
        <section id="contact" className="py-24 mt-16 bg-black/40">
        <div className="container mx-auto px-4">
          <FadeIn delay={2.3}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 transform transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.6)] cursor-default">Contact Us</h2>
              <p className="text-lg md:text-xl text-purple-200 leading-relaxed mb-8">
                {contactInfo.description}
              </p>
              
                      {/* Contact Icons Section */}
              <div className="flex justify-center items-center gap-8 mt-12">
                {/* Email Icon */}
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="group flex flex-col items-center gap-2 transform transition-all duration-500 hover:scale-110"
                  title={`Email: ${contactInfo.email}`}
                >
                  <Mail className="w-10 h-10 text-purple-300 group-hover:text-white transition-colors" />
                  <span className="text-xs text-purple-400 group-hover:text-purple-200 transition-colors opacity-0 group-hover:opacity-100">
                    Email
                  </span>
                </a>
                
                {/* Social Media Icons - Only shown when social media links exist */}
                {contactInfo.socialMedia && contactInfo.socialMedia.length > 0 && (
                  contactInfo.socialMedia.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 transform transition-all duration-500 hover:scale-110"
                      title={`${social.platform}: ${social.handle}`}
                    >
                      <span className="text-purple-300 group-hover:text-white transition-colors">
                        {social.platform === 'instagram' ? <Instagram className="w-10 h-10" /> :
                         social.platform === 'linkedin' ? <Linkedin className="w-10 h-10" /> :
                         social.platform === 'twitter' ? <Twitter className="w-10 h-10" /> :
                         social.platform === 'facebook' ? <Facebook className="w-10 h-10" /> :
                         social.platform === 'youtube' ? <Youtube className="w-10 h-10" /> :
                         social.platform === 'tiktok' ? <Music className="w-10 h-10" /> :
                         social.platform === 'github' ? <Github className="w-10 h-10" /> :
                         social.platform === 'discord' ? <MessageCircle className="w-10 h-10" /> :
                         social.platform === 'telegram' ? <Send className="w-10 h-10" /> :
                         social.platform === 'website' ? <Globe className="w-10 h-10" /> : <Globe className="w-10 h-10" />}
                      </span>
                      <span className="text-xs text-purple-400 group-hover:text-purple-200 transition-colors opacity-0 group-hover:opacity-100 capitalize">
                        {social.platform}
                      </span>
                    </a>
                  ))
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      </ParallaxSection>

      {/* Footer */}
      <footer className="py-8 bg-black/50 text-center">
        <div className="container mx-auto px-4">
          <FadeIn delay={2.4}>
            <p className="text-purple-200">
              © 2025 InnoQuest Hackathon. Innovate Beyond Stars. Code the Cosmos.
            </p>
          </FadeIn>
        </div>
      </footer>
    </div>
  )
}