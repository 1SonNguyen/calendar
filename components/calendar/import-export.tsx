"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCalendar } from "./calendar-context"
import { 
  Download, 
  Upload, 
  FileText, 
  Calendar as CalendarIcon,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { format } from "date-fns"

export function ImportExport() {
  const { events, calendars, addEvent } = useCalendar()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    count?: number
  } | null>(null)

  const exportToICS = async () => {
    setIsExporting(true)
    
    try {
      // Create iCalendar format
      let icsContent = "BEGIN:VCALENDAR\r\n"
      icsContent += "VERSION:2.0\r\n"
      icsContent += "PRODID:-//Samsung Calendar//NONSGML v1.0//EN\r\n"
      icsContent += "CALSCALE:GREGORIAN\r\n"
      icsContent += "METHOD:PUBLISH\r\n"
      
      events.forEach(event => {
        icsContent += "BEGIN:VEVENT\r\n"
        icsContent += `UID:${event.id}@samsungcalendar.local\r\n`
        icsContent += `DTSTART:${formatDateForICS(event.startDate)}\r\n`
        icsContent += `DTEND:${formatDateForICS(event.endDate)}\r\n`
        icsContent += `SUMMARY:${escapeICSText(event.title)}\r\n`
        
        if (event.description) {
          icsContent += `DESCRIPTION:${escapeICSText(event.description)}\r\n`
        }
        
        if (event.location) {
          icsContent += `LOCATION:${escapeICSText(event.location)}\r\n`
        }
        
        icsContent += `CATEGORIES:${event.category || 'Personal'}\r\n`
        icsContent += `STATUS:CONFIRMED\r\n`
        icsContent += `CREATED:${formatDateForICS(new Date())}\r\n`
        icsContent += `LAST-MODIFIED:${formatDateForICS(new Date())}\r\n`
        icsContent += "END:VEVENT\r\n"
      })
      
      icsContent += "END:VCALENDAR\r\n"
      
      // Download file
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `samsung-calendar-${format(new Date(), 'yyyy-MM-dd')}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setTimeout(() => setIsExporting(false), 1000)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
    }
  }

  const formatDateForICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeICSText = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const text = await file.text()
      const importedEvents = parseICSFile(text)
      
      let importCount = 0
      importedEvents.forEach(eventData => {
        try {
          addEvent({
            title: eventData.title || 'Imported Event',
            description: eventData.description,
            startDate: eventData.startDate,
            endDate: eventData.endDate,
            color: eventData.color || '#3B82F6',
            category: eventData.category || 'Imported',
            location: eventData.location,
            calendarId: 'personal',
            isAllDay: eventData.isAllDay || false
          })
          importCount++
        } catch (error) {
          console.error('Failed to import event:', error)
        }
      })

      setImportResult({
        success: true,
        message: `Successfully imported ${importCount} events`,
        count: importCount
      })
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to parse calendar file. Please check the file format.',
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const parseICSFile = (icsContent: string) => {
    const events: any[] = []
    const lines = icsContent.split(/\r?\n/)
    let currentEvent: any = null
    
    for (const line of lines) {
      const [key, value] = line.split(':')
      
      if (key === 'BEGIN' && value === 'VEVENT') {
        currentEvent = {}
      } else if (key === 'END' && value === 'VEVENT' && currentEvent) {
        if (currentEvent.startDate && currentEvent.endDate) {
          events.push(currentEvent)
        }
        currentEvent = null
      } else if (currentEvent) {
        switch (key) {
          case 'SUMMARY':
            currentEvent.title = value
            break
          case 'DESCRIPTION':
            currentEvent.description = value
            break
          case 'LOCATION':
            currentEvent.location = value
            break
          case 'DTSTART':
            currentEvent.startDate = parseICSDate(value)
            break
          case 'DTEND':
            currentEvent.endDate = parseICSDate(value)
            break
          case 'CATEGORIES':
            currentEvent.category = value
            break
        }
      }
    }
    
    return events
  }

  const parseICSDate = (dateString: string): Date => {
    // Handle various ICS date formats
    const cleanDate = dateString.replace(/[TZ]/g, '')
    const year = parseInt(cleanDate.substr(0, 4))
    const month = parseInt(cleanDate.substr(4, 2)) - 1
    const day = parseInt(cleanDate.substr(6, 2))
    const hour = parseInt(cleanDate.substr(8, 2)) || 0
    const minute = parseInt(cleanDate.substr(10, 2)) || 0
    
    return new Date(year, month, day, hour, minute)
  }

  const exportToJSON = () => {
    const data = {
      calendars,
      events,
      exportDate: new Date().toISOString(),
      version: "1.0"
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `samsung-calendar-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw className="h-4 w-4 text-emerald-600" />
        <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Import & Export</h3>
        <Badge variant="secondary" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Data
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Export Section */}
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-emerald-100 dark:border-emerald-800">
          <h4 className="font-medium text-sm mb-2">Export Calendar</h4>
          <div className="flex gap-2">
            <Button
              onClick={exportToICS}
              disabled={isExporting || events.length === 0}
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isExporting ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Download className="h-3 w-3 mr-1" />
              )}
              ICS File ({events.length})
            </Button>
            <Button
              onClick={exportToJSON}
              disabled={events.length === 0}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <FileText className="h-3 w-3 mr-1" />
              JSON Backup
            </Button>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-emerald-100 dark:border-emerald-800">
          <h4 className="font-medium text-sm mb-2">Import Calendar</h4>
          <div className="space-y-2">
            <Input
              type="file"
              accept=".ics,.ical,.ifb,.icalendar"
              onChange={handleFileImport}
              disabled={isImporting}
              className="text-xs"
            />
            
            {isImporting && (
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <Loader2 className="h-3 w-3 animate-spin" />
                Importing calendar...
              </div>
            )}
            
            {importResult && (
              <div className={`flex items-center gap-2 text-xs p-2 rounded ${
                importResult.success 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {importResult.success ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {importResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Sync Options */}
        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-emerald-100 dark:border-emerald-800">
          <h4 className="font-medium text-sm mb-2">Sync with Services</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs"
              disabled
            >
              <ExternalLink className="h-3 w-3" />
              Google Cal
            </Button>
            <Button
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-xs"
              disabled
            >
              <ExternalLink className="h-3 w-3" />
              Outlook
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            External sync coming soon!
          </p>
        </div>
      </div>
    </Card>
  )
}