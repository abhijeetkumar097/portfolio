"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import type { Skill } from "@/lib/types"

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    proficiency: "",
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills")
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error("Error fetching skills:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("adminToken")

    const skillData = {
      ...formData,
      proficiency: Number.parseInt(formData.proficiency),
    }

    try {
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      })

      if (response.ok) {
        setMessage({ type: "success", text: `Skill ${editingId ? "updated" : "added"} successfully!` })
        setFormData({ type: "", name: "", proficiency: "" })
        setEditingId(null)
        setShowAddForm(false)
        fetchSkills()
      } else {
        setMessage({ type: "error", text: "Failed to save skill" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    }
  }

  const handleEdit = (skill: Skill) => {
    setFormData({
      type: skill.type,
      name: skill.name,
      proficiency: skill.proficiency.toString(),
    })
    setEditingId(skill.id || "")
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    const token = localStorage.getItem("adminToken")

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Skill deleted successfully!" })
        fetchSkills()
      } else {
        setMessage({ type: "error", text: "Failed to delete skill" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    }
  }

  const resetForm = () => {
    setFormData({ type: "", name: "", proficiency: "" })
    setEditingId(null)
    setShowAddForm(false)
  }

  // Group skills by type
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.type]) {
        acc[skill.type] = []
      }
      acc[skill.type].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

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
        <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
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
              <CardTitle>{editingId ? "Edit Skill" : "Add New Skill"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Input
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., Frontend, Backend, Database"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., React, Node.js"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency (0-100)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.proficiency}
                      onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingId ? "Update" : "Add"} Skill</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Skills List */}
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([type, typeSkills]) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-primary-600">{type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="skill-circle bg-white shadow-md">
                          <div
                            className="skill-circle border-4"
                            style={{
                              borderColor:
                                skill.proficiency >= 70 ? "#10b981" : skill.proficiency >= 50 ? "#f59e0b" : "#ef4444",
                              background: `conic-gradient(${skill.proficiency >= 70 ? "#10b981" : skill.proficiency >= 50 ? "#f59e0b" : "#ef4444"} ${skill.proficiency * 3.6}deg, #e5e7eb 0deg)`,
                            }}
                          >
                            <div className="skill-circle bg-white text-xs font-semibold">{skill.proficiency}%</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id || "")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
