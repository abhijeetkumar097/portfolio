"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import type { Education, Certificate, Skill } from "@/lib/types"

export default function AboutPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [educationRes, certificatesRes, skillsRes] = await Promise.all([
          fetch("/api/education"),
          fetch("/api/certificates"),
          fetch("/api/skills"),
        ])

        const [educationData, certificatesData, skillsData] = await Promise.all([
          educationRes.json(),
          certificatesRes.json(),
          skillsRes.json(),
        ])

        setEducation(educationData)
        setCertificates(certificatesData)
        setSkills(skillsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
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

  return (
    <div className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about my background, education, skills, and certifications.
          </p>
        </motion.div>

        {/* Skills Section */}
        {Object.keys(groupedSkills).length > 0 && (
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-4">Skills & Technologies</h2>
              <p className="text-gray-600">Technologies and tools I work with</p>
            </motion.div>

            <div className="space-y-8">
              {Object.entries(groupedSkills).map(([type, typeSkills]) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-primary-600">{type}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {typeSkills.map((skill) => (
                      <div key={skill.id} className="text-center">
                        <div className="skill-circle bg-white shadow-lg mb-3 mx-auto">
                          <div
                            className="skill-circle border-4"
                            style={{
                              borderColor:
                                skill.proficiency >= 70 ? "#10b981" : skill.proficiency >= 50 ? "#f59e0b" : "#ef4444",
                              background: `conic-gradient(${skill.proficiency >= 70 ? "#10b981" : skill.proficiency >= 50 ? "#f59e0b" : "#ef4444"} ${skill.proficiency * 3.6}deg, #e5e7eb 0deg)`,
                            }}
                          >
                            <div className="skill-circle bg-white text-sm font-semibold">{skill.proficiency}%</div>
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education Section */}
          {education.length > 0 && (
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8">Education</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
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
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Certificates Section */}
          {certificates.length > 0 && (
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8">Certifications</h2>
              <div className="space-y-6">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-primary-600">{cert.name}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{cert.duration}</span>
                        </div>
                        <p className="font-medium text-gray-900 mb-4">{cert.provider}</p>
                        <Button variant="outline" size="sm">
                          <a href={cert.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Certificate
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  )
}
