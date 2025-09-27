"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { seedLocalStorage, clearAllData, getDataStats } from "@/scripts/seed-data"
import { Database, Trash2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export function DataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [lastAction, setLastAction] = useState<{ type: string; success: boolean; message: string } | null>(null)
  const [stats, setStats] = useState(getDataStats())

  const handleSeedData = async () => {
    setIsSeeding(true)
    try {
      const result = seedLocalStorage()
      setLastAction({
        type: "seed",
        success: result.success,
        message: result.message,
      })
      setStats(getDataStats())
    } catch (error) {
      setLastAction({
        type: "seed",
        success: false,
        message: "Failed to seed data",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearData = async () => {
    setIsClearing(true)
    try {
      const result = clearAllData()
      setLastAction({
        type: "clear",
        success: result.success,
        message: result.message,
      })
      setStats(getDataStats())
    } catch (error) {
      setLastAction({
        type: "clear",
        success: false,
        message: "Failed to clear data",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleRefreshStats = () => {
    setStats(getDataStats())
    setLastAction({
      type: "refresh",
      success: true,
      message: "Statistics refreshed",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Manage sample data for development and testing. This uses localStorage to simulate database operations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Statistics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Current Data</h4>
            <Button variant="outline" size="sm" onClick={handleRefreshStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.patients}</div>
                <div className="text-sm text-muted-foreground">Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.appointments}</div>
                <div className="text-sm text-muted-foreground">Appointments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.messages}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.supportTickets}</div>
                <div className="text-sm text-muted-foreground">Support Tickets</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No data available</div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-4">
          <h4 className="font-medium">Actions</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSeedData} disabled={isSeeding} className="flex-1">
              <Database className="h-4 w-4 mr-2" />
              {isSeeding ? "Seeding..." : "Load Sample Data"}
            </Button>
            <Button variant="destructive" onClick={handleClearData} disabled={isClearing} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing..." : "Clear All Data"}
            </Button>
          </div>
        </div>

        {/* Last Action Result */}
        {lastAction && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Last Action</h4>
              <div className="flex items-center gap-2">
                {lastAction.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">{lastAction.message}</span>
                <Badge variant={lastAction.success ? "default" : "destructive"}>
                  {lastAction.type === "seed" ? "Seed" : lastAction.type === "clear" ? "Clear" : "Refresh"}
                </Badge>
              </div>
            </div>
          </>
        )}

        {/* Development Info */}
        <Separator />
        <div className="space-y-2">
          <h4 className="font-medium">Development Info</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Data is stored in browser localStorage</p>
            <p>• Sample data includes realistic medical scenarios</p>
            <p>• Use browser console functions: seedDoctorHub(), clearDoctorHubData(), getDoctorHubStats()</p>
            <p>• Data persists between browser sessions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
