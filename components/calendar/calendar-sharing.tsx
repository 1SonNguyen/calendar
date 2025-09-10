"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCalendar } from "./calendar-context"
import { 
  Share2, 
  Link, 
  Users, 
  Eye,
  EyeOff,
  Copy,
  Check,
  Globe,
  Lock,
  UserPlus,
  Settings
} from "lucide-react"

interface SharedCalendar {
  id: string
  name: string
  permissions: "view" | "edit" | "admin"
  visibility: "public" | "private" | "team"
  sharedWith: string[]
  shareLink?: string
}

export function CalendarSharing() {
  const { calendars } = useCalendar()
  const [activeShares, setActiveShares] = useState<SharedCalendar[]>([
    {
      id: "work",
      name: "Work Calendar",
      permissions: "view",
      visibility: "team",
      sharedWith: ["team@company.com"],
      shareLink: "https://cal.app/share/work-calendar-abc123"
    }
  ])
  const [showShareForm, setShowShareForm] = useState<string | null>(null)
  const [shareEmail, setShareEmail] = useState("")
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const shareCalendar = (calendarId: string) => {
    if (shareEmail.trim()) {
      setActiveShares(prev => prev.map(share => 
        share.id === calendarId 
          ? { ...share, sharedWith: [...share.sharedWith, shareEmail.trim()] }
          : share
      ))
      setShareEmail("")
      setShowShareForm(null)
    }
  }

  const toggleVisibility = (calendarId: string) => {
    setActiveShares(prev => prev.map(share => 
      share.id === calendarId 
        ? { 
            ...share, 
            visibility: share.visibility === "private" ? "public" : "private"
          }
        : share
    ))
  }

  const copyShareLink = async (link: string, calendarId: string) => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLink(calendarId)
      setTimeout(() => setCopiedLink(null), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const generateShareLink = (calendarId: string) => {
    const newLink = `https://cal.app/share/${calendarId}-${Math.random().toString(36).substr(2, 9)}`
    setActiveShares(prev => prev.map(share => 
      share.id === calendarId 
        ? { ...share, shareLink: newLink }
        : share
    ))
  }

  const getVisibilityIcon = (visibility: SharedCalendar["visibility"]) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-3 w-3" />
      case "private":
        return <Lock className="h-3 w-3" />
      case "team":
        return <Users className="h-3 w-3" />
      default:
        return <Eye className="h-3 w-3" />
    }
  }

  const getVisibilityColor = (visibility: SharedCalendar["visibility"]) => {
    switch (visibility) {
      case "public":
        return "bg-green-100 text-green-800 border-green-200"
      case "private":
        return "bg-red-100 text-red-800 border-red-200"
      case "team":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPermissionColor = (permission: SharedCalendar["permissions"]) => {
    switch (permission) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "edit":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "view":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50 border-rose-200 dark:border-rose-800">
      <div className="flex items-center gap-2 mb-3">
        <Share2 className="h-4 w-4 text-rose-600" />
        <h3 className="font-medium text-rose-900 dark:text-rose-100">Calendar Sharing</h3>
        <Badge variant="secondary" className="text-xs">
          <Users className="h-3 w-3 mr-1" />
          Team
        </Badge>
      </div>

      <div className="space-y-3">
        {calendars.map((calendar) => {
          const shareInfo = activeShares.find(s => s.id === calendar.id)
          const isSharing = showShareForm === calendar.id

          return (
            <div key={calendar.id} className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-rose-100 dark:border-rose-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: calendar.color }}
                  />
                  <span className="font-medium text-sm">{calendar.name}</span>
                </div>
                {shareInfo && (
                  <div className="flex items-center gap-1">
                    <Badge className={`text-xs ${getVisibilityColor(shareInfo.visibility)}`}>
                      {getVisibilityIcon(shareInfo.visibility)}
                      <span className="ml-1 capitalize">{shareInfo.visibility}</span>
                    </Badge>
                    <Badge className={`text-xs ${getPermissionColor(shareInfo.permissions)}`}>
                      {shareInfo.permissions}
                    </Badge>
                  </div>
                )}
              </div>

              {shareInfo ? (
                <div className="space-y-2">
                  {shareInfo.sharedWith.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Shared with: {shareInfo.sharedWith.join(", ")}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(calendar.id)}
                      className="flex-1 h-7 text-xs"
                    >
                      {shareInfo.visibility === "private" ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                      {shareInfo.visibility === "private" ? "Make Public" : "Make Private"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShareForm(isSharing ? null : calendar.id)}
                      className="h-7 w-7 p-0"
                    >
                      <UserPlus className="h-3 w-3" />
                    </Button>
                  </div>

                  {shareInfo.shareLink ? (
                    <div className="flex gap-2">
                      <Input
                        value={shareInfo.shareLink}
                        readOnly
                        className="text-xs flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyShareLink(shareInfo.shareLink!, calendar.id)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedLink === calendar.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateShareLink(calendar.id)}
                      className="w-full h-7 text-xs"
                    >
                      <Link className="h-3 w-3 mr-1" />
                      Generate Share Link
                    </Button>
                  )}

                  {isSharing && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Input
                        placeholder="Enter email address"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && shareCalendar(calendar.id)}
                        className="text-xs flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => shareCalendar(calendar.id)}
                        disabled={!shareEmail.trim()}
                        className="h-8 bg-rose-600 hover:bg-rose-700"
                      >
                        Share
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveShares([...activeShares, {
                      id: calendar.id,
                      name: calendar.name,
                      permissions: "view",
                      visibility: "private",
                      sharedWith: []
                    }])
                  }}
                  className="w-full h-7 text-xs"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Start Sharing
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}