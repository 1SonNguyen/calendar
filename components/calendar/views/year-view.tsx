"use client"

import { useCalendar } from "../calendar-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  format, 
  startOfYear, 
  endOfYear, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  getDay,
  addMonths,
  isToday
} from "date-fns"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react"

export function YearView() {
  const { currentDate, events, setCurrentDate, setView } = useCalendar()
  
  const yearStart = startOfYear(currentDate)
  const yearEnd = endOfYear(currentDate)
  
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i))
  
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.startDate, date))
  }
  
  const getEventsForMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    return events.filter(event => 
      event.startDate >= monthStart && event.startDate <= monthEnd
    )
  }
  
  const navigateYear = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(currentDate.getFullYear() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }
  
  const renderMiniCalendar = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate)
    const monthEnd = endOfMonth(monthDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const monthEvents = getEventsForMonth(monthDate)
    
    // Add empty cells for days before month starts
    const startDay = getDay(monthStart)
    const emptyCells = Array.from({ length: startDay }, (_, i) => (
      <div key={`empty-${i}`} className="h-6 w-6" />
    ))
    
    return (
      <Card className="p-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer" 
            onClick={() => {
              setCurrentDate(monthDate)
              setView("month")
            }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">{format(monthDate, "MMMM")}</h3>
          <Badge variant="secondary" className="text-xs">
            {monthEvents.length}
          </Badge>
        </div>
        
        <div className="grid grid-cols-7 gap-px text-xs">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={day + i} className="h-6 w-6 flex items-center justify-center text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          
          {emptyCells}
          
          {days.map((day) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, monthDate)
            const isDayToday = isToday(day)
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "h-6 w-6 flex items-center justify-center relative text-xs transition-all duration-150",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                  isDayToday && "bg-blue-600 text-white rounded-full font-bold",
                  dayEvents.length > 0 && !isDayToday && "bg-blue-100 dark:bg-blue-950 rounded-full",
                  "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer"
                )}
              >
                {format(day, "d")}
                {dayEvents.length > 0 && !isDayToday && (
                  <div className="absolute bottom-0 right-0 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </div>
            )
          })}
        </div>
        
        {monthEvents.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {monthEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: event.color }}
                title={event.title}
              />
            ))}
            {monthEvents.length > 3 && (
              <span className="text-xs text-muted-foreground">+{monthEvents.length - 3}</span>
            )}
          </div>
        )}
      </Card>
    )
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Year Navigation */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateYear("prev")}
            className="transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">{format(currentDate, "yyyy")}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateYear("next")}
            className="transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {events.length} Events This Year
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("month")}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Month View
          </Button>
        </div>
      </div>
      
      {/* Months Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-500">
          {months.map((month) => (
            <div key={month.toISOString()}>
              {renderMiniCalendar(month)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}