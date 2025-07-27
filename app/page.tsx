"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Download, ExternalLink, Github, Linkedin, Mail, Instagram } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import type { FrontPage, Project, Skill, Certificate, Education } from "@/lib/types"

export default function HomePage() {
  const [frontPage, setFrontPage] = useState<FrontPage[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [frontPageRes, projectsRes, skillsRes, certificatesRes, educationRes] = await Promise.all([
          fetch("/api/frontpage"),
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/certificates"),
          fetch("/api/education"),
        ])

        const [frontPageData, projectsData, skillsData, certificatesData, educationData] = await Promise.all([
          frontPageRes.json(),
          projectsRes.json(),
          skillsRes.json(),
          certificatesRes.json(),
          educationRes.json(),
        ])

        setFrontPage(frontPageData)
        setProjects(projectsData.slice(0, 3)) // Show only first 3 projects
        setSkills(skillsData)
        setCertificates(certificatesData)
        setEducation(educationData)
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

  const pageData = frontPage[0]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Hi, I'm <span className="gradient-text">{pageData?.name || "Abhijeet"}</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-gray-600 mb-6">{pageData?.title || "Full Stack Developer"}</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {pageData?.smallAbout || "Passionate developer creating amazing web experiences"}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button size="lg">
                  <Link href="/projects">View My Work</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <a href={pageData?.cvUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View CV
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Me
                  </Link>
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {pageData?.connect &&
                  Object.entries(pageData.connect).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow hover:text-primary-600"
                    >
                      {platform.toLowerCase() === "github" && <Github className="h-5 w-5" />}
                      {platform.toLowerCase() === "linkedin" && <Linkedin className="h-5 w-5" />}
                      {platform.toLowerCase() === "instagram" && <Instagram className="h-5 w-5" />}
                      {!["github", "linkedin", "instagram"].includes(platform.toLowerCase()) && <span title={platform}><ExternalLink className="h-5 w-5"/></span> }
                    </a>
                  ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-400 to-blue-600 p-2">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      // src="/LionC1.png"
                      src={pageData?.imgUrl || "/placeholder.svg"}
                      alt="Profile"
                      width={320}
                      height={320}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full animate-pulse-slow animation-delay-200"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {pageData?.about && (
        <section className="section-padding">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">About Me</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{pageData.about}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="section-padding bg-gray-100">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Skills</h2>
              <p className="text-lg text-gray-600">Technologies I work with</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="skill-circle bg-white shadow-lg mb-4 mx-auto">
                    <div
                      className="skill-circle border-4 border-primary-600"
                      style={{
                        background: `conic-gradient(#2563eb ${skill.proficiency * 3.6}deg, #e5e7eb 0deg)`,
                      }}
                    >
                      <div className="skill-circle bg-white text-sm font-semibold">{skill.proficiency}%</div>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  <p className="text-sm text-gray-500">{skill.type}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-lg text-gray-600">Some of my recent work</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {project.imgUrl && (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <Image
                          src={project.imgUrl || "/placeholder.svg"}
                          alt={project.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {project.githubUrl1 && (
                          <Button variant="outline" size="sm">
                            <a href={project.githubUrl1} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button size="sm">
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg">
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Education & Certificates */}
      <section className="section-padding bg-gray-100">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education */}
            {education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Education</h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <Card key={edu.id}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-primary-600 mb-2">{edu.instituteName}</h3>
                        <p className="font-medium mb-2">{edu.degree}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {edu.address} {edu.pincode && `, ${edu.pincode}`}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">{edu.duration}</p>
                        {(edu.cgpa || edu.percentage) && (
                          <p className="text-sm font-medium">
                            {edu.cgpa && `CGPA: ${edu.cgpa}`}
                            {edu.percentage && `Percentage: ${edu.percentage}`}
                          </p>
                        )}
                        {edu.description && <p className="text-sm text-gray-600 mt-2">{edu.description}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8">Certificates</h2>
                <div className="space-y-6">
                  {certificates.map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-primary-600 mb-2">{cert.name}</h3>
                        <p className="font-medium mb-2">{cert.provider}</p>
                        <p className="text-sm text-gray-500 mb-4">{cert.duration}</p>
                        <Button variant="outline" size="sm">
                          <a href={cert.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Certificate
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
