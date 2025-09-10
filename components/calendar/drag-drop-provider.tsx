"use client"

import { createContext, useContext, useState, useRef, useEffect } from "react"
import { useCalendar } from "./calendar-context"
import { format, addMinutes, differenceInMinutes } from "date-fns"

interface DragState {
  isDragging: boolean
  draggedEvent: any | null
  draggedEventId: string | null
  dragOffset: { x: number; y: number }
  dropZone: { date: Date; time?: Date } | null
}

interface DragDropContextType {
  dragState: DragState
  startDrag: (event: any, clientX: number, clientY: number) => void
  updateDrag: (clientX: number, clientY: number) => void
  endDrag: () => void
  setDropZone: (zone: { date: Date; time?: Date } | null) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const { updateEvent } = useCalendar()
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedEvent: null,
    draggedEventId: null,
    dragOffset: { x: 0, y: 0 },
    dropZone: null
  })
  
  const dragElementRef = useRef<HTMLDivElement | null>(null)
  
  const startDrag = (event: any, clientX: number, clientY: number) => {
    setDragState({
      isDragging: true,
      draggedEvent: event,
      draggedEventId: event.id,
      dragOffset: { x: clientX, y: clientY },
      dropZone: null
    })
    
    // Create visual drag element
    createDragElement(event, clientX, clientY)
    
    // Add global mouse move and up listeners
    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
  }
  
  const updateDrag = (clientX: number, clientY: number) => {
    if (!dragState.isDragging) return
    
    // Update drag element position
    if (dragElementRef.current) {
      dragElementRef.current.style.left = `${clientX - 100}px`
      dragElementRef.current.style.top = `${clientY - 20}px`
    }
  }
  
  const endDrag = () => {
    if (!dragState.isDragging || !dragState.draggedEvent) return
    
    // Apply the drop if there's a valid drop zone
    if (dragState.dropZone) {
      const originalEvent = dragState.draggedEvent
      const originalDuration = differenceInMinutes(originalEvent.endDate, originalEvent.startDate)
      
      let newStartDate = dragState.dropZone.date
      if (dragState.dropZone.time) {
        newStartDate = dragState.dropZone.time
      }
      
      const newEndDate = addMinutes(newStartDate, originalDuration)
      
      updateEvent(originalEvent.id, {
        startDate: newStartDate,
        endDate: newEndDate
      })
    }
    
    // Cleanup
    cleanupDrag()
  }
  
  const setDropZone = (zone: { date: Date; time?: Date } | null) => {
    setDragState(prev => ({ ...prev, dropZone: zone }))
  }
  
  const handleGlobalMouseMove = (e: MouseEvent) => {
    updateDrag(e.clientX, e.clientY)
  }
  
  const handleGlobalMouseUp = () => {
    endDrag()
  }
  
  const createDragElement = (event: any, x: number, y: number) => {
    const dragElement = document.createElement("div")
    dragElement.className = `
      fixed z-50 pointer-events-none select-none p-2 rounded-md shadow-lg border
      bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
      transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200
      animate-pulse
    `
    dragElement.style.left = `${x}px`
    dragElement.style.top = `${y}px`
    dragElement.style.borderLeftColor = event.color
    dragElement.style.borderLeftWidth = "4px"
    
    dragElement.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" style="background-color: ${event.color}"></div>
        <div>
          <div class="font-medium text-sm">${event.title}</div>
          <div class="text-xs text-gray-500">
            ${event.isAllDay ? "All Day" : format(event.startDate, "h:mm a")}
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(dragElement)
    dragElementRef.current = dragElement
  }
  
  const cleanupDrag = () => {
    // Remove drag element
    if (dragElementRef.current) {
      document.body.removeChild(dragElementRef.current)
      dragElementRef.current = null
    }
    
    // Remove global listeners
    document.removeEventListener("mousemove", handleGlobalMouseMove)
    document.removeEventListener("mouseup", handleGlobalMouseUp)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
    
    // Reset state
    setDragState({
      isDragging: false,
      draggedEvent: null,
      draggedEventId: null,
      dragOffset: { x: 0, y: 0 },
      dropZone: null
    })
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupDrag()
    }
  }, [])
  
  return (
    <DragDropContext.Provider value={{
      dragState,
      startDrag,
      updateDrag,
      endDrag,
      setDropZone
    }}>
      {children}
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}