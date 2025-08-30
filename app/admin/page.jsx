"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Copy,
  BarChart3,
  Download,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Edit,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { fetchSales, fetchMeetings, fetchUsers, fetchOrganization } from "@/lib/api"
import { SignOutButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"


export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [sales, setSales] = useState([])
  const [meetings, setMeetings] = useState([])
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)


  const [inviteCode, setInviteCode] = useState("TECH-2024-ABC123")
  const [inviteLink, setInviteLink] = useState("https://salesflow.app/join/TECH-2024-ABC123")
  const [newUserEmail, setNewUserEmail] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, salesData, meetingsData, orgData] = await Promise.all([
          fetchUsers(),
          fetchSales(),
          fetchMeetings(),
          fetchOrganization(),
        ])

        setUsers(usersData.users)
        setSales(salesData.sales)
        setMeetings(meetingsData.meetings)
        setOrganization(orgData.organization)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
  const thisMonthSales = sales
    .filter((sale) => new Date(sale.date).getMonth() === new Date().getMonth())
    .reduce((sum, sale) => sum + sale.amount, 0)
  const monthlyGrowth = thisMonthSales > 0 ? (thisMonthSales / (totalSales - thisMonthSales)) * 100 : 0
  const totalMeetings = meetings.length
  const successfulMeetings = meetings.filter((m) => m.status === "Success").length
  const successRate = totalMeetings > 0 ? Math.round((successfulMeetings / totalMeetings) * 100) : 0

  const exportToCSV = (data, filename) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("export successful",{
      description: `${filename} has been downloaded`,
    })
  }


  const generateNewCode = () => {
    const newCode = `TECH-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setInviteCode(newCode)
    setInviteLink(`https://salesflow.app/join/${newCode}`)
    toast.success("New Code Generated",{
      description: "Invitation code has been updated",
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!",{
      description: "Text copied to clipboard",
    })
  }

  const sendInvitation = async() => {
    if (!newUserEmail) return

    const response = await fetch("/api/admin/inviteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newUserEmail }),
    })
    setNewUserEmail("")
    const data = await response.json()
    if (response.ok) {
      toast.success("Invitation Sent",{
        description: `Invitation sent to ${newUserEmail}`,
      })
    } else {
      toast.error("Failed to send invitation",{
        description: `${data.error}`,
      })
    }
  }

  const toggleUserStatus = (userId) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
    toast.success("User Status Updated",{
      description: "User status has been changed",
    })
  }

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
    toast.success("User Removed",{
      description: "User has been removed from the organization",
    })
  }

  const salesChartData = sales.reduce(
    (acc, sale) => {
      const month = new Date(sale.date).toLocaleDateString("en-US", { month: "short" })
      const existing = acc.find((item) => item.month === month)
      if (existing) {
        existing.sales += sale.amount
      } else {
        acc.push({ month, sales: sale.amount })
      }
      return acc
    },
    [] ,
  )

  const meetingStatusData = [
    { name: "Success", value: meetings.filter((m) => m.status === "Success").length, color: "#10b981" },
    { name: "Failed", value: meetings.filter((m) => m.status === "Failed").length, color: "#ef4444" },
    { name: "Scheduled", value: meetings.filter((m) => m.status === "Scheduled").length, color: "#f59e0b" },
  ]

  const userPerformanceData = users.map((user) => ({
    name: user.name.split(" ")[0],
    sales: sales.filter((s) => s.userId === user.clerkId).reduce((sum, s) => sum + s.amount, 0),
    meetings: meetings.filter((m) => m.userId === user.clerkId).length,
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">SalesFlow Admin</h1>
              <p className="text-sm text-slate-600">{organization?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
          <Button asChild  size="sm" className="md:flex bg-blue-600 hover:bg-blue-700 ">
                <Link href="/dashboard">
                Dashboard
                </Link>
              </Button>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              Organization Owner
            </Badge>
            <Avatar>
            <UserButton />
            </Avatar>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <SignOutButton redirectUrl="/">
            <Button variant="ghost" size="sm" className="hidden md:flex bg-red-300 hover:bg-red-400" onClick={()=>toast.success("You have been signed out")}>
              <LogOut className="w-4 h-4" />
            </Button>
              </SignOutButton>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Total Sales</p>
                  <p className="text-xl font-semibold text-slate-900">${totalSales.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+{monthlyGrowth.toFixed(1)}% this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Team Members</p>
                  <p className="text-xl font-semibold text-slate-900">{users.length}</p>
                  <p className="text-xs text-slate-500">{users.filter((u) => u.isActive).length} active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-600">Meetings</p>
                  <p className="text-xl font-semibold text-slate-900">{totalMeetings}</p>
                  <p className="text-xs text-slate-500">Total scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-600">Success Rate</p>
                  <p className="text-xl font-semibold text-slate-900">{successRate}%</p>
                  <p className="text-xs text-slate-500">Meeting conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <CardTitle>Sales Performance</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(sales, "sales-data")}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>Monthly sales trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]} />
                      <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Meeting Status Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5" />
                      <CardTitle>Meeting Outcomes</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(meetings, "meetings-data")}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <CardDescription>Meeting results breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={meetingStatusData}
      cx="50%"
      cy="50%"
      outerRadius={80}
      dataKey="value"
    >
      {meetingStatusData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {meetingStatusData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-slate-600">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers This Month</CardTitle>
                <CardDescription>Your highest achieving team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPerformanceData
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 3)
                    .map((member, index) => {
                      const user = users.find((u) => u.name.split(" ")[0] === member.name)
                      return (
                        <div key={member.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold">
                              {index + 1}
                            </div>
                            <Avatar>
                              <AvatarFallback>
                                {user?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("") || member.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{user?.name || member.name}</p>
                              <p className="text-sm text-slate-600">{user?.role || "Sales Rep"}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">${member.sales.toLocaleString()}</p>
                            <p className="text-sm text-slate-600">{member.meetings} meetings</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            {/* Invite Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Invite by Code/Link</span>
                  </CardTitle>
                  <CardDescription>Generate invitation codes and links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteCode">Invitation Code</Label>
                    <div className="flex space-x-2">
                      <Input id="inviteCode" value={inviteCode} readOnly />
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(inviteCode)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteLink">Invitation Link</Label>
                    <div className="flex space-x-2">
                      <Input id="inviteLink" value={inviteLink} readOnly />
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(inviteLink)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={generateNewCode} className="bg-blue-600 hover:bg-blue-700 w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Code
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Invite by Email</span>
                  </CardTitle>
                  <CardDescription>Send direct email invitations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email Address</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@company.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={sendInvitation}
                    className="bg-green-600 hover:bg-green-700 w-full"
                    disabled={!newUserEmail}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Team Members List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members ({users.length})</CardTitle>
                    <CardDescription>Manage your organization's team members</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => exportToCSV(users, "team-members")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((member) => {
                    const memberSales = sales
                      .filter((s) => s.userId === member.clerkId)
                      .reduce((sum, s) => sum + s.amount, 0)
                    const memberMeetings = meetings.filter((m) => m.userId === member.clerkId).length

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-slate-900">{member.name}</p>
                              {!member.isActive && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{member.email}</p>
                            <p className="text-xs text-slate-500">
                              Joined {new Date(member.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">${memberSales.toLocaleString()}</p>
                            <p className="text-xs text-slate-600">{memberMeetings} meetings</p>
                          </div>
                          <Badge variant="secondary">{member.role}</Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserStatus(member.clerkId)}
                              title={member.isActive ? "Deactivate user" : "Activate user"}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUser(member.clerkId)}
                              className="text-red-600 hover:text-red-700"
                              title="Remove user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Team Member</CardTitle>
                  <CardDescription>Individual performance breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Sales"]} />
                      <Bar dataKey="sales" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meeting Activity</CardTitle>
                  <CardDescription>Team meeting statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="meetings" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Detailed team performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Team Member</th>
                        <th className="text-right p-2">Total Sales</th>
                        <th className="text-right p-2">Meetings</th>
                        <th className="text-right p-2">Avg Deal Size</th>
                        <th className="text-right p-2">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => {
                        const userSales = sales.filter((s) => s.userId === user.clerkId)
                        const userMeetings = meetings.filter((m) => m.userId === user.clerkId)
                        const totalSales = userSales.reduce((sum, s) => sum + s.amount, 0)
                        const avgDealSize = userSales.length > 0 ? totalSales / userSales.length : 0
                        const successfulMeetings = userMeetings.filter((m) => m.status === "Success").length
                        const successRate =
                          userMeetings.length > 0 ? (successfulMeetings / userMeetings.length) * 100 : 0

                        return (
                          <tr key={user.id} className="border-b">
                            <td className="p-2 font-medium">{user.name}</td>
                            <td className="p-2 text-right">${totalSales.toLocaleString()}</td>
                            <td className="p-2 text-right">{userMeetings.length}</td>
                            <td className="p-2 text-right">${avgDealSize.toLocaleString()}</td>
                            <td className="p-2 text-right">{successRate.toFixed(1)}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>Manage your organization details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue={organization?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgAddress">Address</Label>
                  <Input id="orgAddress" defaultValue={organization?.address} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgIndustry">Industry</Label>
                  <Input id="orgIndustry" placeholder="e.g., Technology, Healthcare, Finance" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgDescription">Description</Label>
                  <Input id="orgDescription" placeholder="Enter organization description" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Admin Approval</p>
                    <p className="text-sm text-slate-600">New users need admin approval to join</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-600">Require 2FA for all admin accounts</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-slate-600">Automatically log out inactive users</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Set Timeout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
