"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Award, BookOpen, Briefcase, Code, FileText, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface Stats {
  certificates: number
  projects: number
  skills: number
  education: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    certificates: 0,
    projects: 0,
    skills: 0,
    education: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [certificatesRes, projectsRes, skillsRes, educationRes] = await Promise.all([
          fetch("/api/certificates"),
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/education"),
        ])

        const [certificates, projects, skills, education] = await Promise.all([
          certificatesRes.json(),
          projectsRes.json(),
          skillsRes.json(),
          educationRes.json(),
        ])

        setStats({
          certificates: certificates.length,
          projects: projects.length,
          skills: skills.length,
          education: education.length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Certificates",
      value: stats.certificates,
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Code,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Education",
      value: stats.education,
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a
                  href="/admin/certificates"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Manage Certificates</span>
                  </div>
                </a>
                <a
                  href="/admin/projects"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Manage Projects</span>
                  </div>
                </a>
                <a
                  href="/admin/skills"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Code className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Manage Skills</span>
                  </div>
                </a>
                <a
                  href="/admin/education"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Manage Education</span>
                  </div>
                </a>
                <a
                  href="/admin/frontpage"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Edit Front Page</span>
                  </div>
                </a>
                <a
                  href="/admin/profile"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">Update Profile</span>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
