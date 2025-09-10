"use client"

import { useEffect } from "react"
import { useCalendar } from "./calendar-context"
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns"

export function KeyboardShortcuts() {
  const { 
    currentDate, 
    setCurrentDate, 
    view, 
    setView, 
    setIsEventModalOpen,
    setIsTransitioning 
  } = useCalendar()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return
      }

      // Ignore if modal is open
      if (document.querySelector('[role="dialog"]')) {
        return
      }

      const { key, ctrlKey, metaKey, shiftKey, altKey } = event
      const cmdOrCtrl = ctrlKey || metaKey

      // Navigation shortcuts
      if (!cmdOrCtrl && !shiftKey && !altKey) {
        switch (key) {
          case "ArrowLeft":
          case "h":
            event.preventDefault()
            navigateDate("prev")
            break
          case "ArrowRight":
          case "l":
            event.preventDefault()
            navigateDate("next")
            break
          case "ArrowUp":
          case "k":
            event.preventDefault()
            if (view === "day") navigateWeeks("prev")
            else if (view === "week") navigateWeeks("prev")
            else navigateDate("prev")
            break
          case "ArrowDown":
          case "j":
            event.preventDefault()
            if (view === "day") navigateWeeks("next")
            else if (view === "week") navigateWeeks("next")
            else navigateDate("next")
            break
          case "t":
            event.preventDefault()
            goToToday()
            break
          case "n":
            event.preventDefault()
            setIsEventModalOpen(true)
            break
          case "Escape":
            event.preventDefault()
            // Close any open modals or dialogs
            const closeButtons = document.querySelectorAll('[aria-label="Close"], [data-close-modal]')
            closeButtons.forEach(button => (button as HTMLElement).click())
            break
        }
      }

      // View switching shortcuts
      if (!cmdOrCtrl && !shiftKey && !altKey) {
        switch (key) {
          case "1":
            event.preventDefault()
            switchView("day")
            break
          case "2":
            event.preventDefault()
            switchView("week")
            break
          case "3":
            event.preventDefault()
            switchView("month")
            break
          case "4":
            event.preventDefault()
            switchView("year")
            break
          case "5":
            event.preventDefault()
            switchView("timeline")
            break
        }
      }

      // Cmd/Ctrl shortcuts
      if (cmdOrCtrl && !shiftKey && !altKey) {
        switch (key) {
          case "f":
            event.preventDefault()
            // Open search
            const searchButton = document.querySelector('[title="Search events"]')
            if (searchButton) (searchButton as HTMLElement).click()
            break
          case ",":
            event.preventDefault()
            // Open settings
            const settingsButton = document.querySelector('[title="Calendar settings"]')
            if (settingsButton) (settingsButton as HTMLElement).click()
            break
        }
      }

      // Show keyboard shortcuts help with ?
      if (key === "?" && !cmdOrCtrl && !shiftKey && !altKey) {
        event.preventDefault()
        showKeyboardShortcuts()
      }
    }

    const navigateDate = (direction: "prev" | "next") => {
      setIsTransitioning(true)
      setTimeout(() => {
        if (view === "month" || view === "year" || view === "timeline") {
          setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
        } else if (view === "week") {
          setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
        } else {
          setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
        }
        setTimeout(() => setIsTransitioning(false), 300)
      }, 100)
    }

    const navigateWeeks = (direction: "prev" | "next") => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
        setTimeout(() => setIsTransitioning(false), 300)
      }, 100)
    }

    const switchView = (newView: typeof view) => {
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

    const showKeyboardShortcuts = () => {
      // Create and show keyboard shortcuts modal
      const modal = document.createElement("div")
      modal.className = `
        fixed inset-0 z-50 flex items-center justify-center p-4 
        bg-black bg-opacity-50 animate-in fade-in duration-200
      `
      modal.innerHTML = `
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onclick="this.closest('.fixed').remove()">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <h4 class="font-medium mb-2">Navigation</h4>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between"><span>Previous/Next</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">← → or h l</kbd></div>
                <div class="flex justify-between"><span>Up/Down</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">↑ ↓ or k j</kbd></div>
                <div class="flex justify-between"><span>Today</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">t</kbd></div>
              </div>
            </div>
            <div>
              <h4 class="font-medium mb-2">Views</h4>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between"><span>Day View</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">1</kbd></div>
                <div class="flex justify-between"><span>Week View</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">2</kbd></div>
                <div class="flex justify-between"><span>Month View</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">3</kbd></div>
                <div class="flex justify-between"><span>Year View</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">4</kbd></div>
                <div class="flex justify-between"><span>Timeline View</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">5</kbd></div>
              </div>
            </div>
            <div>
              <h4 class="font-medium mb-2">Actions</h4>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between"><span>New Event</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">n</kbd></div>
                <div class="flex justify-between"><span>Search</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">⌘ f</kbd></div>
                <div class="flex justify-between"><span>Settings</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">⌘ ,</kbd></div>
                <div class="flex justify-between"><span>Close/Escape</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">esc</kbd></div>
                <div class="flex justify-between"><span>Help</span><kbd class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">?</kbd></div>
              </div>
            </div>
          </div>
        </div>
      `
      
      document.body.appendChild(modal)
      
      // Remove modal when clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.remove()
        }
      })
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentDate, view, setCurrentDate, setView, setIsEventModalOpen, setIsTransitioning])

  return null // This component doesn't render anything
}