'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { ScaleIn, AnimatedButton } from '@/components/animations'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/teams?action=auth&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
      const data = await response.json()

      if (data.success) {
        // Store authentication in localStorage (in production, use more secure methods)
        localStorage.setItem('isAdminAuthenticated', 'true')
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        })
        router.push('/admin/dashboard')
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-black flex items-center justify-center p-4">
      <ScaleIn>
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-300">🛸 Admin Login</CardTitle>
            <CardDescription className="text-purple-200">
              Login to manage InnoQuest Hackathon 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-purple-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/50 border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400/60 transition-all duration-300"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-purple-500/30 text-white placeholder-purple-400 focus:border-purple-400/60 transition-all duration-300"
                  placeholder="Enter password"
                  required
                />
              </div>
              <AnimatedButton>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </AnimatedButton>
            </form>
          </CardContent>
        </Card>
      </ScaleIn>
    </div>
  )
}