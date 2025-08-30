"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Building2,
  Users,
  Settings,
  Shield,
  Trash2,
  UserPlus,
  Copy,
  Mail,
  ArrowLeft,
  Crown,
  UserCheck,
  UserX,
} from "lucide-react"

// Mock organization data
const mockOrganization = {
  id: "org_123",
  name: "TechCorp Solutions",
  description: "Leading technology solutions provider",
  industry: "Technology",
  size: "50-100 employees",
  website: "https://techcorp.com",
  address: "123 Tech Street, Silicon Valley, CA",
  phone: "+1 (555) 123-4567",
  createdDate: "2023-12-01",
  plan: "Professional",
  members: 12,
  maxMembers: 50,
}

const mockMembers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@techcorp.com",
    role: "owner",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    role: "admin",
    status: "active",
    joinDate: "2024-01-05",
    lastActive: "2024-01-15",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@techcorp.com",
    role: "member",
    status: "active",
    joinDate: "2023-12-15",
    lastActive: "2024-01-14",
  },
  {
    id: 4,
    name: "Lisa Davis",
    email: "lisa@techcorp.com",
    role: "member",
    status: "pending",
    joinDate: "2024-01-10",
    lastActive: "Never",
  },
]

const mockInvitations = [
  { id: 1, email: "alex@example.com", role: "member", sentDate: "2024-01-14", status: "pending", code: "INV-ABC123" },
  { id: 2, email: "emma@example.com", role: "member", sentDate: "2024-01-13", status: "expired", code: "INV-DEF456" },
]

export default function OrganizationManagement() {
  const [orgData, setOrgData] = useState(mockOrganization)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [newInviteCode, setNewInviteCode] = useState("")

  const handleOrgUpdate = (field: string, value: string) => {
    setOrgData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveOrganization = () => {
    console.log("[v0] Organization updated:", orgData)
    // Mock save logic
  }

  const handleInviteUser = () => {
    if (!inviteEmail) return
    const code = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setNewInviteCode(code)
    console.log("[v0] User invited:", { email: inviteEmail, role: inviteRole, code })
    setInviteEmail("")
    setInviteRole("member")
  }

  const handleMemberAction = (memberId: number, action: string) => {
    console.log(`[v0] Member ${memberId} action: ${action}`)
    // Mock member management logic
  }

  const copyInviteLink = (code: string) => {
    const link = `https://salesflow.app/join/${code}`
    navigator.clipboard.writeText(link)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/admin")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-slate-900">Organization Management</h1>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Crown className="w-3 h-3 mr-1" />
            Owner Access
          </Badge>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Organization Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>{orgData.name}</span>
            </CardTitle>
            <CardDescription>Manage your organization settings and team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Members</p>
                  <p className="font-semibold">
                    {orgData.members}/{orgData.maxMembers}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Plan</p>
                  <p className="font-semibold">{orgData.plan}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-600">Created</p>
                  <p className="font-semibold">{orgData.createdDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Organization Settings</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="security">Security & Permissions</TabsTrigger>
          </TabsList>

          {/* Organization Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update your organization's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={orgData.name}
                      onChange={(e) => handleOrgUpdate("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={orgData.industry} onValueChange={(value) => handleOrgUpdate("industry", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={orgData.description}
                    onChange={(e) => handleOrgUpdate("description", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={orgData.website}
                      onChange={(e) => handleOrgUpdate("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={orgData.phone}
                      onChange={(e) => handleOrgUpdate("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={orgData.address}
                    onChange={(e) => handleOrgUpdate("address", e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveOrganization} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members ({mockMembers.length})</CardTitle>
                <CardDescription>Manage your organization's team members and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-slate-900">{member.name}</p>
                            {member.role === "owner" && <Crown className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-slate-600">{member.email}</p>
                          <p className="text-xs text-slate-500">
                            Joined {member.joinDate} • Last active {member.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge
                            variant={
                              member.status === "active"
                                ? "default"
                                : member.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {member.status}
                          </Badge>
                          <p className="text-xs text-slate-600 mt-1 capitalize">{member.role}</p>
                        </div>
                        {member.role !== "owner" && (
                          <div className="flex space-x-2">
                            {member.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMemberAction(member.id, "deactivate")}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMemberAction(member.id, "activate")}
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove {member.name} from the organization? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleMemberAction(member.id, "remove")}>
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            {/* Send New Invitation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Invite New Member</span>
                </CardTitle>
                <CardDescription>Send an invitation to join your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteEmail">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="user@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteRole">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleInviteUser} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </div>
                {newInviteCode && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">Invitation sent successfully!</p>
                    <div className="flex items-center space-x-2">
                      <Input value={`https://salesflow.app/join/${newInviteCode}`} readOnly className="text-sm" />
                      <Button variant="outline" size="sm" onClick={() => copyInviteLink(newInviteCode)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Invitations */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Manage sent invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{invitation.email}</p>
                        <p className="text-sm text-slate-600">Role: {invitation.role}</p>
                        <p className="text-xs text-slate-500">Sent {invitation.sentDate}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={invitation.status === "pending" ? "secondary" : "destructive"}>
                          {invitation.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => copyInviteLink(invitation.code)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & Permissions Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Configure security and permission settings for your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Require email verification</p>
                      <p className="text-sm text-slate-600">
                        New members must verify their email before accessing the organization
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Two-factor authentication</p>
                      <p className="text-sm text-slate-600">Require 2FA for all organization members</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Auto-expire invitations</p>
                      <p className="text-sm text-slate-600">Invitations expire after 7 days</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Member data export</p>
                      <p className="text-sm text-slate-600">Allow members to export their own data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions that affect your entire organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Delete Organization</p>
                      <p className="text-sm text-red-700">
                        Permanently delete this organization and all associated data
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Organization</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your organization and remove all
                            associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Delete Organization
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
