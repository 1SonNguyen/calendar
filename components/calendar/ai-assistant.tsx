"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCalendar } from "./calendar-context"
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Zap,
  Brain,
  MessageSquare,
  Lightbulb,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react"
import { format, addDays, addHours, isAfter, isBefore } from "date-fns"

interface AIMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: AISuggestion[]
  metadata?: Record<string, any>
}

interface AISuggestion {
  id: string
  type: "event" | "optimization" | "insight" | "action"
  title: string
  description: string
  confidence: number
  action?: () => void
  icon: React.ReactNode
}

const mockAIResponses = [
  "I can help you schedule that meeting! Based on your calendar, I see you have availability tomorrow at 2 PM and Thursday at 10 AM. Which works better?",
  "I notice you have back-to-back meetings from 9 AM to 3 PM today. Would you like me to suggest some break times?",
  "Your productivity seems highest on Tuesday mornings. Should I prioritize scheduling important meetings then?",
  "I found a conflict with your 'Team Standup' and 'Client Call' both scheduled for 10 AM tomorrow. Would you like me to reschedule one?",
  "Based on your recent patterns, you might want to block 30 minutes before important presentations for preparation time.",
  "I can see you're traveling next week. Should I automatically decline non-essential meetings during your travel days?"
]

export function AIAssistant() {
  const { events, addEvent, currentDate } = useCalendar()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hi! I'm your AI calendar assistant. I can help you schedule meetings, optimize your time, and provide insights about your calendar patterns. What would you like to do?",
      timestamp: new Date(),
      suggestions: [
        {
          id: "schedule-meeting",
          type: "action",
          title: "Schedule a Meeting",
          description: "Find the best time for your next meeting",
          confidence: 95,
          icon: <Calendar className="h-4 w-4" />
        },
        {
          id: "optimize-schedule",
          type: "optimization",
          title: "Optimize My Schedule",
          description: "Get suggestions to improve your calendar",
          confidence: 88,
          icon: <Target className="h-4 w-4" />
        },
        {
          id: "calendar-insights",
          type: "insight",
          title: "Calendar Insights",
          description: "Learn about your scheduling patterns",
          confidence: 92,
          icon: <TrendingUp className="h-4 w-4" />
        }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): AIMessage => {
    const responses = mockAIResponses
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    // Generate contextual suggestions based on user input
    const suggestions: AISuggestion[] = []
    
    if (userMessage.toLowerCase().includes("meeting") || userMessage.toLowerCase().includes("schedule")) {
      suggestions.push({
        id: "quick-meeting",
        type: "event",
        title: "Schedule 30min Meeting",
        description: "Tomorrow at 2:00 PM",
        confidence: 90,
        icon: <Calendar className="h-4 w-4" />,
        action: () => {
          const tomorrow = addDays(new Date(), 1)
          tomorrow.setHours(14, 0, 0, 0)
          addEvent({
            title: "AI Suggested Meeting",
            startDate: tomorrow,
            endDate: addHours(tomorrow, 0.5),
            color: "#3B82F6",
            category: "Work",
            calendarId: "work",
            description: "Meeting scheduled by AI assistant"
          })
        }
      })
    }
    
    if (userMessage.toLowerCase().includes("optimize") || userMessage.toLowerCase().includes("improve")) {
      suggestions.push({
        id: "add-breaks",
        type: "optimization",
        title: "Add Buffer Time",
        description: "15min breaks between meetings",
        confidence: 85,
        icon: <Clock className="h-4 w-4" />
      })
    }
    
    if (userMessage.toLowerCase().includes("conflict") || userMessage.toLowerCase().includes("busy")) {
      suggestions.push({
        id: "resolve-conflict",
        type: "action",
        title: "Resolve Conflicts",
        description: "Move overlapping meetings",
        confidence: 88,
        icon: <AlertCircle className="h-4 w-4" />
      })
    }

    return {
      id: Date.now().toString(),
      type: "assistant",
      content: randomResponse,
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    if (suggestion.action) {
      suggestion.action()
    }
    
    const responseMessage: AIMessage = {
      id: Date.now().toString(),
      type: "assistant",
      content: `Great! I've ${suggestion.type === "event" ? "scheduled" : "applied"} "${suggestion.title}" for you. Is there anything else I can help with?`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, responseMessage])
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // In a real implementation, this would start/stop speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        setInputValue("Schedule a meeting with the design team for next week")
      }, 3000)
    }
  }

  const getSuggestionColor = (type: AISuggestion["type"]) => {
    switch (type) {
      case "event":
        return "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800"
      case "optimization":
        return "bg-green-50 hover:bg-green-100 border-green-200 text-green-800"
      case "insight":
        return "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800"
      case "action":
        return "bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-800"
      default:
        return "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="h-[500px] flex flex-col shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-avatar.png" />
                <AvatarFallback className="bg-white text-blue-600">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Smart
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                {message.type === "assistant" && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-muted-foreground">AI Assistant</span>
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-600 text-white ml-4"
                      : "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {format(message.timestamp, "h:mm a")}
                  </div>
                </div>

                {/* AI Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full p-3 rounded-lg border text-left transition-all duration-200 hover:scale-[1.02] ${getSuggestionColor(suggestion.type)}`}
                      >
                        <div className="flex items-start gap-3">
                          {suggestion.icon}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{suggestion.title}</div>
                            <div className="text-xs opacity-80">{suggestion.description}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="text-xs opacity-60">Confidence:</div>
                              <div className="text-xs font-medium">{suggestion.confidence}%</div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything about your calendar..."
                className="pr-10"
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceInput}
                className={`absolute right-1 top-1 h-6 w-6 p-0 ${isListening ? "text-red-600" : "text-gray-400"}`}
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {isListening && (
            <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              Listening...
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}