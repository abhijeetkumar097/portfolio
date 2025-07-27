export interface Certificate {
  _id?: string
  name: string
  provider: string
  duration: string
  url: string
}

export interface Education {
  _id?: string
  instituteName: string
  degree: string
  address: string
  pincode?: string
  cgpa?: string
  percentage?: string
  description?: string
  duration: string
}

export interface Project {
  _id?: string
  name: string
  description?: string
  imgUrl?: string
  githubUrl1?: string
  githubUrl2?: string
  liveUrl?: string
  techStack: string[]
}

export interface Skill {
  _id?: string
  type: string
  name: string
  proficiency: number
}

export interface FrontPage {
  _id?: string
  name: string
  title: string
  smallAbout: string
  about: string
  imgUrl?: string
  cvUrl?: string
  connect: Record<string, string>
}

export interface User {
  _id?: string
  userName: string
  password: string
}

export interface Mail {
  name: string
  email: string
  subject: string
  description: string
}
