"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Certificates", href: "/admin/certificates" },
  { name: "Projects", href: "/admin/projects" },
  { name: "Skills", href: "/admin/skills" },
  { name: "Education", href: "/admin/education" },
  { name: "Front Page", href: "/admin/frontpage" },
  { name: "Profile", href: "/admin/profile" },
]

export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  return (
    <nav className="bg-primary-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-2xl font-bold">
              Admin Panel
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-primary-700",
                  pathname === item.href ? "bg-primary-700" : "",
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-white hover:bg-gray-700 bg-transparent"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white hover:bg-red-600 bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-gray-200">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md transition-colors hover:bg-primary-700",
                  pathname === item.href ? "bg-primary-700" : "",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex gap-2 px-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-gray-700"
              >
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Home className="mr-2 h-4 w-4" />
                  View Site
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-white border-white hover:bg-red-600 bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
