"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDateTime, getInitials } from "@/lib/utils"
import type { Message } from "@/lib/types"

interface MessageThreadProps {
  messages: Message[]
  currentUserId: string
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="space-y-4">
      {Object.entries(messageGroups).map(([date, dayMessages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-muted px-3 py-1 rounded-full">
              <p className="text-xs text-muted-foreground font-medium">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-3">
            {dayMessages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId
              const showAvatar = !isCurrentUser && (index === 0 || dayMessages[index - 1].senderId !== message.senderId)

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                    {showAvatar && !isCurrentUser && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`/patient-${message.senderId}.png`} />
                        <AvatarFallback className="text-xs">
                          {message.sender ? getInitials(message.sender.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {!showAvatar && !isCurrentUser && <div className="w-8" />}

                    <div
                      className={`p-3 rounded-lg ${
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className={`text-xs ${
                            isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {formatDateTime(message.createdAt)}
                        </p>
                        {isCurrentUser && (
                          <div className="flex items-center gap-1 ml-2">
                            {message.isRead ? (
                              <div className="w-3 h-3 rounded-full bg-primary-foreground/30" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-primary-foreground/60" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
