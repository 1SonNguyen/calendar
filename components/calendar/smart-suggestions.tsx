"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCalendar } from "./calendar-context"
import { Lightbulb, Plus, X, Clock, MapPin, Users } from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"

interface SmartSuggestion {
  id: string
  type: "meeting" | "break" | "commute" | "follow-up" | "reminder"
  title: string
  description: string
  suggestedTime: Date
  duration: number // minutes
  confidence: number // 0-100
  category: string
  location?: string
}

export function SmartSuggestions() {
  const { events, currentDate, addEvent } = useCalendar()
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([])
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([])

  useEffect(() => {
    generateSuggestions()
  }, [events, currentDate])

  const generateSuggestions = () => {
    const newSuggestions: SmartSuggestion[] = []
    const today = new Date()
    const todayEvents = events.filter(event => isSameDay(event.startDate, today))

    // Suggest lunch break if no lunch scheduled
    const hasLunch = todayEvents.some(event => 
      event.title.toLowerCase().includes("lunch") || 
      (event.startDate.getHours() >= 11 && event.startDate.getHours() <= 14)
    )
    
    if (!hasLunch && !dismissedSuggestions.includes("lunch-break")) {
      newSuggestions.push({
        id: "lunch-break",
        type: "break",
        title: "Lunch Break",
        description: "Take a break and grab some lunch",
        suggestedTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
        duration: 60,
        confidence: 85,
        category: "Personal",
        location: "Nearby Restaurant"
      })
    }

    // Suggest workout if health events are regular
    const hasWorkout = todayEvents.some(event => 
      event.category === "Health" || 
      event.title.toLowerCase().includes("workout") ||
      event.title.toLowerCase().includes("gym")
    )
    
    if (!hasWorkout && !dismissedSuggestions.includes("workout-reminder")) {
      newSuggestions.push({
        id: "workout-reminder",
        type: "reminder",
        title: "Evening Workout",
        description: "Keep up with your fitness routine",
        suggestedTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
        duration: 60,
        confidence: 75,
        category: "Health",
        location: "FitLife Gym"
      })
    }

    // Suggest follow-up meetings
    const workEvents = events.filter(event => 
      event.category === "Work" && 
      event.title.toLowerCase().includes("meeting") &&
      isSameDay(event.startDate, addDays(today, -1))
    )

    if (workEvents.length > 0 && !dismissedSuggestions.includes("follow-up-meeting")) {
      newSuggestions.push({
        id: "follow-up-meeting",
        type: "follow-up",
        title: "Follow-up Discussion",
        description: `Follow up on yesterday's ${workEvents[0].title}`,
        suggestedTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        duration: 30,
        confidence: 70,
        category: "Work",
        location: "Conference Room"
      })
    }

    // Suggest commute time for external meetings
    const externalMeetings = todayEvents.filter(event => 
      event.location && 
      !event.location.toLowerCase().includes("home") &&
      !event.location.toLowerCase().includes("office") &&
      event.startDate.getTime() > today.getTime()
    )

    externalMeetings.forEach(meeting => {
      const commuteId = `commute-${meeting.id}`
      if (!dismissedSuggestions.includes(commuteId)) {
        const commuteTime = new Date(meeting.startDate.getTime() - 30 * 60000) // 30 min before
        newSuggestions.push({
          id: commuteId,
          type: "commute",
          title: "Travel Time",
          description: `Travel to ${meeting.location} for ${meeting.title}`,
          suggestedTime: commuteTime,
          duration: 30,
          confidence: 90,
          category: "Travel",
          location: meeting.location
        })
      }
    })

    setSuggestions(newSuggestions.slice(0, 3)) // Limit to 3 suggestions
  }

  const acceptSuggestion = (suggestion: SmartSuggestion) => {
    const selectedCalendar = suggestion.category === "Work" ? "work" : 
                           suggestion.category === "Health" ? "health" : "personal"
    
    addEvent({
      title: suggestion.title,
      description: suggestion.description,
      startDate: suggestion.suggestedTime,
      endDate: new Date(suggestion.suggestedTime.getTime() + suggestion.duration * 60000),
      color: suggestion.category === "Work" ? "#3B82F6" : 
             suggestion.category === "Health" ? "#EF4444" : "#10B981",
      category: suggestion.category,
      location: suggestion.location,
      calendarId: selectedCalendar,
      isAllDay: false
    })

    dismissSuggestion(suggestion.id)
  }

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions(prev => [...prev, id])
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }

  const getTypeIcon = (type: SmartSuggestion["type"]) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />
      case "break":
        return <Clock className="h-4 w-4" />
      case "commute":
        return <MapPin className="h-4 w-4" />
      case "follow-up":
        return <Users className="h-4 w-4" />
      case "reminder":
        return <Clock className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (confidence >= 60) return "bg-blue-100 text-blue-800 border-blue-200"
    return "bg-yellow-100 text-yellow-800 border-yellow-200"
  }

  if (suggestions.length === 0) return null

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium text-blue-900 dark:text-blue-100">Smart Suggestions</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(suggestion.type)}
                <span className="font-medium text-sm">{suggestion.title}</span>
              </div>
              <Badge className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                {suggestion.confidence}%
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Clock className="h-3 w-3" />
              <span>{format(suggestion.suggestedTime, "MMM d, h:mm a")}</span>
              {suggestion.location && (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>{suggestion.location}</span>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => acceptSuggestion(suggestion)}
                className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dismissSuggestion(suggestion.id)}
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}