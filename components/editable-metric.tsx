"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Edit2, X } from "lucide-react"

interface EditableMetricProps {
  value: number
  onSave: (value: number) => void
  className?: string
}

export function EditableMetric({ value, onSave, className }: EditableMetricProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())

  const handleSave = () => {
    const numValue = Number.parseInt(editValue) || 0
    onSave(numValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value.toString())
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-20 h-8 text-xl font-bold"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
        />
        <Button size="sm" variant="ghost" onClick={handleSave}>
          <Check className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <span className="text-2xl font-bold">{value}</span>
      <Button
        size="sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="w-3 h-3" />
      </Button>
    </div>
  )
}
