import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()
    const certificates = await db.collection("certificate").find({}).toArray()

    return NextResponse.json(
      certificates.map((cert) => ({
        id: cert._id.toString(),
        name: cert.name,
        provider: cert.provider,
        duration: cert.duration,
        url: cert.url,
      })),
    )
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, provider, duration, url } = await request.json()
    const db = await getDatabase()

    const result = await db.collection("certificate").insertOne({
      name,
      provider,
      duration,
      url,
    })

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating certificate:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
