"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCalendar } from "./calendar-context"
import { 
  Calendar, 
  Coffee, 
  Car, 
  Phone, 
  Utensils, 
  Dumbbell, 
  Briefcase, 
  Heart,
  Zap,
  Clock
} from "lucide-react"
import { addMinutes, format } from "date-fns"

interface QuickAction {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  category: string
  duration: number
  defaultLocation?: string
}

const quickActions: QuickAction[] = [
  {
    id: "coffee-break",
    title: "Coffee Break",
    icon: <Coffee className="h-4 w-4" />,
    color: "#8B5CF6",
    category: "Personal",
    duration: 15,
    defaultLocation: "Office Kitchen"
  },
  {
    id: "lunch",
    title: "Lunch",
    icon: <Utensils className="h-4 w-4" />,
    color: "#10B981",
    category: "Personal", 
    duration: 60,
    defaultLocation: "Cafeteria"
  },
  {
    id: "meeting",
    title: "Quick Meeting",
    icon: <Briefcase className="h-4 w-4" />,
    color: "#3B82F6",
    category: "Work",
    duration: 30,
    defaultLocation: "Conference Room"
  },
  {
    id: "workout",
    title: "Workout",
    icon: <Dumbbell className="h-4 w-4" />,
    color: "#EF4444",
    category: "Health",
    duration: 60,
    defaultLocation: "Gym"
  },
  {
    id: "call",
    title: "Phone Call",
    icon: <Phone className="h-4 w-4" />,
    color: "#06B6D4",
    category: "Work",
    duration: 15
  },
  {
    id: "commute",
    title: "Travel Time",
    icon: <Car className="h-4 w-4" />,
    color: "#F59E0B",
    category: "Travel",
    duration: 30
  }
]

export function QuickActions() {
  const { currentDate, addEvent, setIsEventModalOpen } = useCalendar()
  const [isCreating, setIsCreating] = useState<string | null>(null)

  const handleQuickAction = async (action: QuickAction) => {
    setIsCreating(action.id)
    
    // Simulate quick creation
    setTimeout(() => {
      const now = new Date()
      const startTime = new Date(now.getTime() + 5 * 60000) // 5 minutes from now
      const endTime = addMinutes(startTime, action.duration)

      const selectedCalendar = action.category === "Work" ? "work" : 
                             action.category === "Health" ? "health" : 
                             action.category === "Travel" ? "personal" : "personal"

      addEvent({
        title: action.title,
        description: `Quick ${action.title.toLowerCase()} created`,
        startDate: startTime,
        endDate: endTime,
        color: action.color,
        category: action.category,
        location: action.defaultLocation,
        calendarId: selectedCalendar,
        isAllDay: false
      })

      setIsCreating(null)
    }, 800)
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/50 dark:to-cyan-950/50 border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-indigo-600" />
        <h3 className="font-medium text-indigo-900 dark:text-indigo-100">Quick Actions</h3>
        <Badge variant="secondary" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Fast
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction(action)}
            disabled={isCreating === action.id}
            className={`
              h-auto p-3 flex flex-col items-center gap-2 text-xs
              transition-all duration-200 hover:scale-105 active:scale-95
              bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800
              border-gray-200 dark:border-gray-700
              ${isCreating === action.id ? 'opacity-70' : ''}
            `}
            style={{ 
              borderLeftColor: action.color, 
              borderLeftWidth: '3px'
            }}
          >
            {isCreating === action.id ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <div style={{ color: action.color }}>
                {action.icon}
              </div>
            )}
            <span className="font-medium leading-tight text-center">
              {action.title}
            </span>
            <Badge 
              variant="secondary" 
              className="text-[10px] px-1 py-0"
            >
              {action.duration}m
            </Badge>
          </Button>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEventModalOpen(true)}
          className="w-full text-xs bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Custom Event
        </Button>
      </div>
    </Card>
  )
}