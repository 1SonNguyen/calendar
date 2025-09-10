"use client"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarSidebar } from "@/components/calendar/calendar-sidebar"
import { CalendarMain } from "@/components/calendar/calendar-main"
import { EventModal } from "@/components/calendar/event-modal"
import { CalendarModal } from "@/components/calendar/calendar-modal"
import { ThemeModal } from "@/components/theme-modal"
import { AnalyticsModal } from "@/components/calendar/analytics-modal"
import { CalendarProvider } from "@/components/calendar/calendar-context"
import { AnalyticsProvider } from "@/components/calendar/analytics-context"
import { DragDropProvider } from "@/components/calendar/drag-drop-provider"
import { KeyboardShortcuts } from "@/components/calendar/keyboard-shortcuts"
import { MobileNavigation } from "@/components/calendar/mobile-navigation"
import { useIsMobile } from "@/hooks/use-mobile"

export default function CalendarPage() {
  const isMobile = useIsMobile()

  return (
    <CalendarProvider>
      <AnalyticsProvider>
        <DragDropProvider>
          <div className="h-screen bg-background flex flex-col overflow-hidden">
            <CalendarHeader />
            <div className="flex-1 flex overflow-hidden relative">
              <CalendarSidebar />
              <CalendarMain />
              {isMobile && <MobileNavigation />}
            </div>
            <EventModal />
            <CalendarModal />
            <ThemeModal />
            <AnalyticsModal />
            <KeyboardShortcuts />
          </div>
        </DragDropProvider>
      </AnalyticsProvider>
    </CalendarProvider>
  )
}
