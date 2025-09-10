"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Sun, Cloud, CloudRain, Snow, Wind, Thermometer } from "lucide-react"
import { format } from "date-fns"

interface WeatherData {
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
  humidity: number
  windSpeed: number
  location: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 72,
    condition: "sunny",
    humidity: 45,
    windSpeed: 8,
    location: "San Francisco",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Simulate weather data fetching
  useEffect(() => {
    const fetchWeather = () => {
      setIsLoading(true)
      setTimeout(() => {
        // Mock weather data - in real app would be API call
        const conditions: WeatherData["condition"][] = ["sunny", "cloudy", "rainy", "windy"]
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
        
        setWeather({
          temperature: Math.floor(Math.random() * 30) + 60, // 60-90°F
          condition: randomCondition,
          humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
          windSpeed: Math.floor(Math.random() * 15) + 3, // 3-18 mph
          location: "San Francisco",
        })
        setIsLoading(false)
      }, 1000)
    }

    fetchWeather()
    // Update weather every hour
    const interval = setInterval(fetchWeather, 3600000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "snowy":
        return <Snow className="h-8 w-8 text-blue-200" />
      case "windy":
        return <Wind className="h-8 w-8 text-gray-600" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getWeatherGradient = () => {
    switch (weather.condition) {
      case "sunny":
        return "from-yellow-400 to-orange-500"
      case "cloudy":
        return "from-gray-400 to-gray-600"
      case "rainy":
        return "from-blue-400 to-blue-600"
      case "snowy":
        return "from-blue-200 to-blue-400"
      case "windy":
        return "from-gray-500 to-gray-700"
      default:
        return "from-yellow-400 to-orange-500"
    }
  }

  return (
    <Card className="p-4 mb-4 overflow-hidden relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getWeatherGradient()} opacity-10 pointer-events-none`}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm text-muted-foreground">Weather Today</h3>
          <span className="text-xs text-muted-foreground">{format(new Date(), "MMM d")}</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {getWeatherIcon()}
              <div>
                <div className="text-2xl font-bold">{weather.temperature}°</div>
                <div className="text-xs text-muted-foreground capitalize">{weather.condition}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Humidity: {weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Wind: {weather.windSpeed} mph</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              📍 {weather.location}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}