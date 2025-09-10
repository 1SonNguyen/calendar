"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCalendar } from "./calendar-context"
import { 
  Bell, 
  Clock, 
  MapPin, 
  AlertTriangle,
  CheckCircle2,
  X,
  Calendar as CalendarIcon,
  Users,
  Zap
} from "lucide-react"
import { format, addMinutes, isBefore, isAfter, differenceInMinutes } from "date-fns"

interface Notification {
  id: string
  type: "reminder" | "update" | "invitation" | "alert" | "success"
  title: string
  message: string
  timestamp: Date
  eventId?: string
  actionRequired?: boolean
  read: boolean
}

export function NotificationCenter() {
  const { events } = useCalendar()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    generateNotifications()
    const interval = setInterval(generateNotifications, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [events])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const generateNotifications = () => {
    const now = new Date()
    const newNotifications: Notification[] = []

    // Check for upcoming events (15 minutes before)
    events.forEach(event => {
      const minutesUntil = differenceInMinutes(event.startDate, now)
      
      if (minutesUntil === 15) {
        newNotifications.push({
          id: `reminder-${event.id}-15`,
          type: "reminder",
          title: "Upcoming Event",
          message: `${event.title} starts in 15 minutes`,
          timestamp: now,
          eventId: event.id,
          actionRequired: false,
          read: false
        })
      }
      
      if (minutesUntil === 5) {
        newNotifications.push({
          id: `reminder-${event.id}-5`,
          type: "alert",
          title: "Event Starting Soon",
          message: `${event.title} starts in 5 minutes at ${event.location || 'TBD'}`,
          timestamp: now,
          eventId: event.id,
          actionRequired: true,
          read: false
        })
      }
    })

    // Add some realistic notifications
    if (notifications.length === 0) {
      newNotifications.push(
        {
          id: "welcome",
          type: "success",
          title: "Calendar Sync Complete",
          message: "Your Samsung Calendar is now synchronized across all devices",
          timestamp: new Date(now.getTime() - 5 * 60000),
          actionRequired: false,
          read: false
        },
        {
          id: "weather-update",
          type: "update",
          title: "Weather Alert",
          message: "Rain expected this afternoon. Consider indoor meetings.",
          timestamp: new Date(now.getTime() - 10 * 60000),
          actionRequired: false,
          read: false
        },
        {
          id: "meeting-invite",
          type: "invitation",
          title: "Meeting Invitation",
          message: "Sarah Johnson invited you to 'Project Review Meeting'",
          timestamp: new Date(now.getTime() - 30 * 60000),
          actionRequired: true,
          read: false
        }
      )
    }

    // Only add new notifications that don't already exist
    const existingIds = notifications.map(n => n.id)
    const trulyNewNotifications = newNotifications.filter(n => !existingIds.includes(n.id))
    
    if (trulyNewNotifications.length > 0) {
      setNotifications(prev => [...trulyNewNotifications, ...prev].slice(0, 10)) // Keep last 10
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "reminder":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "update":
        return <Bell className="h-4 w-4 text-green-600" />
      case "invitation":
        return <Users className="h-4 w-4 text-purple-600" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "reminder":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/50"
      case "update":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/50"
      case "invitation":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-950/50"
      case "alert":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/50"
      case "success":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/50"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/50"
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-600 text-white text-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200 border-2 shadow-lg">
          <div className="p-3 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-6 text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'border-2' : 'border'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium text-xs">{notification.title}</span>
                        {notification.actionRequired && (
                          <Badge className="text-xs bg-red-100 text-red-800 border-red-200">
                            <Zap className="h-2 w-2 mr-1" />
                            Action
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          dismissNotification(notification.id)
                        }}
                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(notification.timestamp, "MMM d, h:mm a")}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}