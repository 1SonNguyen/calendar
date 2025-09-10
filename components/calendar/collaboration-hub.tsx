"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCalendar } from "./calendar-context"
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Bell, 
  Eye,
  Edit3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  Phone,
  Mail,
  FileText,
  Link,
  Zap,
  Globe,
  Lock,
  UserPlus,
  Settings
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface Collaboration {
  id: string
  type: "comment" | "edit" | "share" | "join" | "leave" | "status_change"
  user: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  eventId: string
  message?: string
  timestamp: Date
  metadata?: Record<string, any>
}

interface SharedCalendar {
  id: string
  name: string
  owner: string
  permissions: "view" | "edit" | "admin"
  members: {
    id: string
    name: string
    email: string
    role: string
    permissions: "view" | "edit" | "admin"
    status: "active" | "pending" | "declined"
    joinedAt: Date
  }[]
  visibility: "private" | "team" | "public"
  description: string
  color: string
}

interface LiveUpdate {
  id: string
  type: "event_created" | "event_updated" | "event_deleted" | "user_joined" | "user_left"
  user: string
  eventTitle?: string
  timestamp: Date
  calendarId: string
}

const mockCollaborations: Collaboration[] = [
  {
    id: "1",
    type: "comment",
    user: {
      id: "john-doe",
      name: "John Doe",
      email: "john@company.com",
      role: "Developer",
      avatar: "/placeholder-user.jpg"
    },
    eventId: "meeting-1",
    message: "Can we move this meeting 30 minutes later? I have a conflict.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: "2",
    type: "edit",
    user: {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Product Manager"
    },
    eventId: "meeting-1",
    message: "Updated meeting location to Conference Room B",
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: "3",
    type: "join",
    user: {
      id: "mike-chen",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Designer"
    },
    eventId: "meeting-1",
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  }
]

const mockSharedCalendars: SharedCalendar[] = [
  {
    id: "team-engineering",
    name: "Engineering Team",
    owner: "john@company.com",
    permissions: "edit",
    members: [
      {
        id: "1",
        name: "John Doe",
        email: "john@company.com",
        role: "Senior Developer",
        permissions: "admin",
        status: "active",
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: "2",
        name: "Alice Smith",
        email: "alice@company.com",
        role: "Frontend Developer",
        permissions: "edit",
        status: "active",
        joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        id: "3",
        name: "Bob Wilson",
        email: "bob@company.com",
        role: "Backend Developer",
        permissions: "edit",
        status: "pending",
        joinedAt: new Date()
      }
    ],
    visibility: "team",
    description: "Shared calendar for engineering team meetings and deadlines",
    color: "#3B82F6"
  },
  {
    id: "company-wide",
    name: "Company Events",
    owner: "admin@company.com",
    permissions: "view",
    members: [],
    visibility: "public",
    description: "Company-wide events, holidays, and announcements",
    color: "#10B981"
  }
]

const mockLiveUpdates: LiveUpdate[] = [
  {
    id: "1",
    type: "event_created",
    user: "Sarah Johnson",
    eventTitle: "Sprint Planning",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    calendarId: "team-engineering"
  },
  {
    id: "2",
    type: "user_joined",
    user: "Mike Chen",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    calendarId: "team-engineering"
  },
  {
    id: "3",
    type: "event_updated",
    user: "John Doe",
    eventTitle: "Daily Standup",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    calendarId: "team-engineering"
  }
]

