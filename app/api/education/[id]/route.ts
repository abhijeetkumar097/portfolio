import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { instituteName, degree, address, pincode, cgpa, percentage, description, duration } = await request.json()
    const db = await getDatabase()

    await db
      .collection("education")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { instituteName, degree, address, pincode, cgpa, percentage, description, duration } },
      )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating education:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    await db.collection("education").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting education:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
