'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AnimatedButton } from '@/components/animations'
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
  ExternalLink
} from 'lucide-react'

interface SocialMediaLink {
  platform: string
  handle: string
  url?: string
}

interface SocialMediaPlatform {
  id: string
  name: string
  icon: React.ReactNode
  baseUrl?: string
  placeholder: string
  urlPlaceholder: string
  urlPattern?: RegExp
  extractHandle?: (url: string) => string
}

interface SocialMediaManagerProps {
  socialMediaLinks: SocialMediaLink[]
  onChange: (links: SocialMediaLink[]) => void
}

const socialMediaPlatforms: SocialMediaPlatform[] = [
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: <Instagram className="w-5 h-5" />, 
    baseUrl: 'https://instagram.com/', 
    placeholder: '@username',
    urlPlaceholder: 'https://instagram.com/username or @username',
    urlPattern: /^https?:\/\/(www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/)
      return match ? match[2] : url.replace('@', '')
    }
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: <Linkedin className="w-5 h-5" />, 
    baseUrl: 'https://linkedin.com/in/', 
    placeholder: 'profile-name',
    urlPlaceholder: 'https://linkedin.com/in/profile-name or profile-name',
    urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9-]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9-]+)/)
      return match ? match[2] : url
    }
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: <Twitter className="w-5 h-5" />, 
    baseUrl: 'https://twitter.com/', 
    placeholder: '@username',
    urlPlaceholder: 'https://twitter.com/username or @username',
    urlPattern: /^https?:\/\/(www\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?twitter\.com\/([a-zA-Z0-9_]+)/)
      return match ? match[2] : url.replace('@', '')
    }
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: <Facebook className="w-5 h-5" />, 
    baseUrl: 'https://facebook.com/', 
    placeholder: 'page-name',
    urlPlaceholder: 'https://facebook.com/page-name or page-name',
    urlPattern: /^https?:\/\/(www\.)?facebook\.com\/([a-zA-Z0-9.]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?facebook\.com\/([a-zA-Z0-9.]+)/)
      return match ? match[2] : url
    }
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: <Youtube className="w-5 h-5" />, 
    baseUrl: 'https://youtube.com/', 
    placeholder: 'channel-name',
    urlPlaceholder: 'https://youtube.com/channel-name or channel-name',
    urlPattern: /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|user\/)?([a-zA-Z0-9_-]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|user\/)?([a-zA-Z0-9_-]+)/)
      return match ? match[3] : url
    }
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: <Music className="w-5 h-5" />, 
    baseUrl: 'https://tiktok.com/@', 
    placeholder: '@username',
    urlPlaceholder: 'https://tiktok.com/@username or @username',
    urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9_.]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9_.]+)/)
      return match ? match[2] : url.replace('@', '')
    }
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    icon: <Github className="w-5 h-5" />, 
    baseUrl: 'https://github.com/', 
    placeholder: 'username',
    urlPlaceholder: 'https://github.com/username or username',
    urlPattern: /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)/)
      return match ? match[2] : url
    }
  },
  { 
    id: 'discord', 
    name: 'Discord Server', 
    icon: <MessageCircle className="w-5 h-5" />, 
    placeholder: 'server-invite',
    urlPlaceholder: 'https://discord.gg/invite-code or invite-code',
    urlPattern: /^https?:\/\/(www\.)?discord\.gg\/([a-zA-Z0-9]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?discord\.gg\/([a-zA-Z0-9]+)/)
      return match ? match[2] : url
    }
  },
  { 
    id: 'telegram', 
    name: 'Telegram', 
    icon: <Send className="w-5 h-5" />, 
    baseUrl: 'https://t.me/', 
    placeholder: '@username',
    urlPlaceholder: 'https://t.me/username or @username',
    urlPattern: /^https?:\/\/(www\.)?t\.me\/([a-zA-Z0-9_]+)/,
    extractHandle: (url: string) => {
      const match = url.match(/^https?:\/\/(www\.)?t\.me\/([a-zA-Z0-9_]+)/)
      return match ? match[2] : url.replace('@', '')
    }
  },
  { 
    id: 'website', 
    name: 'Website', 
    icon: <Globe className="w-5 h-5" />, 
    placeholder: 'https://example.com',
    urlPlaceholder: 'https://example.com',
    extractHandle: (url: string) => url
  }
]

