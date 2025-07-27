"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import type { Education } from "@/lib/types"

export default function AdminEducation() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [formData, setFormData] = useState({
    instituteName: "",
    degree: "",
    address: "",
    pincode: "",
    cgpa: "",
    percentage: "",
    description: "",
    duration: "",
  })

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/education")
      const data = await response.json()
      setEducation(data)
    } catch (error) {
      console.error("Error fetching education:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("adminToken")

    try {
      const url = editingId ? `/api/education/${editingId}` : "/api/education"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: "success", text: `Education ${editingId ? "updated" : "added"} successfully!` })
        setFormData({
          instituteName: "",
          degree: "",
          address: "",
          pincode: "",
          cgpa: "",
          percentage: "",
          description: "",
          duration: "",
        })
        setEditingId(null)
        setShowAddForm(false)
        fetchEducation()
      } else {
        setMessage({ type: "error", text: "Failed to save education" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    }
  }

  const handleEdit = (edu: Education) => {
    setFormData({
      instituteName: edu.instituteName,
      degree: edu.degree,
      address: edu.address,
      pincode: edu.pincode || "",
      cgpa: edu.cgpa || "",
      percentage: edu.percentage || "",
      description: edu.description || "",
      duration: edu.duration,
    })
    setEditingId(edu.id || "")
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return

    const token = localStorage.getItem("adminToken")

    try {
      const response = await fetch(`/api/education/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Education deleted successfully!" })
        fetchEducation()
      } else {
        setMessage({ type: "error", text: "Failed to delete education" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    }
  }

  const resetForm = () => {
    setFormData({
      instituteName: "",
      degree: "",
      address: "",
      pincode: "",
      cgpa: "",
      percentage: "",
      description: "",
      duration: "",
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Education</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
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
            <button onClick={() => setMessage({ type: "", text: "" })} className="text-lg font-bold">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Education" : "Add New Education"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institute Name</label>
                    <Input
                      value={formData.instituteName}
                      onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                    <Input
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                    <Input value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Percentage</label>
                    <Input
                      value={formData.percentage}
                      onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingId ? "Update" : "Add"} Education</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Education List */}
      <div className="grid gap-6">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-primary-600">{edu.instituteName}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{edu.duration}</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">{edu.degree}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {edu.address}
                      {edu.pincode && `, ${edu.pincode}`}
                    </p>
                    {(edu.cgpa || edu.percentage) && (
                      <div className="flex gap-4 mb-2">
                        {edu.cgpa && <span className="text-sm font-medium text-green-600">CGPA: {edu.cgpa}</span>}
                        {edu.percentage && (
                          <span className="text-sm font-medium text-green-600">{edu.percentage}%</span>
                        )}
                      </div>
                    )}
                    {edu.description && <p className="text-sm text-gray-600 mt-3">{edu.description}</p>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(edu.id || "")}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
