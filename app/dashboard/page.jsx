"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar,
  Plus,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  LogOut,
  Users,
} from "lucide-react"
import { CreateSaleModal } from "@/components/create-sale-modal"
import { ScheduleMeetingModal } from "@/components/schedule-meeting-modal"
import { CalendarView } from "@/components/calendar-view"
import { MobileNav } from "@/components/mobile-nav"
import { fetchMeetings, fetchUser, fetchUserSales } from "@/lib/api"
import { SignOutButton, UserButton, useUser, useClerk } from '@clerk/nextjs'
import { toast } from "sonner"
import Link from "next/link"



export default function UserDashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { openUserProfile } = useClerk()
  const [activeTab, setActiveTab] = useState("sales")
  const [createSaleOpen, setCreateSaleOpen] = useState(false)
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [sales, setSales] = useState([])
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)





  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        console.log("Starting to fetch data...");
        const [salesData, meetingsData, userData] = await Promise.all([
          fetchUserSales(),
          fetchMeetings(),
          fetchUser(),
        ]);
        console.log(salesData)
        

  
        if (!userData || !userData.id) {
          console.error("No user data or user ID found");
          return;
        }
        
        setCurrentUser(userData);

        const userMeetings = meetingsData?.meetings?.filter(
          (meeting) => meeting.userId === userData.id
        ) || [];
        
        setSales(salesData);
        setMeetings(userMeetings);
        
        
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      console.log("Cleaning up...");
    };
  }, [])

  const totalSales = sales?.reduce((sum, sale) => sum + (Number(sale?.amount) || 0), 0) || 0;
  const thisMonthSales = (sales || [])
    .filter((sale) => sale?.date && new Date(sale.date).getMonth() === new Date().getMonth())
    .reduce((sum, sale) => sum + (Number(sale?.amount) || 0), 0) || 0;
  const totalMeetings = meetings?.length || 0;
  const pendingSales = (sales || []).filter((sale) => sale?.status === "Pending").length || 0;

  const handleMeetingStatus = (meetingId, status) => {
    setMeetings((prev) => prev.map((meeting) => (meeting.id === meetingId ? { ...meeting, status } : meeting)))
  }

  const handleMeetingClick = (meeting) => {
    console.log("[v0] Meeting clicked:", meeting)
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null;
  }
  const role = user?.publicMetadata?.role;



  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MobileNav currentUser={currentUser} />
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">SalesFlow</h1>
              <p className="text-sm text-slate-600 hidden sm:block">TechCorp Solutions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
          {role === "admin" && (
              <Button asChild  size="sm" className="md:flex bg-blue-600 hover:bg-blue-700 ">
                <Link href="/admin">
                Admin dashboard
                </Link>
              </Button>
            )}
            <Avatar onClick={() => openUserProfile()} className="hidden md:flex cursor-pointer">
                            <AvatarFallback>
                              {currentUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
            
           
            <Button variant="ghost" size="sm" className="hidden md:flex">
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

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-600">Total Sales</p>
                  <p className="text-lg md:text-xl font-semibold text-slate-900 truncate">
                    ${totalSales.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-600">This Month</p>
                  <p className="text-lg md:text-xl font-semibold text-slate-900 truncate">
                    ${thisMonthSales.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-600">Meetings</p>
                  <p className="text-lg md:text-xl font-semibold text-slate-900">{totalMeetings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-lg md:text-xl font-semibold text-slate-900">{pendingSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 sm:gap-0">
          <Button className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none" onClick={() => setCreateSaleOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none bg-transparent"
            onClick={() => setScheduleMeetingOpen(true)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sales Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Recent Sales</span>
              </CardTitle>
              <CardDescription>Your latest sales entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-80 overflow-y-auto space-y-4">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium text-slate-900 truncate">{sale.client}</p>
                      <p className="text-sm text-slate-600 truncate">{sale.details}</p>
                      <p className="text-xs text-slate-500">{new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right space-y-1 flex-shrink-0 ml-4">
                      <p className="font-semibold text-slate-900">${sale.amount.toLocaleString()}</p>
                      <Badge variant={sale.status === "Completed" ? "default" : "secondary"} className="text-xs">
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {sales.length === 0 && <p className="text-center text-slate-500 py-8">No sales entries yet</p>}
            </CardContent>
          </Card>

          {/* Calendar View */}
          <CalendarView meetings={meetings} onMeetingClick={handleMeetingClick} />
        </div>

        {/* Meetings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Meetings</span>
            </CardTitle>
            <CardDescription>Your scheduled meetings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-4">
              {meetings
                .filter((meeting) => meeting.status === "Scheduled")
                .map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-medium text-slate-900 truncate">{meeting.title}</p>
                      <p className="text-sm text-slate-600 truncate">{meeting.clientName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleMeetingStatus(meeting.id, "Success")}>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleMeetingStatus(meeting.id, "Failed")}>
                        <XCircle className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            {meetings.filter((meeting) => meeting.status === "Scheduled").length === 0 && (
              <p className="text-center text-slate-500 py-8">No upcoming meetings</p>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateSaleModal open={createSaleOpen} onOpenChange={setCreateSaleOpen} />
      <ScheduleMeetingModal open={scheduleMeetingOpen} onOpenChange={setScheduleMeetingOpen} />
    </div>
  )
}
