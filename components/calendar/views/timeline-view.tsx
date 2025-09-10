"use client"

import { useCalendar } from "../calendar-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  addWeeks,
  subWeeks,
  isToday,
  getHours,
  getMinutes
} from "date-fns"
import { cn } from "@/lib/utils"
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users,
  Calendar as CalendarIcon
} from "lucide-react"

export function TimelineView() {
  const { currentDate, events, setCurrentDate } = useCalendar()
  
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
  }
  
  const getEventsForDay = (date: Date) => {
    return events
      .filter(event => isSameDay(event.startDate, date))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }
  
  const formatEventTime = (date: Date) => {
    return format(date, "h:mm a")
  }
  
  const getEventDuration = (startDate: Date, endDate: Date) => {
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60) // minutes
    if (duration < 60) return `${duration}m`
    if (duration < 1440) return `${Math.floor(duration / 60)}h ${duration % 60}m`
    return `${Math.floor(duration / 1440)}d`
  }
  
  const renderTimelineEvent = (event: any) => (
    <Card 
      key={event.id}
      className="p-3 mb-3 border-l-4 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
          {event.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        <Badge 
          className="ml-2 text-xs"
          style={{ backgroundColor: `${event.color}20`, color: event.color, borderColor: event.color }}
        >
          {event.category}
        </Badge>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>
            {event.isAllDay 
              ? "All Day" 
              : `${formatEventTime(event.startDate)} - ${formatEventTime(event.endDate)}`
            }
          </span>
          {!event.isAllDay && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
              {getEventDuration(event.startDate, event.endDate)}
            </span>
          )}
        </div>
        
        {event.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-20">{event.location}</span>
          </div>
        )}
        
        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{event.attendees.length}</span>
          </div>
        )}
      </div>
    </Card>
  )
  
  const renderDayTimeline = (day: Date) => {
    const dayEvents = getEventsForDay(day)
    const isDayToday = isToday(day)
    
    return (
      <div key={day.toISOString()} className="min-w-80 p-4 border-r border-border last:border-r-0">
        <div className={cn(
          "flex items-center gap-2 mb-4 p-2 rounded-lg transition-all duration-200",
          isDayToday && "bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
        )}>
          <div className={cn(
            "w-3 h-3 rounded-full",
            isDayToday ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          )} />
          <div>
            <h3 className={cn(
              "font-medium text-sm",
              isDayToday && "text-blue-900 dark:text-blue-100"
            )}>
              {format(day, "EEEE")}
            </h3>
            <p className={cn(
              "text-xs text-muted-foreground",
              isDayToday && "text-blue-700 dark:text-blue-300"
            )}>
              {format(day, "MMM d, yyyy")}
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto text-xs">
            {dayEvents.length}
          </Badge>
        </div>
        
        <div className="h-96 overflow-y-auto">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No events</p>
            </div>
          ) : (
            <div className="space-y-0">
              {dayEvents.map(renderTimelineEvent)}
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek("prev")}
            className="transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </h2>
            <p className="text-sm text-muted-foreground">Timeline View</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek("next")}
            className="transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {events.filter(event => 
            weekDays.some(day => isSameDay(event.startDate, day))
          ).length} Events This Week
        </Badge>
      </div>
      
      {/* Timeline Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="flex min-w-max animate-in slide-in-from-left duration-500">
            {weekDays.map(renderDayTimeline)}
          </div>
        </div>
      </div>
    </div>
  )
}