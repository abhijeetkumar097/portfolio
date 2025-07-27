"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import type { FrontPage } from "@/lib/types"

export default function AdminFrontPage() {
  const [frontPage, setFrontPage] = useState<FrontPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    smallAbout: "",
    about: "",
    imgUrl: "",
    cvUrl: "",
    connect: "",
  })

  useEffect(() => {
    fetchFrontPage()
  }, [])

  const fetchFrontPage = async () => {
    try {
      const response = await fetch("/api/frontpage")
      const data = await response.json()
      if (data.length > 0) {
        const page = data[0]
        setFrontPage(page)
        setFormData({
          name: page.name || "",
          title: page.title || "",
          smallAbout: page.smallAbout || "",
          about: page.about || "",
          imgUrl: page.imgUrl || "",
          cvUrl: page.cvUrl || "",
          connect: JSON.stringify(page.connect || {}, null, 2),
        })
      } else {
        // No frontpage exists, set default values
        setFormData({
          name: "",
          title: "",
          smallAbout: "",
          about: "",
          imgUrl: "",
          cvUrl: "",
          connect: JSON.stringify(
            {
              github: "",
              linkedin: "",
              twitter: "",
              email: "",
            },
            null,
            2,
          ),
        })
      }
    } catch (error) {
      console.error("Error fetching front page:", error)
      setMessage({ type: "error", text: "Failed to fetch front page data" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem("adminToken")

    if (!token) {
      setMessage({ type: "error", text: "Authentication token not found. Please login again." })
      setSaving(false)
      return
    }

    let connectData = {}
    try {
      connectData = JSON.parse(formData.connect)
    } catch (error) {
      setMessage({ type: "error", text: "Invalid JSON format in connect field" })
      setSaving(false)
      return
    }

    const pageData = {
      name: formData.name,
      title: formData.title,
      smallAbout: formData.smallAbout,
      about: formData.about,
      imgUrl: formData.imgUrl,
      cvUrl: formData.cvUrl,
      connect: connectData,
    }

    try {
      let response

      if (frontPage && frontPage.id) {
        // Update existing frontpage
        response = await fetch(`/api/frontpage/${frontPage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pageData),
        })
      } else {
        // Create new frontpage
        response = await fetch("/api/frontpage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pageData),
        })
      }

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: "success", text: "Front page saved successfully!" })

        // Update the frontPage state with the new/updated data
        if (result.id) {
          setFrontPage({ ...pageData, id: result.id } as FrontPage)
        }

        // Refresh the data
        setTimeout(() => {
          fetchFrontPage()
        }, 1000)
      } else {
        const errorData = await response.json()
        setMessage({ type: "error", text: errorData.error || "Failed to save front page" })
      }
    } catch (error) {
      console.error("Error saving front page:", error)
      setMessage({ type: "error", text: "An error occurred while saving" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Front Page Settings</h1>
        <p className="text-gray-600 mt-2">Update your portfolio's main page content</p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md mb-6 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <div className="flex justify-between items-center">
            {message.text}
            <button onClick={() => setMessage({ type: "", text: "" })} className="text-lg font-bold hover:opacity-70">
              ×
            </button>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>{frontPage ? "Edit Front Page Content" : "Create Front Page Content"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Your professional title"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Small About</label>
                <Input
                  value={formData.smallAbout}
                  onChange={(e) => setFormData({ ...formData, smallAbout: e.target.value })}
                  placeholder="Brief description about yourself"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description about yourself, your experience, and skills"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <Input
                    type="url"
                    value={formData.imgUrl}
                    onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CV URL</label>
                  <Input
                    type="url"
                    value={formData.cvUrl}
                    onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                    placeholder="https://example.com/your-cv.pdf"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Links (JSON format)</label>
                <textarea
                  value={formData.connect}
                  onChange={(e) => setFormData({ ...formData, connect: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder={`{
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "twitter": "https://twitter.com/username",
  "email": "your.email@example.com"
}`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter social links in JSON format. Make sure the JSON is valid.
                </p>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {frontPage ? "Update Front Page" : "Create Front Page"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
