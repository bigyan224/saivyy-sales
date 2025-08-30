"use client"


import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Building2, Users, TrendingUp, Calendar, Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignUp, useAuth, useSignIn, useSignUp, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import { UserResource } from "@clerk/types";
 



export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const { signUp, isLoaded } = useSignUp()
  const { signIn, setActive } = useSignIn()
  const { user, isSignedIn } = useUser()
  const router = useRouter();
  const { getToken } = useAuth();



  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
    
  }, [isLoaded, isSignedIn, router]);
 if(!isLoaded){
  return null;
 }

  if (isSignedIn) {
    return null; // user won’t see this anyway
  }

  // Name will be split after verification
  const handleAuth = async (e) => {
    e.preventDefault()
    if (!isLoaded || !signIn || !signUp) {
      toast.error('Authentication service is not ready yet. Please try again.');
      return;
    }
    
    setIsLoading(true)

    try {
      if (isLogin) {
        try {
          const result = await signIn.create({
            identifier: loginForm.email,
            password: loginForm.password,
          });
          if (result.status === "complete") {
            // sign in successful
            await setActive({ session: result.createdSessionId });
        
            toast.success("Welcome back!", {
              description: "Redirecting to your dashboard...",
            });
          
          } else {
            // sign in incomplete → e.g. needs 2FA or email verification
            toast.error("Sign-in not complete", {
              description: "Please finish the required steps.",
            });
          }

        } catch (error) {
          toast.error('Error logging in', { description: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
       
      } else if (signUp) {
        
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: signupForm.email,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            toast.error("Signup failed", { description: data.error });
            return;
          }
          // Start the sign-up process with names
        // Store the full name in unsafeMetadata during signup
        await signUp.create({
          emailAddress: signupForm.email,
          password: signupForm.password,
          unsafeMetadata: {
            fullName: signupForm.name.trim()
          }
        });
        
        // Send the verification email
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
          
          setPendingVerification(true);
          toast.success('Verification email sent!', { 
            description: 'Please check your email for the verification code.' 
          });
          
         
        } catch (err) {
          toast.error('Error creating account', { 
            description: err instanceof Error ? err.message : 'An unknown error occurred' 
          });
          return;
        }
      }

    } catch (error) {
      toast.error('Error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerify = async(e) => {
    e.preventDefault();
    if (!isLoaded) {
      toast.error('Authentication service is not ready yet. Please try again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      
      if (result.status === "complete") {
        // Set the active session first
        await setActive({ session: result.createdSessionId });
        
        // Get the full name from the signup form
        const fullName = signupForm?.name?.trim() || '';
        
        // Split the name
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ').trim() || '';
        
        // Update the current user's profile with the name
        if (fullName && user) {
          try {
            await user.update({
              firstName: firstName || 'User',
              lastName: lastName || '',
            });
          } catch (error) {
            console.error('Error updating user profile:', error);
          }
        }
        
        // Save to your database with the full name
        try {
          await fetch("/api/users", { 
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: fullName || '',
              email: user?.emailAddresses[0]?.emailAddress || '',
              clerkId: user?.id || ''
            })
          });
        } catch (error) {
          console.error('Error saving to database:', error);
        }
  
        toast.success('Account verified successfully!', { 
          description: 'Redirecting to your dashboard...' 
        });
        

      } else {
        toast.error("Sign-Up not complete", {
          description: "Please finish the required steps.",
        });
      }
    } catch (error) {
      toast.error('Error verifying account', { 
        description: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-slate-900 text-balance">SalesFlow</h1>
              <p className="text-sm text-slate-600">Professional Sales Management</p>
            </div>
          </div>
          <p className="text-slate-600 text-balance max-w-sm mx-auto">
            Streamline your sales process and boost team performance with our comprehensive platform
          </p>
        </div>

        {/* Auth Form */}
        <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6 mt-6">
                <div className="space-y-2 text-center">
                  <CardTitle className="text-2xl text-slate-900">Welcome back</CardTitle>
                  <CardDescription className="text-slate-600">
                    Sign in to access your organization dashboard
                  </CardDescription>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-slate-700 font-medium">
                        Password
                      </Label>
                      <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                        className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <div id="clerk-captcha"></div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-6">
                <div className="space-y-2 text-center">
                  <CardTitle className="text-2xl text-slate-900">Get started</CardTitle>
                  <CardDescription className="text-slate-600">
                    Signup using your email and password
                  </CardDescription>
                </div>
                {!pendingVerification ? (
                <form onSubmit={handleAuth} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-slate-700 font-medium">
                        Password
                      </Label>
                      <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                        className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing up...
                      </>
                    ) : (
                      <>
                        Sign up
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <div id="clerk-captcha"></div>
                </form>
                ):(
                  <form onSubmit={handleVerify}>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button type="submit">Verify</button>
                </form>
                )}


              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Sales Tracking</p>
              <p className="text-xs text-slate-600">Monitor performance</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Meeting Scheduler</p>
              <p className="text-xs text-slate-600">Organize meetings</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Team Analytics</p>
              <p className="text-xs text-slate-600">Insights & reports</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2024 SalesFlow. Professional sales management platform.</p>
        </div>
      </div>
    </div>
  )
}
