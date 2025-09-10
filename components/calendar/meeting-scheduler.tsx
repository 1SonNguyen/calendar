"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCalendar } from "./calendar-context"
import { 
  Users, 
  Clock, 
  Calendar as CalendarIcon, 
  Video,
  MapPin,
  Send,
  UserPlus,
  CheckCircle2,
  X
} from "lucide-react"
import { format, addMinutes, addHours } from "date-fns"

interface MeetingTemplate {
  id: string
  name: string
  duration: number
  type: "in-person" | "virtual" | "hybrid"
  icon: React.ReactNode
  description: string
  defaultLocation?: string
}

const meetingTemplates: MeetingTemplate[] = [
  {
    id: "standup",
    name: "Daily Standup",
    duration: 15,
    type: "virtual",
    icon: <Users className="h-4 w-4" />,
    description: "Quick team sync meeting",
    defaultLocation: "Zoom Room"
  },
  {
    id: "one-on-one",
    name: "1:1 Meeting",
    duration: 30,
    type: "hybrid",
    icon: <Clock className="h-4 w-4" />,
    description: "Personal discussion meeting",
    defaultLocation: "Office"
  },
  {
    id: "brainstorm",
    name: "Brainstorming",
    duration: 60,
    type: "in-person",
    icon: <Video className="h-4 w-4" />,
    description: "Creative collaboration session",
    defaultLocation: "Innovation Lab"
  },
  {
    id: "presentation",
    name: "Presentation",
    duration: 45,
    type: "virtual",
    icon: <CalendarIcon className="h-4 w-4" />,
    description: "Formal presentation meeting",
    defaultLocation: "Teams Meeting"
  }
]

export function MeetingScheduler() {
  const { addEvent } = useCalendar()
  const [selectedTemplate, setSelectedTemplate] = useState<MeetingTemplate | null>(null)
  const [attendees, setAttendees] = useState<string[]>([])
  const [newAttendee, setNewAttendee] = useState("")
  const [customTitle, setCustomTitle] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)

  const addAttendee = () => {
    if (newAttendee.trim() && !attendees.includes(newAttendee.trim())) {
      setAttendees([...attendees, newAttendee.trim()])
      setNewAttendee("")
    }
  }

  const removeAttendee = (email: string) => {
    setAttendees(attendees.filter(a => a !== email))
  }

  const scheduleQuickMeeting = async (template: MeetingTemplate) => {
    setIsScheduling(true)
    
    setTimeout(() => {
      const now = new Date()
      const startTime = new Date(now.getTime() + 15 * 60000) // 15 minutes from now
      const endTime = addMinutes(startTime, template.duration)

      addEvent({
        title: customTitle || template.name,
        description: `${customDescription || template.description}\n\nAttendees: ${attendees.length > 0 ? attendees.join(", ") : "No attendees"}`,
        startDate: startTime,
        endDate: endTime,
        color: "#3B82F6",
        category: "Work",
        location: template.defaultLocation,
        calendarId: "work",
        isAllDay: false
      })

      // Reset form
      setSelectedTemplate(null)
      setAttendees([])
      setCustomTitle("")
      setCustomDescription("")
      setIsScheduling(false)
    }, 1000)
  }

  const getTypeIcon = (type: MeetingTemplate["type"]) => {
    switch (type) {
      case "virtual":
        return <Video className="h-3 w-3 text-blue-600" />
      case "in-person":
        return <MapPin className="h-3 w-3 text-green-600" />
      case "hybrid":
        return <Users className="h-3 w-3 text-purple-600" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  const getTypeColor = (type: MeetingTemplate["type"]) => {
    switch (type) {
      case "virtual":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-person":
        return "bg-green-100 text-green-800 border-green-200"
      case "hybrid":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/50 dark:to-fuchsia-950/50 border-violet-200 dark:border-violet-800">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-violet-600" />
        <h3 className="font-medium text-violet-900 dark:text-violet-100">Quick Meetings</h3>
        <Badge variant="secondary" className="text-xs">
          <Video className="h-3 w-3 mr-1" />
          Smart
        </Badge>
      </div>

      {!selectedTemplate ? (
        <div className="grid grid-cols-1 gap-2">
          {meetingTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              onClick={() => setSelectedTemplate(template)}
              className="h-auto p-3 flex items-center gap-3 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2">
                {template.icon}
                <div>
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge className={`text-xs ${getTypeColor(template.type)}`}>
                  {getTypeIcon(template.type)}
                  <span className="ml-1 capitalize">{template.type}</span>
                </Badge>
                <span className="text-xs text-muted-foreground">{template.duration}m</span>
              </div>
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedTemplate.icon}
              <span className="font-medium text-sm">{selectedTemplate.name}</span>
              <Badge className={`text-xs ${getTypeColor(selectedTemplate.type)}`}>
                {selectedTemplate.duration}m
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTemplate(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Custom meeting title (optional)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="text-xs"
            />
            
            <Textarea
              placeholder="Additional details (optional)"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="text-xs min-h-[60px]"
            />

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add attendee email"
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAttendee()}
                  className="text-xs flex-1"
                />
                <Button
                  size="sm"
                  onClick={addAttendee}
                  className="h-8 w-8 p-0"
                  disabled={!newAttendee.trim()}
                >
                  <UserPlus className="h-3 w-3" />
                </Button>
              </div>

              {attendees.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {attendees.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      {email}
                      <button
                        onClick={() => removeAttendee(email)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={() => scheduleQuickMeeting(selectedTemplate)}
            disabled={isScheduling}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            size="sm"
          >
            {isScheduling ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Send className="h-3 w-3 mr-2" />
                Schedule in 15 Minutes
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}