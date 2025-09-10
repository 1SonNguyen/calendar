"use client"

import { useState, useEffect } from "react"
import { useAdvancedTheme, type CustomTheme } from "./advanced-theme-provider"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Palette, Sun, Moon, Monitor, Plus, Trash2, RotateCcw, Eye } from "lucide-react"

const FONT_SIZES = [
  { value: "small", label: "Small (14px)" },
  { value: "medium", label: "Medium (16px)" },
  { value: "large", label: "Large (18px)" },
]

const FONT_FAMILIES = [
  { value: "default", label: "Default (Sans)" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
]

export function ThemeModal() {
  const { theme, setTheme } = useTheme()
  const {
    customThemes,
    currentCustomTheme,
    setCurrentCustomTheme,
    addCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    resetToDefault,
    isThemeModalOpen,
    setIsThemeModalOpen,
    applyTheme,
  } = useAdvancedTheme()

  const [activeTab, setActiveTab] = useState("presets")
  const [isCreating, setIsCreating] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<CustomTheme | null>(null)

  const [formData, setFormData] = useState<Partial<CustomTheme>>({
    name: "",
    description: "",
    colors: {
      primary: "#3B82F6",
      secondary: "#64748B",
      accent: "#0EA5E9",
      background: "#FFFFFF",
      foreground: "#0F172A",
      muted: "#F8FAFC",
      border: "#E2E8F0",
    },
    fonts: { size: "medium", family: "default" },
    accessibility: { highContrast: false, reducedMotion: false, focusVisible: true },
  })

  useEffect(() => {
    if (!isThemeModalOpen) {
      setIsCreating(false)
      setPreviewTheme(null)
      setFormData({
        name: "",
        description: "",
        colors: {
          primary: "#3B82F6",
          secondary: "#64748B",
          accent: "#0EA5E9",
          background: "#FFFFFF",
          foreground: "#0F172A",
          muted: "#F8FAFC",
          border: "#E2E8F0",
        },
        fonts: { size: "medium", family: "default" },
        accessibility: { highContrast: false, reducedMotion: false, focusVisible: true },
      })
    }
  }, [isThemeModalOpen])

  const handleCreateTheme = () => {
    if (!formData.name || !formData.colors) return

    const newTheme: CustomTheme = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description || "",
      colors: formData.colors,
      fonts: formData.fonts || { size: "medium", family: "default" },
      accessibility: formData.accessibility || { highContrast: false, reducedMotion: false, focusVisible: true },
    }

    addCustomTheme(newTheme)
    setCurrentCustomTheme(newTheme)
    setIsCreating(false)
  }

  const handlePreviewTheme = (theme: CustomTheme) => {
    setPreviewTheme(theme)
    applyTheme(theme)
  }

  const handleStopPreview = () => {
    setPreviewTheme(null)
    applyTheme(currentCustomTheme)
  }

  const handleApplyTheme = (theme: CustomTheme) => {
    setCurrentCustomTheme(theme)
    setPreviewTheme(null)
  }

  const ColorPicker = ({
    label,
    value,
    onChange,
  }: { label: string; value: string; onChange: (color: string) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border border-border cursor-pointer"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className="flex-1" />
      </div>
    </div>
  )

  return (
    <Dialog open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Advanced Theme Settings
          </DialogTitle>
          <DialogDescription>
            Customize your calendar appearance with themes, colors, and accessibility options.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Theme Presets</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Custom
              </Button>
            </div>

            {isCreating && (
              <Card className="p-4 space-y-4 border-dashed">
                <div className="space-y-2">
                  <Label>Theme Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter theme name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter theme description"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ColorPicker
                    label="Primary Color"
                    value={formData.colors?.primary || "#3B82F6"}
                    onChange={(color) =>
                      setFormData((prev) => ({
                        ...prev,
                        colors: { ...prev.colors!, primary: color },
                      }))
                    }
                  />
                  <ColorPicker
                    label="Accent Color"
                    value={formData.colors?.accent || "#0EA5E9"}
                    onChange={(color) =>
                      setFormData((prev) => ({
                        ...prev,
                        colors: { ...prev.colors!, accent: color },
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateTheme} disabled={!formData.name}>
                    Create Theme
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customThemes.map((theme) => (
                <Card key={theme.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{theme.name}</h4>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                    {currentCustomTheme.id === theme.id && <Badge variant="default">Active</Badge>}
                  </div>

                  <div className="flex gap-2">
                    {Object.entries(theme.colors)
                      .slice(0, 4)
                      .map(([key, color]) => (
                        <div
                          key={key}
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                          title={key}
                        />
                      ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={currentCustomTheme.id === theme.id ? "default" : "outline"}
                      onClick={() => handleApplyTheme(theme)}
                      className="flex-1"
                    >
                      {currentCustomTheme.id === theme.id ? "Applied" : "Apply"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handlePreviewTheme(theme)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!customThemes.slice(0, 4).find((t) => t.id === theme.id) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteCustomTheme(theme.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {previewTheme && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Previewing: {previewTheme.name}</span>
                <Button size="sm" variant="outline" onClick={handleStopPreview} className="ml-auto bg-transparent">
                  Stop Preview
                </Button>
                <Button size="sm" onClick={() => handleApplyTheme(previewTheme)}>
                  Apply
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="customize" className="space-y-4">
            <h3 className="text-lg font-semibold">Customize Current Theme</h3>

            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Primary Color"
                value={currentCustomTheme.colors.primary}
                onChange={(color) =>
                  updateCustomTheme(currentCustomTheme.id, {
                    colors: { ...currentCustomTheme.colors, primary: color },
                  })
                }
              />
              <ColorPicker
                label="Secondary Color"
                value={currentCustomTheme.colors.secondary}
                onChange={(color) =>
                  updateCustomTheme(currentCustomTheme.id, {
                    colors: { ...currentCustomTheme.colors, secondary: color },
                  })
                }
              />
              <ColorPicker
                label="Accent Color"
                value={currentCustomTheme.colors.accent}
                onChange={(color) =>
                  updateCustomTheme(currentCustomTheme.id, {
                    colors: { ...currentCustomTheme.colors, accent: color },
                  })
                }
              />
              <ColorPicker
                label="Border Color"
                value={currentCustomTheme.colors.border}
                onChange={(color) =>
                  updateCustomTheme(currentCustomTheme.id, {
                    colors: { ...currentCustomTheme.colors, border: color },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={currentCustomTheme.fonts.size}
                  onValueChange={(value: "small" | "medium" | "large") =>
                    updateCustomTheme(currentCustomTheme.id, {
                      fonts: { ...currentCustomTheme.fonts, size: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={currentCustomTheme.fonts.family}
                  onValueChange={(value: "default" | "serif" | "mono") =>
                    updateCustomTheme(currentCustomTheme.id, {
                      fonts: { ...currentCustomTheme.fonts, family: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((family) => (
                      <SelectItem key={family.value} value={family.value}>
                        {family.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            <h3 className="text-lg font-semibold">Accessibility Options</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={currentCustomTheme.accessibility.highContrast}
                  onCheckedChange={(checked) =>
                    updateCustomTheme(currentCustomTheme.id, {
                      accessibility: { ...currentCustomTheme.accessibility, highContrast: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={currentCustomTheme.accessibility.reducedMotion}
                  onCheckedChange={(checked) =>
                    updateCustomTheme(currentCustomTheme.id, {
                      accessibility: { ...currentCustomTheme.accessibility, reducedMotion: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enhanced Focus Indicators</Label>
                  <p className="text-sm text-muted-foreground">Show clear focus outlines for keyboard navigation</p>
                </div>
                <Switch
                  checked={currentCustomTheme.accessibility.focusVisible}
                  onCheckedChange={(checked) =>
                    updateCustomTheme(currentCustomTheme.id, {
                      accessibility: { ...currentCustomTheme.accessibility, focusVisible: checked },
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <h3 className="text-lg font-semibold">System Settings</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>System Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={resetToDefault}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-transparent"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Default
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  This will remove all custom themes and reset to default settings.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
