"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { NewConversationDialog } from "@/components/new-conversation-dialog"
import { Search, Plus, Send, Paperclip, Smile } from "lucide-react"
import { formatDateTime, getInitials } from "@/lib/utils"
import { useSyncWithServer } from "@/hooks/use-sync-with-server"
import type { Message, Patient } from "@/lib/types"

// Sample data
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: new Date("1985-03-15"),
    gender: "Male",
    address: "123 Main St, Anytown, ST 12345",
    notes: "Regular checkups, no known allergies",
    allergies: "None",
    lastVisit: new Date("2024-01-15"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: new Date("1992-07-22"),
    gender: "Female",
    address: "456 Oak Ave, Somewhere, ST 67890",
    notes: "Hypertension monitoring",
    allergies: "Penicillin",
    lastVisit: new Date("2024-01-10"),
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-10"),
  },
]

const sampleMessages: Message[] = [
  {
    id: "1",
    content:
    "Hi I wanted to follow up on my recent blood work results. When would be a good time to discuss them to Dr Johnson?",
    senderId: "1",
    patientId: "1",
    isRead: true,
    createdAt: new Date("2024-01-16T14:30:00"),
    updatedAt: new Date("2024-01-16T14:30:00"),
    sender: { id: "1", name: "John Smith" },
    patient: { id: "1", name: "John Smith" },
  },
  {
    id: "2",
    content:
      "Thank you for your message.  I'd like to schedule a brief follow-up to discuss the results in detail.",
    senderId: "doc1",
    patientId: "1",
    isRead: true,
    createdAt: new Date("2024-01-16T16:45:00"),
    updatedAt: new Date("2024-01-16T16:45:00"),
    sender: { id: "doc1", name: "Dr. Johnson" },
    patient: { id: "1", name: "John Smith" },
  },
  {
    id: "3",
    content: " I'm available next Tuesday afternoon. Should I bring anything specific to the appointment?",
    senderId: "1",
    patientId: "1",
    isRead: false,
    createdAt: new Date("2024-01-17T09:15:00"),
    updatedAt: new Date("2024-01-17T09:15:00"),
    sender: { id: "1", name: "John Smith" },
    patient: { id: "1", name: "John Smith" },
  },
  {
    id: "4",
    content:
      "Hello Dr. Johnson, I've been experiencing some side effects from my new medication. Could we discuss alternatives?",
    senderId: "2",
    patientId: "2",
    isRead: false,
    createdAt: new Date("2024-01-17T11:20:00"),
    updatedAt: new Date("2024-01-17T11:20:00"),
    sender: { id: "2", name: "Emily Davis" },
    patient: { id: "2", name: "Emily Davis" },
  },
]

interface Conversation {
  patientId: string
  patientName: string
  lastMessage: Message
  unreadCount: number
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const selectedPatientId = searchParams.get("patient")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedPatientId)
  const [newMessage, setNewMessage] = useState("")
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: messages, setData: setMessages } = useSyncWithServer<Message[]>(
    "messages",
    sampleMessages,
    "/api/messages",
  )

  const { data: patients } = useSyncWithServer<Patient[]>("patients", samplePatients, "/api/patients")

  // Group messages by patient to create conversations
  const conversations: Conversation[] = patients
    .map((patient) => {
      const patientMessages = messages.filter((msg) => msg.patientId === patient.id)
      if (patientMessages.length === 0) return null

      const lastMessage = patientMessages.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0]
      const unreadCount = patientMessages.filter((msg) => !msg.isRead && msg.senderId !== "doc1").length

      return {
        patientId: patient.id,
        patientName: patient.name,
        lastMessage,
        unreadCount,
      }
    })
    .filter(Boolean) as Conversation[]

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get messages for selected conversation
  const selectedMessages = selectedConversation
    ? messages
        .filter((msg) => msg.patientId === selectedConversation)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : []

  const selectedPatient = patients.find((p) => p.id === selectedConversation)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedMessages])

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const unreadMessages = messages.filter(
        (msg) => msg.patientId === selectedConversation && !msg.isRead && msg.senderId !== "doc1",
      )

      if (unreadMessages.length > 0) {
        const updatedMessages = messages.map((msg) =>
          msg.patientId === selectedConversation && !msg.isRead && msg.senderId !== "doc1"
            ? { ...msg, isRead: true }
            : msg,
        )
        setMessages(updatedMessages)
      }
    }
  }, [selectedConversation, messages, setMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Math.random().toString(36).substring(2),
      content: newMessage.trim(),
      senderId: "doc1",
      patientId: selectedConversation,
      isRead: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: { id: "doc1", name: "Dr. Johnson" },
      patient: selectedPatient ? { id: selectedPatient.id, name: selectedPatient.name } : undefined,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as any)
    }
  }

  const handleNewConversation = (patientId: string) => {
    setSelectedConversation(patientId)
    setIsNewConversationOpen(false)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Conversations sidebar */}
      <div className="w-80 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Messages</CardTitle>
              <Button size="sm" onClick={() => setIsNewConversationOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.patientId}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation === conversation.patientId ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.patientId)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/patient-${conversation.patientId}.png`} />
                    <AvatarFallback>{getInitials(conversation.patientName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{conversation.patientName}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2 px-2 py-0 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(conversation.lastMessage.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedPatient ? (
          <Card className="flex-1 flex flex-col">
            {/* Chat header */}
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/patient-${selectedPatient.id}.png`} />
                  <AvatarFallback>{getInitials(selectedPatient.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedPatient.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "doc1" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.senderId === "doc1"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === "doc1" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatDateTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={2}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground">Select a conversation</h3>
              <p className="text-muted-foreground mt-1">Choose a patient from the sidebar to start messaging</p>
            </div>
          </Card>
        )}
      </div>

      <NewConversationDialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
        patients={patients}
        onSelectPatient={handleNewConversation}
      />
    </div>
  )
}
