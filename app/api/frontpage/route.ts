import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()
    const frontPages = await db.collection("frontpage").find({}).toArray()
    return NextResponse.json(frontPages)
  } catch (error) {
    console.error("Error fetching front pages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, title, smallAbout, about, imgUrl, cvUrl, connect } = await request.json()
    const db = await getDatabase()

    // Check if frontpage already exists
    const existingFrontPage = await db.collection("frontpage").findOne({})

    if (existingFrontPage) {
      // Update existing frontpage
      await db
        .collection("frontpage")
        .updateOne({ _id: existingFrontPage._id }, { $set: { name, title, smallAbout, about, imgUrl, cvUrl, connect } })
      return NextResponse.json({ success: true, _id: existingFrontPage._id })
    } else {
      // Create new frontpage
      const result = await db.collection("frontpage").insertOne({
        name,
        title,
        smallAbout,
        about,
        imgUrl,
        cvUrl,
        connect,
      })
      return NextResponse.json({ success: true, _id: result.insertedId })
    }
  } catch (error) {
    console.error("Error creating/updating front page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
