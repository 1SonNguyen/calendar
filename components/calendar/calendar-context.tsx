"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type CalendarView = "month" | "week" | "day"

export interface Calendar {
  id: string
  name: string
  color: string
  description?: string
  isVisible: boolean
  isDefault?: boolean
  type: "personal" | "work" | "family" | "other"
  createdAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  color: string
  category?: string
  isAllDay?: boolean
  location?: string
  recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly"
  calendarId: string
  attendees?: string[]
  reminders?: number[]
}

interface CalendarContextType {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  view: CalendarView
  setView: (view: CalendarView) => void
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (event: CalendarEvent | null) => void
  isEventModalOpen: boolean
  setIsEventModalOpen: (open: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isTransitioning: boolean
  setIsTransitioning: (transitioning: boolean) => void
  calendars: Calendar[]
  setCalendars: (calendars: Calendar[]) => void
  selectedCalendar: Calendar | null
  setSelectedCalendar: (calendar: Calendar | null) => void
  isCalendarModalOpen: boolean
  setIsCalendarModalOpen: (open: boolean) => void
  addCalendar: (calendar: Omit<Calendar, "id" | "createdAt">) => void
  updateCalendar: (id: string, updates: Partial<Calendar>) => void
  deleteCalendar: (id: string) => void
  toggleCalendarVisibility: (id: string) => void
  getVisibleEvents: () => CalendarEvent[]
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")

  const [calendars, setCalendars] = useState<Calendar[]>([
    {
      id: "personal",
      name: "Personal",
      color: "#10B981",
      description: "Personal events and appointments",
      isVisible: true,
      isDefault: true,
      type: "personal",
      createdAt: new Date(),
    },
    {
      id: "work",
      name: "Work",
      color: "#3B82F6",
      description: "Work meetings and deadlines",
      isVisible: true,
      type: "work",
      createdAt: new Date(),
    },
    {
      id: "family",
      name: "Family",
      color: "#8B5CF6",
      description: "Family events and gatherings",
      isVisible: true,
      type: "family",
      createdAt: new Date(),
    },
    {
      id: "health",
      name: "Health",
      color: "#EF4444",
      description: "Medical appointments and fitness",
      isVisible: true,
      type: "other",
      createdAt: new Date(),
    },
  ])

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Meeting",
      description: "Weekly team sync and project updates",
      startDate: new Date(2024, 11, 15, 10, 0),
      endDate: new Date(2024, 11, 15, 11, 0),
      color: "#3B82F6",
      category: "Work",
      location: "Conference Room A",
      calendarId: "work",
    },
    {
      id: "2",
      title: "Lunch with Sarah",
      description: "Catch up over lunch",
      startDate: new Date(2024, 11, 16, 12, 30),
      endDate: new Date(2024, 11, 16, 13, 30),
      color: "#10B981",
      category: "Personal",
      location: "Downtown Cafe",
      calendarId: "personal",
    },
    {
      id: "3",
      title: "Project Deadline",
      description: "Submit final project deliverables",
      startDate: new Date(2024, 11, 20, 9, 0),
      endDate: new Date(2024, 11, 20, 17, 0),
      color: "#3B82F6",
      category: "Work",
      isAllDay: true,
      calendarId: "work",
    },
    {
      id: "4",
      title: "Doctor Appointment",
      startDate: new Date(2024, 11, 18, 14, 30),
      endDate: new Date(2024, 11, 18, 15, 30),
      color: "#EF4444",
      category: "Health",
      location: "Medical Center",
      calendarId: "health",
    },
    {
      id: "5",
      title: "Weekend Trip",
      description: "Mountain hiking adventure",
      startDate: new Date(2024, 11, 21, 0, 0),
      endDate: new Date(2024, 11, 23, 23, 59),
      color: "#8B5CF6",
      category: "Personal",
      isAllDay: true,
      location: "Rocky Mountains",
      calendarId: "family",
    },
    {
      id: "6",
      title: "Morning Workout",
      startDate: new Date(2024, 11, 17, 7, 0),
      endDate: new Date(2024, 11, 17, 8, 0),
      color: "#EF4444",
      category: "Health",
      recurrence: "daily",
      location: "Gym",
      calendarId: "health",
    },
  ])

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)

  const addCalendar = (calendarData: Omit<Calendar, "id" | "createdAt">) => {
    const newCalendar: Calendar = {
      ...calendarData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setCalendars((prev) => [...prev, newCalendar])
  }

  const updateCalendar = (id: string, updates: Partial<Calendar>) => {
    setCalendars((prev) => prev.map((cal) => (cal.id === id ? { ...cal, ...updates } : cal)))
  }

  const deleteCalendar = (id: string) => {
    // Don't delete if it's the only calendar or default calendar
    if (calendars.length <= 1 || calendars.find((cal) => cal.id === id)?.isDefault) {
      return
    }

    setCalendars((prev) => prev.filter((cal) => cal.id !== id))
    // Remove events from deleted calendar
    setEvents((prev) => prev.filter((event) => event.calendarId !== id))
  }

  const toggleCalendarVisibility = (id: string) => {
    setCalendars((prev) => prev.map((cal) => (cal.id === id ? { ...cal, isVisible: !cal.isVisible } : cal)))
  }

  const getVisibleEvents = () => {
    const visibleCalendarIds = calendars.filter((cal) => cal.isVisible).map((cal) => cal.id)

    return events.filter((event) => visibleCalendarIds.includes(event.calendarId))
  }

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        view,
        setView,
        events,
        setEvents,
        selectedEvent,
        setSelectedEvent,
        isEventModalOpen,
        setIsEventModalOpen,
        sidebarOpen,
        setSidebarOpen,
        isLoading,
        setIsLoading,
        isTransitioning,
        setIsTransitioning,
        calendars,
        setCalendars,
        selectedCalendar,
        setSelectedCalendar,
        isCalendarModalOpen,
        setIsCalendarModalOpen,
        addCalendar,
        updateCalendar,
        deleteCalendar,
        toggleCalendarVisibility,
        getVisibleEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }
  return context
}