export default function SocialMediaManager({ socialMediaLinks, onChange }: SocialMediaManagerProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [newInput, setNewInput] = useState<string>('')
  const [inputMode, setInputMode] = useState<'handle' | 'url'>('handle')

  const getAvailablePlatforms = () => {
    const usedPlatforms = socialMediaLinks.map(link => link.platform)
    return socialMediaPlatforms.filter(platform => !usedPlatforms.includes(platform.id))
  }

  const handleAddSocialMedia = () => {
    if (!selectedPlatform || !newInput.trim()) return

    const platform = socialMediaPlatforms.find(p => p.id === selectedPlatform)
    if (!platform) return

    let handle = newInput.trim()
    let url = newInput.trim()

    // If input is a URL and platform has URL pattern, extract handle
    if (platform.urlPattern && platform.urlPattern.test(url) && platform.extractHandle) {
      handle = platform.extractHandle(url)
    } else if (platform.baseUrl && !url.startsWith('http')) {
      // If input is not a URL, generate URL from handle
      url = platform.baseUrl + handle.replace('@', '')
    }

    const newLink: SocialMediaLink = {
      platform: selectedPlatform,
      handle,
      url
    }

    onChange([...socialMediaLinks, newLink])
    setSelectedPlatform('')
    setNewInput('')
    setInputMode('handle')
  }

  const handleRemoveSocialMedia = (index: number) => {
    const updatedLinks = socialMediaLinks.filter((_, i) => i !== index)
    onChange(updatedLinks)
  }

  const handleUpdateSocialMedia = (index: number, field: keyof SocialMediaLink, value: string) => {
    const updatedLinks = [...socialMediaLinks]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    
    // Auto-update URL if handle changes and platform has base URL
    if (field === 'handle') {
      const platform = socialMediaPlatforms.find(p => p.id === updatedLinks[index].platform)
      if (platform && platform.baseUrl && !value.startsWith('http')) {
        updatedLinks[index].url = platform.baseUrl + value.replace('@', '')
      } else if (platform && platform.extractHandle && value.startsWith('http')) {
        // If value is a URL, extract handle
        updatedLinks[index].handle = platform.extractHandle(value)
      }
    } else if (field === 'url') {
      // If URL changes, update handle if it's a valid URL
      const platform = socialMediaPlatforms.find(p => p.id === updatedLinks[index].platform)
      if (platform && platform.urlPattern && platform.urlPattern.test(value) && platform.extractHandle) {
        updatedLinks[index].handle = platform.extractHandle(value)
      }
    }
    
    onChange(updatedLinks)
  }

  return (
    <div className="space-y-4">
      {/* Add New Social Media */}
      <Card className="bg-black/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 text-lg">Add Social Media Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-300">Platform</Label>
                <Select value={selectedPlatform} onValueChange={(value) => {
                  setSelectedPlatform(value)
                  setNewInput('')
                  setInputMode('handle')
                }}>
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/50">
                    {getAvailablePlatforms().map((platform) => (
                      <SelectItem 
                        key={platform.id} 
                        value={platform.id}
                        className="text-white hover:bg-purple-900/50 focus:bg-purple-900/50"
                      >
                        <div className="flex items-center gap-2">
                          <span>{platform.icon}</span>
                          <span>{platform.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-purple-300">Input Mode</Label>
                <div className="flex gap-2">
                  <Button
                    variant={inputMode === 'handle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputMode('handle')}
                    className={inputMode === 'handle' ? 'bg-purple-600 text-white' : 'border-purple-500/50 text-purple-300'}
                  >
                    Handle
                  </Button>
                  <Button
                    variant={inputMode === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputMode('url')}
                    className={inputMode === 'url' ? 'bg-purple-600 text-white' : 'border-purple-500/50 text-purple-300'}
                  >
                    Full URL
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-purple-300">
                {selectedPlatform 
                  ? `${socialMediaPlatforms.find(p => p.id === selectedPlatform)?.name} ${inputMode === 'handle' ? 'Handle' : 'URL'}`
                  : inputMode === 'handle' ? 'Handle' : 'URL'
                }
              </Label>
              <Input
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
                placeholder={selectedPlatform 
                  ? (inputMode === 'handle' 
                    ? socialMediaPlatforms.find(p => p.id === selectedPlatform)?.placeholder || '@username'
                    : socialMediaPlatforms.find(p => p.id === selectedPlatform)?.urlPlaceholder || 'https://example.com')
                  : (inputMode === 'handle' ? '@username' : 'https://example.com')
                }
                className="bg-black/50 border-purple-500/30 text-white placeholder-purple-400"
                disabled={!selectedPlatform}
              />
              {selectedPlatform && inputMode === 'url' && (
                <p className="text-xs text-purple-400">
                  💡 Tip: You can paste the full profile URL (e.g., https://linkedin.com/in/your-profile) and we'll extract the handle automatically
                </p>
              )}
            </div>
            <AnimatedButton>
              <Button
                onClick={handleAddSocialMedia}
                disabled={!selectedPlatform || !newInput.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
              >
                <span className="mr-2">➕</span>
                Add Platform
              </Button>
            </AnimatedButton>
          </div>
        </CardContent>
      </Card>

      {/* Existing Social Media Links */}
      {socialMediaLinks.length > 0 && (
        <Card className="bg-black/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-300 text-lg">Current Social Media Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {socialMediaLinks.map((link, index) => {
                const platform = socialMediaPlatforms.find(p => p.id === link.platform)
                return (
                  <div key={index} className="p-4 bg-black/30 rounded-lg border border-purple-500/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{platform?.icon || '📱'}</span>
                        <div>
                          <h4 className="font-semibold text-purple-300">{platform?.name || 'Social Media'}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {link.platform}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRemoveSocialMedia(index)}
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-900/30"
                      >
                        <span className="mr-1">🗑️</span>
                        Remove
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-purple-300 text-sm">Handle</Label>
                        <Input
                          value={link.handle}
                          onChange={(e) => handleUpdateSocialMedia(index, 'handle', e.target.value)}
                          placeholder={platform?.placeholder || '@username'}
                          className="bg-black/50 border-purple-500/30 text-white placeholder-purple-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-purple-300 text-sm">Full URL</Label>
                        <Input
                          value={link.url || ''}
                          onChange={(e) => handleUpdateSocialMedia(index, 'url', e.target.value)}
                          placeholder="https://example.com"
                          className="bg-black/50 border-purple-500/30 text-white placeholder-purple-400"
                        />
                        <p className="text-xs text-purple-400">
                          💡 You can edit the URL directly or paste a full profile URL to update the handle
                        </p>
                      </div>
                      {link.url && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-sm">✓ URL will be clickable</span>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Preview
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {socialMediaLinks.length === 0 && (
        <div className="text-center py-8 text-purple-400 bg-black/10 rounded-lg border border-purple-500/20">
          <div className="text-4xl mb-2">📱</div>
          <p>No social media platforms added yet.</p>
          <p className="text-sm">Select a platform above to get started!</p>
        </div>
      )}
    </div>
  )
}