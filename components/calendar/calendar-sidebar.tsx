"use client"

import { useCalendar } from "./calendar-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { X, Plus, Settings } from "lucide-react"
import { WeatherWidget } from "./weather-widget"
import { SmartSuggestions } from "./smart-suggestions"
import { QuickActions } from "./quick-actions"

export function CalendarSidebar() {
  const {
    currentDate,
    setCurrentDate,
    getVisibleEvents,
    sidebarOpen,
    setSidebarOpen,
    calendars,
    toggleCalendarVisibility,
    setSelectedCalendar,
    setIsCalendarModalOpen,
  } = useCalendar()
  const isMobile = useIsMobile()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const visibleEvents = getVisibleEvents()

  // Get events for today
  const todayEvents = visibleEvents.filter((event) => isSameDay(event.startDate, new Date()))

  // Get upcoming events (next 7 days)
  const upcomingEvents = visibleEvents
    .filter((event) => {
      const today = new Date()
      const weekFromNow = new Date()
      weekFromNow.setDate(today.getDate() + 7)
      return event.startDate >= today && event.startDate <= weekFromNow
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  const handleCreateCalendar = () => {
    setSelectedCalendar(null)
    setIsCalendarModalOpen(true)
  }

  const handleEditCalendar = (calendar: any) => {
    setSelectedCalendar(calendar)
    setIsCalendarModalOpen(true)
  }

  if (!sidebarOpen) return null

  return (
    <>
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "bg-card border-r border-border p-4 overflow-y-auto z-50",
          isMobile
            ? "fixed left-0 top-0 bottom-0 w-80 transform transition-transform duration-300 ease-in-out" +
                (sidebarOpen ? " translate-x-0" : " -translate-x-full")
            : "w-80 relative",
        )}
      >
        {isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Calendar</h3>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Weather Widget */}
        <WeatherWidget />

        {/* Smart Suggestions */}
        <SmartSuggestions />

        {/* Quick Actions */}
        <QuickActions />

        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">My Calendars</h3>
            <Button variant="ghost" size="sm" onClick={handleCreateCalendar} className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="flex items-center gap-2 group">
                <Checkbox
                  checked={calendar.isVisible}
                  onCheckedChange={() => toggleCalendarVisibility(calendar.id)}
                  className="data-[state=checked]:bg-primary"
                />
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: calendar.color }} />
                <span className="flex-1 text-sm truncate">{calendar.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditCalendar(calendar)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Mini Calendar */}
        <Card className="p-4 mb-6">
          <h3 className="font-medium mb-3 text-center">{format(currentDate, "MMMM yyyy")}</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={`day-${index}`} className="p-1 text-muted-foreground font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month start */}
            {Array.from({ length: getDay(monthStart) }).map((_, index) => (
              <div key={index} className="p-1" />
            ))}
            {monthDays.map((day) => {
              const hasEvents = visibleEvents.some((event) => isSameDay(event.startDate, day))
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, currentDate)

              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentDate(day)
                    if (isMobile) setSidebarOpen(false)
                  }}
                  className={cn(
                    "h-8 w-8 p-0 text-xs relative",
                    isToday && "bg-blue-600 text-white hover:bg-blue-700",
                    isSelected && !isToday && "bg-accent",
                    !isSameMonth(day, currentDate) && "text-muted-foreground",
                  )}
                >
                  {format(day, "d")}
                  {hasEvents && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </Button>
              )
            })}
          </div>
        </Card>

        {/* Today's Events */}
        {todayEvents.length > 0 && (
          <Card className="p-4 mb-6">
            <h3 className="font-medium mb-3">Today's Events</h3>
            <div className="space-y-2">
              {todayEvents.map((event) => {
                const eventCalendar = calendars.find((cal) => cal.id === event.calendarId)
                return (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{format(event.startDate, "h:mm a")}</p>
                        {eventCalendar && (
                          <Badge variant="outline" className="text-xs">
                            {eventCalendar.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Upcoming</h3>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            ) : (
              upcomingEvents.slice(0, isMobile ? 5 : 10).map((event) => {
                const eventCalendar = calendars.find((cal) => cal.id === event.calendarId)
                return (
                  <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: event.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{format(event.startDate, "MMM d, h:mm a")}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {event.category && (
                          <Badge variant="secondary" className="text-xs">
                            {event.category}
                          </Badge>
                        )}
                        {eventCalendar && (
                          <Badge variant="outline" className="text-xs">
                            {eventCalendar.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </aside>
    </>
  )
}
