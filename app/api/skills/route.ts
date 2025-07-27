import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()
    const skills = await db.collection("skill").find({}).toArray()

    return NextResponse.json(
      skills.map((skill) => ({
        id: skill._id.toString(),
        type: skill.type,
        name: skill.name,
        proficiency: skill.proficiency,
      })),
    )
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, name, proficiency } = await request.json()
    const db = await getDatabase()

    const result = await db.collection("skill").insertOne({
      type,
      name,
      proficiency: Number.parseInt(proficiency),
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating skill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
