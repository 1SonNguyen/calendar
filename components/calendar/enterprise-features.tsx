"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCalendar } from "./calendar-context"
import { 
  Shield, 
  Lock, 
  Key, 
  Database, 
  Cloud, 
  Server, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  Download,
  Upload,
  Sync,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Crown,
  Building,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react"

interface SecurityPolicy {
  id: string
  name: string
  description: string
  enabled: boolean
  level: "basic" | "standard" | "enterprise"
  settings: Record<string, any>
}

interface IntegrationConfig {
  id: string
  name: string
  type: "calendar" | "communication" | "productivity" | "crm" | "hr"
  status: "connected" | "disconnected" | "error" | "pending"
  description: string
  icon: React.ReactNode
  settings: Record<string, any>
}

const securityPolicies: SecurityPolicy[] = [
  {
    id: "data-encryption",
    name: "End-to-End Encryption",
    description: "Encrypt all calendar data in transit and at rest",
    enabled: true,
    level: "enterprise",
    settings: { algorithm: "AES-256", keyRotation: "monthly" }
  },
  {
    id: "access-control",
    name: "Role-Based Access Control",
    description: "Granular permissions based on user roles and departments",
    enabled: true,
    level: "standard",
    settings: { defaultRole: "viewer", inheritanceEnabled: true }
  },
  {
    id: "audit-logging",
    name: "Comprehensive Audit Logging",
    description: "Log all user actions and system events for compliance",
    enabled: true,
    level: "enterprise",
    settings: { retention: "7-years", realTimeAlerts: true }
  },
  {
    id: "sso-integration",
    name: "Single Sign-On (SSO)",
    description: "Integrate with corporate identity providers",
    enabled: false,
    level: "enterprise",
    settings: { provider: "azure-ad", autoProvisioning: true }
  },
  {
    id: "data-loss-prevention",
    name: "Data Loss Prevention",
    description: "Prevent unauthorized data export and sharing",
    enabled: true,
    level: "enterprise",
    settings: { blockExternalSharing: true, watermarking: true }
  }
]

const integrationConfigs: IntegrationConfig[] = [
  {
    id: "google-workspace",
    name: "Google Workspace",
    type: "calendar",
    status: "connected",
    description: "Sync with Google Calendar and Gmail",
    icon: <Globe className="h-4 w-4" />,
    settings: { syncDirection: "bidirectional", conflictResolution: "manual" }
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    type: "calendar",
    status: "connected",
    description: "Integrate with Outlook and Teams",
    icon: <Monitor className="h-4 w-4" />,
    settings: { syncDirection: "bidirectional", teamsIntegration: true }
  },
  {
    id: "slack",
    name: "Slack",
    type: "communication",
    status: "connected",
    description: "Send calendar notifications to Slack channels",
    icon: <Zap className="h-4 w-4" />,
    settings: { defaultChannel: "#general", reminderNotifications: true }
  },
  {
    id: "salesforce",
    name: "Salesforce",
    type: "crm",
    status: "disconnected",
    description: "Sync meetings with CRM opportunities and contacts",
    icon: <Building className="h-4 w-4" />,
    settings: { autoCreateMeetings: false, syncContacts: true }
  },
  {
    id: "jira",
    name: "Jira",
    type: "productivity",
    status: "pending",
    description: "Link calendar events to project tasks and sprints",
    icon: <FileText className="h-4 w-4" />,
    settings: { autoLinkSprints: true, timeTracking: true }
  },
  {
    id: "workday",
    name: "Workday",
    type: "hr",
    status: "error",
    description: "Sync with HR systems for time-off and employee data",
    icon: <Users className="h-4 w-4" />,
    settings: { syncTimeOff: true, employeeDirectory: true }
  }
]

export function EnterpriseFeatures() {
  const [activeTab, setActiveTab] = useState("security")
  const [policies, setPolicies] = useState(securityPolicies)
  const [integrations, setIntegrations] = useState(integrationConfigs)

  const togglePolicy = (policyId: string) => {
    setPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, enabled: !policy.enabled }
        : policy
    ))
  }

  const getStatusColor = (status: IntegrationConfig["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "disconnected":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: IntegrationConfig["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="h-3 w-3" />
      case "error":
        return <AlertTriangle className="h-3 w-3" />
      case "pending":
        return <Info className="h-3 w-3" />
      default:
        return null
    }
  }

  const getLevelColor = (level: SecurityPolicy["level"]) => {
    switch (level) {
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "standard":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "basic":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Enterprise Features</h3>
        <Badge variant="secondary" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Sync className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security Policies
              </h4>
              <div className="space-y-3">
                {policies.map((policy) => (
                  <div key={policy.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{policy.name}</span>
                        <Badge className={`text-xs ${getLevelColor(policy.level)}`}>
                          {policy.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{policy.description}</p>
                    </div>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={() => togglePolicy(policy.id)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Key className="h-4 w-4" />
                Access Management
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default User Role</Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue="480" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require 2FA</Label>
                    <p className="text-xs text-muted-foreground">Force two-factor authentication</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Restrictions</Label>
                    <p className="text-xs text-muted-foreground">Limit access by IP address</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Protection
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-medium text-sm">Encrypted</div>
                <div className="text-xs text-muted-foreground">AES-256 encryption</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-medium text-sm">Compliant</div>
                <div className="text-xs text-muted-foreground">SOC 2, GDPR, HIPAA</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                <Server className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-medium text-sm">Backed Up</div>
                <div className="text-xs text-muted-foreground">Daily automated backups</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Available Integrations</h4>
            <Button size="sm" className="bg-slate-600 hover:bg-slate-700">
              <Upload className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {integration.icon}
                    <div>
                      <h5 className="font-medium">{integration.name}</h5>
                      <p className="text-xs text-muted-foreground capitalize">{integration.type}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    <span className="ml-1 capitalize">{integration.status}</span>
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>

                <div className="flex gap-2">
                  {integration.status === "connected" ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Sync className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                    </>
                  ) : integration.status === "error" ? (
                    <Button variant="destructive" size="sm" className="w-full">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Fix Connection
                    </Button>
                  ) : integration.status === "pending" ? (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Info className="h-3 w-3 mr-1" />
                      Pending Approval
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Compliance Reports
              </h4>
              <div className="space-y-3">
                {[
                  { name: "SOC 2 Type II", status: "current", date: "2024-01-15" },
                  { name: "GDPR Compliance", status: "current", date: "2024-01-10" },
                  { name: "HIPAA Assessment", status: "pending", date: "2024-02-01" },
                  { name: "ISO 27001", status: "current", date: "2023-12-20" }
                ].map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-muted-foreground">Last updated: {report.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={report.status === "current" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Audit Metrics
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">99.9%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-xs text-muted-foreground">Security Incidents</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Retention Compliance</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Access Control Coverage</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[98%]"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Management
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">1,247</div>
                    <div className="text-xs text-muted-foreground">Total Users</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">1,198</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">49</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Bulk User Import
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export User List
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    User Permissions
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Server className="h-4 w-4" />
                System Health
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-[23%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full w-[67%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[45%]"></div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>System Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Backup & Recovery
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Retention Period</Label>
                <Select defaultValue="90-days">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="90-days">90 Days</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="7-years">7 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Last Backup</Label>
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/50 rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Manual Backup
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Restore Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Backup Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  )
}