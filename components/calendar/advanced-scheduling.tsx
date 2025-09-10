"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCalendar } from "./calendar-context"
import { 
  Users, 
  MapPin, 
  Wifi, 
  Monitor, 
  Coffee, 
  Car,
  Building,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  Zap,
  Brain,
  Target
} from "lucide-react"
import { format, addMinutes, isWithinInterval } from "date-fns"

interface Resource {
  id: string
  name: string
  type: "room" | "equipment" | "vehicle" | "person"
  capacity?: number
  location: string
  amenities: string[]
  availability: { start: Date; end: Date }[]
  bookings: { start: Date; end: Date; eventId: string }[]
  cost?: number
  description: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  timezone: string
  workingHours: { start: number; end: number }
  availability: "available" | "busy" | "away" | "offline"
  skills: string[]
  avatar?: string
}

const mockResources: Resource[] = [
  {
    id: "conf-room-a",
    name: "Conference Room A",
    type: "room",
    capacity: 12,
    location: "Floor 3, Building A",
    amenities: ["Projector", "Whiteboard", "Video Conferencing", "WiFi"],
    availability: [],
    bookings: [],
    cost: 50,
    description: "Large conference room with modern AV equipment"
  },
  {
    id: "conf-room-b",
    name: "Conference Room B",
    type: "room",
    capacity: 6,
    location: "Floor 2, Building A",
    amenities: ["TV Screen", "Whiteboard", "WiFi"],
    availability: [],
    bookings: [],
    cost: 30,
    description: "Medium meeting room perfect for team discussions"
  },
  {
    id: "projector-1",
    name: "Portable Projector #1",
    type: "equipment",
    location: "Equipment Storage",
    amenities: ["4K Resolution", "Wireless Connection", "Carrying Case"],
    availability: [],
    bookings: [],
    cost: 25,
    description: "High-quality portable projector for presentations"
  },
  {
    id: "company-car-1",
    name: "Tesla Model 3",
    type: "vehicle",
    capacity: 4,
    location: "Parking Garage Level B1",
    amenities: ["GPS", "Bluetooth", "Fast Charging"],
    availability: [],
    bookings: [],
    cost: 100,
    description: "Electric vehicle for business trips and client meetings"
  }
]

const mockTeamMembers: TeamMember[] = [
  {
    id: "john-doe",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Senior Developer",
    department: "Engineering",
    timezone: "PST",
    workingHours: { start: 9, end: 17 },
    availability: "available",
    skills: ["React", "TypeScript", "Node.js", "AWS"]
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Product Manager",
    department: "Product",
    timezone: "EST",
    workingHours: { start: 8, end: 16 },
    availability: "busy",
    skills: ["Product Strategy", "User Research", "Analytics", "Agile"]
  },
  {
    id: "mike-chen",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "UX Designer",
    department: "Design",
    timezone: "PST",
    workingHours: { start: 10, end: 18 },
    availability: "available",
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"]
  },
  {
    id: "emily-davis",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Marketing Director",
    department: "Marketing",
    timezone: "CST",
    workingHours: { start: 8, end: 16 },
    availability: "away",
    skills: ["Digital Marketing", "Content Strategy", "SEO", "Analytics"]
  }
]

