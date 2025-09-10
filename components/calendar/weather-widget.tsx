"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Sun, Cloud, CloudRain, Snowflake, Wind, Thermometer } from "lucide-react"
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

  // Fetch real weather data from Open-Meteo API
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true)
      try {
        // Get user's approximate location (using San Francisco as default)
        const latitude = 37.7749
        const longitude = -122.4194
        
        // Open-Meteo API call
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
        )
        
        if (!response.ok) {
          throw new Error('Weather API request failed')
        }
        
        const data = await response.json()
        
        // Map weather codes to our conditions
        const getCondition = (code: number): WeatherData["condition"] => {
          if (code === 0) return "sunny"
          if (code >= 1 && code <= 3) return "cloudy"
          if (code >= 51 && code <= 67) return "rainy"
          if (code >= 71 && code <= 77) return "snowy"
          if (code >= 95) return "windy"
          return "cloudy"
        }
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          condition: getCondition(data.current.weather_code),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          location: "San Francisco", // In real app, would reverse geocode coordinates
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching weather:', error)
        // Fallback to mock data
        setWeather({
          temperature: 72,
          condition: "sunny",
          humidity: 45,
          windSpeed: 8,
          location: "San Francisco",
        })
        setIsLoading(false)
      }
    }

    fetchWeather()
    // Update weather every 30 minutes
    const interval = setInterval(fetchWeather, 1800000)
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
        return <Snowflake className="h-8 w-8 text-blue-200" />
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