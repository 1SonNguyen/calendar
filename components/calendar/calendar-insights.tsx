"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useCalendar } from "./calendar-context"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Calendar,
  Award,
  Zap,
  Brain
} from "lucide-react"
import { format, startOfWeek, endOfWeek, isWithinInterval, isSameDay, getHours } from "date-fns"

interface ProductivityInsight {
  id: string
  type: "achievement" | "warning" | "suggestion" | "goal"
  icon: React.ReactNode
  title: string
  description: string
  value?: number
  target?: number
  color: string
}

export function CalendarInsights() {
  const { events, currentDate } = useCalendar()
  const [insights, setInsights] = useState<ProductivityInsight[]>([])

  useEffect(() => {
    generateInsights()
  }, [events, currentDate])

  const generateInsights = () => {
    const newInsights: ProductivityInsight[] = []
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    
    // Get this week's events
    const weekEvents = events.filter(event => 
      isWithinInterval(event.startDate, { start: weekStart, end: weekEnd })
    )
    
    // Calculate productivity metrics
    const workEvents = weekEvents.filter(event => event.category === "Work")
    const healthEvents = weekEvents.filter(event => event.category === "Health")
    const personalEvents = weekEvents.filter(event => event.category === "Personal")
    
    // Work-life balance insight
    const workHours = workEvents.reduce((total, event) => {
      const duration = (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60)
      return total + duration
    }, 0)
    
    const personalHours = personalEvents.reduce((total, event) => {
      const duration = (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60)
      return total + duration
    }, 0)
    
    const workLifeBalance = workHours > 0 ? (personalHours / workHours) * 100 : 100
    
    if (workLifeBalance < 30) {
      newInsights.push({
        id: "work-life-balance",
        type: "warning",
        icon: <TrendingDown className="h-4 w-4" />,
        title: "Work-Life Balance",
        description: "Consider scheduling more personal time this week",
        value: Math.round(workLifeBalance),
        target: 50,
        color: "text-orange-600"
      })
    } else if (workLifeBalance > 70) {
      newInsights.push({
        id: "work-life-balance",
        type: "achievement",
        icon: <Award className="h-4 w-4" />,
        title: "Great Balance!",
        description: "Excellent work-life balance this week",
        value: Math.round(workLifeBalance),
        target: 50,
        color: "text-green-600"
      })
    }
    
    // Health tracking insight
    if (healthEvents.length >= 3) {
      newInsights.push({
        id: "health-streak",
        type: "achievement",
        icon: <Target className="h-4 w-4" />,
        title: "Health Champion",
        description: `${healthEvents.length} health activities this week!`,
        value: healthEvents.length,
        target: 5,
        color: "text-green-600"
      })
    } else if (healthEvents.length === 0) {
      newInsights.push({
        id: "health-reminder",
        type: "suggestion",
        icon: <Zap className="h-4 w-4" />,
        title: "Health Focus",
        description: "Schedule some wellness activities this week",
        color: "text-blue-600"
      })
    }
    
    // Productivity peak time analysis
    const morningEvents = weekEvents.filter(event => {
      const hour = getHours(event.startDate)
      return hour >= 6 && hour < 12
    })
    
    const afternoonEvents = weekEvents.filter(event => {
      const hour = getHours(event.startDate)
      return hour >= 12 && hour < 18
    })
    
    const eveningEvents = weekEvents.filter(event => {
      const hour = getHours(event.startDate)
      return hour >= 18 && hour < 24
    })
    
    let peakTime = "morning"
    let maxEvents = morningEvents.length
    
    if (afternoonEvents.length > maxEvents) {
      peakTime = "afternoon"
      maxEvents = afternoonEvents.length
    }
    
    if (eveningEvents.length > maxEvents) {
      peakTime = "evening"
      maxEvents = eveningEvents.length
    }
    
    if (maxEvents > 0) {
      newInsights.push({
        id: "peak-time",
        type: "suggestion",
        icon: <Brain className="h-4 w-4" />,
        title: "Peak Productivity",
        description: `You're most active in the ${peakTime} (${maxEvents} events)`,
        color: "text-purple-600"
      })
    }
    
    // Weekly goal progress
    const targetEvents = 12 // Target: 12 events per week
    const progress = Math.min((weekEvents.length / targetEvents) * 100, 100)
    
    if (progress >= 80) {
      newInsights.push({
        id: "weekly-goal",
        type: "achievement",
        icon: <TrendingUp className="h-4 w-4" />,
        title: "Weekly Goal",
        description: "Fantastic week! You're hitting your targets",
        value: weekEvents.length,
        target: targetEvents,
        color: "text-green-600"
      })
    } else if (progress < 50) {
      newInsights.push({
        id: "weekly-goal",
        type: "suggestion",
        icon: <Calendar className="h-4 w-4" />,
        title: "Weekly Planning",
        description: "Consider adding more structured activities",
        value: weekEvents.length,
        target: targetEvents,
        color: "text-blue-600"
      })
    }
    
    setInsights(newInsights.slice(0, 3)) // Show top 3 insights
  }

  const getInsightBg = (type: ProductivityInsight["type"]) => {
    switch (type) {
      case "achievement":
        return "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800"
      case "warning":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800"
      case "suggestion":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800"
      case "goal":
        return "bg-purple-50 border-purple-200 dark:bg-purple-950/50 dark:border-purple-800"
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950/50 dark:border-gray-800"
    }
  }

  const getInsightBadge = (type: ProductivityInsight["type"]) => {
    switch (type) {
      case "achievement":
        return { text: "Achievement", class: "bg-green-100 text-green-800 border-green-300" }
      case "warning":
        return { text: "Attention", class: "bg-orange-100 text-orange-800 border-orange-300" }
      case "suggestion":
        return { text: "Tip", class: "bg-blue-100 text-blue-800 border-blue-300" }
      case "goal":
        return { text: "Goal", class: "bg-purple-100 text-purple-800 border-purple-300" }
      default:
        return { text: "Insight", class: "bg-gray-100 text-gray-800 border-gray-300" }
    }
  }

  if (insights.length === 0) return null

  return (
    <Card className="p-4 mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-emerald-600" />
        <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Weekly Insights</h3>
        <Badge variant="secondary" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {format(currentDate, "MMM d")}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight) => {
          const badge = getInsightBadge(insight.type)
          
          return (
            <div key={insight.id} className={`p-3 rounded-lg border ${getInsightBg(insight.type)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={insight.color}>
                    {insight.icon}
                  </div>
                  <span className="font-medium text-sm">{insight.title}</span>
                </div>
                <Badge className={`text-xs ${badge.class}`}>
                  {badge.text}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
              
              {insight.value !== undefined && insight.target !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{insight.value}/{insight.target}</span>
                  </div>
                  <Progress 
                    value={(insight.value / insight.target) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}