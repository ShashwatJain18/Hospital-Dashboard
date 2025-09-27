import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const messages = JSON.parse(localStorage?.getItem("messages") || "[]")
    const messageIndex = messages.findIndex((m: any) => m.id === params.id)

    if (messageIndex === -1) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    const updatedMessage = {
      ...messages[messageIndex],
      isRead: body.isRead,
    }

    messages[messageIndex] = updatedMessage
    localStorage.setItem("messages", JSON.stringify(messages))

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messages = JSON.parse(localStorage?.getItem("messages") || "[]")
    const filteredMessages = messages.filter((m: any) => m.id !== params.id)

    if (messages.length === filteredMessages.length) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    localStorage.setItem("messages", JSON.stringify(filteredMessages))

    return NextResponse.json({ message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
