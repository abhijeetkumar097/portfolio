import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()
    const education = await db.collection("education").find({}).toArray()

    return NextResponse.json(
      education.map((edu) => ({
        id: edu._id.toString(),
        instituteName: edu.instituteName,
        degree: edu.degree,
        address: edu.address,
        pincode: edu.pincode,
        cgpa: edu.cgpa,
        percentage: edu.percentage,
        description: edu.description,
        duration: edu.duration,
      })),
    )
  } catch (error) {
    console.error("Error fetching education:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { instituteName, degree, address, pincode, cgpa, percentage, description, duration } = await request.json()
    const db = await getDatabase()

    const result = await db.collection("education").insertOne({
      instituteName,
      degree,
      address,
      pincode,
      cgpa,
      percentage,
      description,
      duration,
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating education:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
