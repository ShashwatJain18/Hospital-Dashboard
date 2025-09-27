import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    const messages = JSON.parse(localStorage?.getItem("messages") || "[]")

    const filteredMessages = patientId ? messages.filter((m: any) => m.patientId === patientId) : messages

    // Sort by timestamp
    const sortedMessages = filteredMessages.sort(
      (a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    return NextResponse.json(sortedMessages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const messages = JSON.parse(localStorage?.getItem("messages") || "[]")
    const newMessage = {
      id: Date.now().toString(),
      patientId: body.patientId,
      patientName: body.patientName,
      content: body.content,
      timestamp: new Date(),
      isFromPatient: body.isFromPatient || false,
      isRead: false,
      attachments: body.attachments || [],
    }

    const updatedMessages = [...messages, newMessage]
    localStorage.setItem("messages", JSON.stringify(updatedMessages))

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
