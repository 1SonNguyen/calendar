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
  addEvent: (event: Omit<CalendarEvent, "id">) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
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
      startDate: new Date(2025, 8, 10, 10, 0), // Updated to current month
      endDate: new Date(2025, 8, 10, 11, 0),
      color: "#3B82F6",
      category: "Work",
      location: "Conference Room A",
      calendarId: "work",
    },
    {
      id: "2",
      title: "Lunch with Sarah",
      description: "Catch up over lunch and discuss vacation plans",
      startDate: new Date(2025, 8, 12, 12, 30),
      endDate: new Date(2025, 8, 12, 13, 30),
      color: "#10B981",
      category: "Personal",
      location: "Downtown Cafe",
      calendarId: "personal",
    },
    {
      id: "3",
      title: "Q3 Project Review",
      description: "Quarterly project review and planning for Q4",
      startDate: new Date(2025, 8, 15, 9, 0),
      endDate: new Date(2025, 8, 15, 17, 0),
      color: "#3B82F6",
      category: "Work",
      isAllDay: true,
      calendarId: "work",
    },
    {
      id: "4",
      title: "Annual Checkup",
      description: "Annual physical examination",
      startDate: new Date(2025, 8, 18, 14, 30),
      endDate: new Date(2025, 8, 18, 15, 30),
      color: "#EF4444",
      category: "Health",
      location: "City Medical Center",
      calendarId: "health",
    },
    {
      id: "5",
      title: "Fall Festival Weekend",
      description: "Family trip to the autumn festival",
      startDate: new Date(2025, 8, 21, 0, 0),
      endDate: new Date(2025, 8, 22, 23, 59),
      color: "#8B5CF6",
      category: "Family",
      isAllDay: true,
      location: "Riverside Park",
      calendarId: "family",
    },
    {
      id: "6",
      title: "Morning Workout",
      description: "Cardio and strength training",
      startDate: new Date(2025, 8, 11, 7, 0),
      endDate: new Date(2025, 8, 11, 8, 0),
      color: "#EF4444",
      category: "Health",
      recurrence: "daily",
      location: "FitLife Gym",
      calendarId: "health",
    },
    {
      id: "7",
      title: "Client Presentation",
      description: "Present new marketing strategy to key client",
      startDate: new Date(2025, 8, 13, 14, 0),
      endDate: new Date(2025, 8, 13, 16, 0),
      color: "#3B82F6",
      category: "Work",
      location: "Client Office - Downtown",
      calendarId: "work",
    },
    {
      id: "8",
      title: "Pizza Night",
      description: "Family pizza night and movie",
      startDate: new Date(2025, 8, 14, 18, 0),
      endDate: new Date(2025, 8, 14, 21, 0),
      color: "#8B5CF6",
      category: "Family",
      location: "Home",
      calendarId: "family",
    },
    {
      id: "9",
      title: "Dentist Appointment",
      description: "Routine dental cleaning",
      startDate: new Date(2025, 8, 16, 10, 0),
      endDate: new Date(2025, 8, 16, 11, 0),
      color: "#EF4444",
      category: "Health",
      location: "Smile Dental Clinic",
      calendarId: "health",
    },
    {
      id: "10",
      title: "Team Building Event",
      description: "Company team building activities and lunch",
      startDate: new Date(2025, 8, 20, 10, 0),
      endDate: new Date(2025, 8, 20, 15, 0),
      color: "#3B82F6",
      category: "Work",
      location: "Adventure Park",
      calendarId: "work",
    },
    {
      id: "11",
      title: "Book Club Meeting",
      description: "Monthly book discussion - 'The Seven Husbands of Evelyn Hugo'",
      startDate: new Date(2025, 8, 19, 19, 0),
      endDate: new Date(2025, 8, 19, 21, 0),
      color: "#10B981",
      category: "Personal",
      location: "Sarah's House",
      calendarId: "personal",
    },
    {
      id: "12",
      title: "Weekend Yoga Retreat",
      description: "Relaxing yoga and meditation retreat",
      startDate: new Date(2025, 8, 28, 9, 0),
      endDate: new Date(2025, 8, 29, 17, 0),
      color: "#EF4444",
      category: "Health",
      isAllDay: true,
      location: "Mountain Retreat Center",
      calendarId: "health",
    },
    {
      id: "13",
      title: "Coffee with Mom",
      description: "Weekly coffee date with mom",
      startDate: new Date(2025, 8, 17, 15, 0),
      endDate: new Date(2025, 8, 17, 16, 30),
      color: "#8B5CF6",
      category: "Family",
      location: "Corner Bistro",
      calendarId: "family",
      recurrence: "weekly",
    },
    {
      id: "14",
      title: "Product Launch Meeting",
      description: "Final preparations for new product launch",
      startDate: new Date(2025, 8, 25, 9, 0),
      endDate: new Date(2025, 8, 25, 12, 0),
      color: "#3B82F6",
      category: "Work",
      location: "Conference Room B",
      calendarId: "work",
    },
    {
      id: "15",
      title: "Grocery Shopping",
      description: "Weekly grocery run",
      startDate: new Date(2025, 8, 21, 10, 0),
      endDate: new Date(2025, 8, 21, 11, 30),
      color: "#10B981",
      category: "Personal",
      location: "Whole Foods",
      calendarId: "personal",
      recurrence: "weekly",
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

  const addEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...updates } : event)))
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
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
        addEvent,
        updateEvent,
        deleteEvent,
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