export function CollaborationHub() {
  const { events } = useCalendar()
  const [activeTab, setActiveTab] = useState<"activity" | "shared" | "live">("activity")
  const [newComment, setNewComment] = useState("")
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>(mockLiveUpdates)

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      const updateTypes: LiveUpdate["type"][] = ["event_created", "event_updated", "user_joined"]
      const users = ["John Doe", "Sarah Johnson", "Mike Chen", "Alice Smith"]
      const eventTitles = ["Team Meeting", "Code Review", "Sprint Planning", "Daily Standup"]
      
      const newUpdate: LiveUpdate = {
        id: Date.now().toString(),
        type: updateTypes[Math.floor(Math.random() * updateTypes.length)],
        user: users[Math.floor(Math.random() * users.length)],
        eventTitle: Math.random() > 0.5 ? eventTitles[Math.floor(Math.random() * eventTitles.length)] : undefined,
        timestamp: new Date(),
        calendarId: "team-engineering"
      }
      
      setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 9)])
    }, 15000) // New update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getCollaborationIcon = (type: Collaboration["type"]) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case "edit":
        return <Edit3 className="h-4 w-4 text-green-600" />
      case "share":
        return <Share2 className="h-4 w-4 text-purple-600" />
      case "join":
        return <UserPlus className="h-4 w-4 text-emerald-600" />
      case "leave":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "status_change":
        return <Bell className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getVisibilityIcon = (visibility: SharedCalendar["visibility"]) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-3 w-3 text-green-600" />
      case "team":
        return <Users className="h-3 w-3 text-blue-600" />
      case "private":
        return <Lock className="h-3 w-3 text-gray-600" />
      default:
        return <Eye className="h-3 w-3" />
    }
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "edit":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "view":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "declined":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLiveUpdateIcon = (type: LiveUpdate["type"]) => {
    switch (type) {
      case "event_created":
        return <CheckCircle2 className="h-3 w-3 text-green-600" />
      case "event_updated":
        return <Edit3 className="h-3 w-3 text-blue-600" />
      case "event_deleted":
        return <AlertCircle className="h-3 w-3 text-red-600" />
      case "user_joined":
        return <UserPlus className="h-3 w-3 text-emerald-600" />
      case "user_left":
        return <AlertCircle className="h-3 w-3 text-orange-600" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedEventId) return
    
    // In a real app, this would send to the server
    console.log("Adding comment:", newComment, "to event:", selectedEventId)
    setNewComment("")
    setSelectedEventId(null)
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 border-cyan-200 dark:border-cyan-800">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-cyan-600" />
        <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">Collaboration Hub</h3>
        <Badge variant="secondary" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          Live
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4 bg-white dark:bg-gray-900 rounded-lg p-1">
        {[
          { id: "activity", label: "Activity", icon: MessageSquare },
          { id: "shared", label: "Shared Calendars", icon: Share2 },
          { id: "live", label: "Live Updates", icon: Bell }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1 flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Activity Feed */}
      {activeTab === "activity" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment to an event..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addComment} disabled={!newComment.trim()}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockCollaborations.map((collab) => (
              <div key={collab.id} className="flex gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={collab.user.avatar} />
                  <AvatarFallback>{collab.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getCollaborationIcon(collab.type)}
                    <span className="font-medium text-sm">{collab.user.name}</span>
                    <Badge variant="outline" className="text-xs">{collab.user.role}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDistanceToNow(collab.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  
                  {collab.message && (
                    <p className="text-sm text-muted-foreground">{collab.message}</p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      Join Call
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared Calendars */}
      {activeTab === "shared" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Shared Calendars</h4>
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Share Calendar
            </Button>
          </div>

          <div className="space-y-3">
            {mockSharedCalendars.map((calendar) => (
              <div key={calendar.id} className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: calendar.color }}
                    />
                    <div>
                      <h5 className="font-medium">{calendar.name}</h5>
                      <p className="text-sm text-muted-foreground">{calendar.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getVisibilityColor(calendar.visibility)}`}>
                      {getVisibilityIcon(calendar.visibility)}
                      <span className="ml-1 capitalize">{calendar.visibility}</span>
                    </Badge>
                    <Badge className={`text-xs ${getPermissionColor(calendar.permissions)}`}>
                      {calendar.permissions}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members ({calendar.members.length})</span>
                    <Button variant="ghost" size="sm" className="h-6">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {calendar.members.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{member.name}</div>
                          <div className="flex items-center gap-1">
                            <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                              {member.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {calendar.members.length > 5 && (
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                        +{calendar.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Updates */}
      {activeTab === "live" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Activity
            </h4>
            <Badge variant="secondary" className="text-xs">
              {liveUpdates.length} updates
            </Badge>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {liveUpdates.map((update) => (
              <div key={update.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border animate-in slide-in-from-top-1 duration-300">
                {getLiveUpdateIcon(update.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium">{update.user}</span>
                    <span className="text-muted-foreground ml-1">
                      {update.type === "event_created" && `created "${update.eventTitle}"`}
                      {update.type === "event_updated" && `updated "${update.eventTitle}"`}
                      {update.type === "event_deleted" && `deleted "${update.eventTitle}"`}
                      {update.type === "user_joined" && "joined the calendar"}
                      {update.type === "user_left" && "left the calendar"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {update.calendarId}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}