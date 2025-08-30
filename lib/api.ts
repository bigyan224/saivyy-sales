export async function fetchUsers() {
  const response = await fetch("/api/users/getUsers")
  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

export async function fetchUser() {
  const response = await fetch("/api/user", { credentials: "include" });

  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
}

export async function fetchSales() {
  const response = await fetch("/api/sales")
  if (!response.ok) throw new Error("Failed to fetch sales")
  return response.json()
}

export async function fetchUserSales() {
  const response = await fetch("/api/sales/user")
  if (!response.ok) throw new Error("Failed to fetch sales")
  return response.json()
}

export async function fetchMeetings() {
  const response = await fetch("/data/meetings.json")
  if (!response.ok) throw new Error("Failed to fetch meetings")
  return response.json()
}

export async function fetchOrganization() {
  const response = await fetch("/data/organization.json")
  if (!response.ok) throw new Error("Failed to fetch organization")
  return response.json()
}

// Mock authentication
export async function login(email: string, password: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const users = await fetchUsers()
  const user = users.users.find((u: any) => u.email === email)

  if (user && password === "password123") {
    return { success: true, user }
  }

  return { success: false, error: "Invalid credentials" }
}

export async function signup(email: string, password: string, name: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock successful signup
  return {
    success: true,
    user: {
      id: Date.now().toString(),
      name,
      email,
      role: "user",
      joinDate: new Date().toISOString().split("T")[0],
      avatar: "/professional-avatar.png",
      isActive: true,
    },
  }
}