export function AdvancedScheduling() {
  const { events, addEvent } = useCalendar()
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>([])
  const [meetingDuration, setMeetingDuration] = useState(60)
  const [preferredTime, setPreferredTime] = useState("09:00")
  const [suggestedSlots, setSuggestedSlots] = useState<Date[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "room":
        return <Building className="h-4 w-4" />
      case "equipment":
        return <Monitor className="h-4 w-4" />
      case "vehicle":
        return <Car className="h-4 w-4" />
      case "person":
        return <Users className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getAvailabilityColor = (availability: TeamMember["availability"]) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "busy":
        return "bg-red-100 text-red-800 border-red-200"
      case "away":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const findOptimalMeetingTimes = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const now = new Date()
      const suggestions = []
      
      // Generate 3 optimal time suggestions
      for (let i = 0; i < 3; i++) {
        const suggestedTime = new Date(now)
        suggestedTime.setDate(now.getDate() + i + 1)
        suggestedTime.setHours(9 + i * 2, 0, 0, 0)
        suggestions.push(suggestedTime)
      }
      
      setSuggestedSlots(suggestions)
      setIsAnalyzing(false)
    }, 2000)
  }

  const scheduleOptimalMeeting = (startTime: Date) => {
    const endTime = addMinutes(startTime, meetingDuration)
    
    addEvent({
      title: "Team Meeting",
      description: `Meeting with ${selectedTeamMembers.map(m => m.name).join(", ")}${selectedResource ? `\nResource: ${selectedResource.name}` : ""}`,
      startDate: startTime,
      endDate: endTime,
      color: "#3B82F6",
      category: "Work",
      location: selectedResource?.location || "TBD",
      calendarId: "work",
      isAllDay: false,
      attendees: selectedTeamMembers.map(m => m.email)
    })
    
    // Reset form
    setSelectedResource(null)
    setSelectedTeamMembers([])
    setSuggestedSlots([])
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">AI-Powered Scheduling</h3>
        <Badge variant="secondary" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          Smart
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Booking */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Resource Booking
          </h4>
          
          <div className="space-y-3">
            {mockResources.map((resource) => (
              <div
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedResource?.id === resource.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/50"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getResourceIcon(resource.type)}
                    <span className="font-medium text-sm">{resource.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {resource.type}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{resource.location}</span>
                  {resource.capacity && (
                    <>
                      <Users className="h-3 w-3 ml-2" />
                      <span>{resource.capacity} people</span>
                    </>
                  )}
                  {resource.cost && (
                    <>
                      <span className="ml-2">${resource.cost}/hour</span>
                    </>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {resource.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {resource.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{resource.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Availability */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Availability
          </h4>
          
          <div className="space-y-3">
            {mockTeamMembers.map((member) => {
              const isSelected = selectedTeamMembers.find(m => m.id === member.id)
              
              return (
                <div
                  key={member.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTeamMembers(prev => prev.filter(m => m.id !== member.id))
                    } else {
                      setSelectedTeamMembers(prev => [...prev, member])
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/50"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                    <Badge className={`text-xs ${getAvailabilityColor(member.availability)}`}>
                      {member.availability}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{member.department}</span>
                    <span>•</span>
                    <span>{member.timezone}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{member.workingHours.start}:00-{member.workingHours.end}:00</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Meeting Configuration */}
      <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Meeting Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Select value={meetingDuration.toString()} onValueChange={(value) => setMeetingDuration(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Preferred Time</Label>
            <Input
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select defaultValue="normal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={findOptimalMeetingTimes}
          disabled={selectedTeamMembers.length === 0 || isAnalyzing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Analyzing Availability...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Find Optimal Meeting Times
            </>
          )}
        </Button>
      </div>

      {/* AI Suggestions */}
      {suggestedSlots.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-medium mb-3 flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4" />
            AI-Recommended Time Slots
          </h4>
          
          <div className="space-y-2">
            {suggestedSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border">
                <div>
                  <div className="font-medium text-sm">
                    {format(slot, "EEEE, MMMM d")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(slot, "h:mm a")} - {format(addMinutes(slot, meetingDuration), "h:mm a")}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ All attendees available • Resource available
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => scheduleOptimalMeeting(slot)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Schedule
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {(selectedResource || selectedTeamMembers.length > 0) && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-2">Selection Summary</h5>
          <div className="space-y-1 text-xs">
            {selectedResource && (
              <div className="flex items-center gap-2">
                <Building className="h-3 w-3" />
                <span>Resource: {selectedResource.name}</span>
              </div>
            )}
            {selectedTeamMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>Attendees: {selectedTeamMembers.map(m => m.name).join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}