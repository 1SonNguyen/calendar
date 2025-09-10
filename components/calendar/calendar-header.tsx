"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCalendar } from "./calendar-context"
import { useAdvancedTheme } from "@/components/advanced-theme-provider"
import { useAnalytics } from "./analytics-context"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  Search,
  Settings,
  Filter,
  Download,
  MoreVertical,
  Palette,
  BarChart3,
} from "lucide-react"
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns"
import { SearchModal } from "./search-modal"
import { SettingsModal } from "./settings-modal"
import { FilterModal } from "./filter-modal"
import { NotificationCenter } from "./notification-center"
import { useIsMobile } from "@/hooks/use-mobile"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function CalendarHeader() {
  const {
    currentDate,
    setCurrentDate,
    view,
    setView,
    setIsEventModalOpen,
    sidebarOpen,
    setSidebarOpen,
    setIsTransitioning,
  } = useCalendar()
  const { setIsThemeModalOpen } = useAdvancedTheme()
  const { setIsAnalyticsModalOpen } = useAnalytics()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useIsMobile()

  const navigateDate = (direction: "prev" | "next") => {
    setIsTransitioning(true)
    setTimeout(() => {
      if (view === "month") {
        setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
      } else if (view === "week") {
        setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
      } else {
        setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
      }
      setTimeout(() => setIsTransitioning(false), 300)
    }, 100)
  }

  const handleViewChange = (newView: typeof view) => {
    if (newView !== view) {
      setIsTransitioning(true)
      setTimeout(() => {
        setView(newView)
        setTimeout(() => setIsTransitioning(false), 300)
      }, 100)
    }
  }

  const goToToday = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentDate(new Date())
      setTimeout(() => setIsTransitioning(false), 300)
    }, 100)
  }

  const getDateTitle = () => {
    if (view === "month") {
      return format(currentDate, isMobile ? "MMM yyyy" : "MMMM yyyy")
    } else if (view === "week") {
      return format(currentDate, "MMM yyyy")
    } else {
      return format(currentDate, isMobile ? "MMM d" : "EEEE, MMMM d, yyyy")
    }
  }

  const handleExport = () => {
    const dataStr =
      "data:text/calendar;charset=utf8," + encodeURIComponent("BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR")
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "calendar.ics")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <>
      <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "md:hidden transition-all duration-200 hover:scale-105 active:scale-95",
              "relative overflow-hidden before:absolute before:inset-0 before:bg-blue-500/20 before:rounded-full before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300",
            )}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 md:gap-3">
            <h1 className="text-lg md:text-2xl font-semibold text-foreground">{isMobile ? "Cal" : "Calendar"}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className={cn(
                "text-xs md:text-sm bg-transparent transition-all duration-200 hover:scale-105 active:scale-95",
                "hover:shadow-md hover:shadow-blue-500/20",
              )}
            >
              {isMobile ? "Today" : "Today"}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDate("prev")}
              className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDate("next")}
              className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          <h2 className="text-sm md:text-xl font-medium text-foreground min-w-[100px] md:min-w-[200px] transition-all duration-300">
            {getDateTitle()}
          </h2>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <div className="hidden md:flex items-center bg-muted rounded-lg p-1 shadow-sm">
            {(["month", "week", "day", "year", "timeline"] as const).map((viewType) => (
              <Button
                key={viewType}
                variant={view === viewType ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewChange(viewType)}
                className={cn(
                  "capitalize transition-all duration-200 relative overflow-hidden",
                  view === viewType && "shadow-sm bg-blue-600 text-white hover:bg-blue-700",
                  view !== viewType && "hover:bg-accent hover:scale-105",
                )}
              >
                {viewType}
              </Button>
            ))}
          </div>

          {isMobile ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 animate-in slide-in-from-top-2 duration-200" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full justify-start"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full justify-start"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAnalyticsModalOpen(true)}
                    className="w-full justify-start"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsThemeModalOpen(true)}
                    className="w-full justify-start"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Themes
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleExport} className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFilterOpen(true)}
                title="Filter events"
                className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <Filter className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                title="Search events"
                className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAnalyticsModalOpen(true)}
                title="Calendar analytics"
                className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <BarChart3 className="h-5 w-5" />
              </Button>

              <NotificationCenter />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsThemeModalOpen(true)}
                title="Theme settings"
                className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <Palette className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                title="Export calendar"
                className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSettingsOpen(true)}
                title="Calendar settings"
                className="transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </>
          )}

          <Button
            onClick={() => setIsEventModalOpen(true)}
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95",
              "shadow-lg hover:shadow-xl hover:shadow-blue-500/25",
              "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
            )}
            size={isMobile ? "sm" : "default"}
          >
            <Plus className="h-4 w-4 mr-1 md:mr-2" />
            {isMobile ? "New" : "New Event"}
          </Button>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  )
}
