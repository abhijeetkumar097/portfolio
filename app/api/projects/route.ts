import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()
    const projects = await db.collection("project").find({}).toArray()

    return NextResponse.json(
      projects.map((project) => ({
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        imgUrl: project.imgUrl,
        githubUrl1: project.githubUrl1,
        githubUrl2: project.githubUrl2,
        liveUrl: project.liveUrl,
        techStack: project.techStack || [],
      })),
    )
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, imgUrl, githubUrl1, githubUrl2, liveUrl, techStack } = await request.json()
    const db = await getDatabase()

    const result = await db.collection("project").insertOne({
      name,
      description,
      imgUrl,
      githubUrl1,
      githubUrl2,
      liveUrl,
      techStack: techStack || [],
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
