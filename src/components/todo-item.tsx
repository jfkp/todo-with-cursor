import { useState } from "react"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TodoItemProps {
  todo: {
    id: number
    text: string
    completed: boolean
  }
  onUpdate: (id: number, newText: string) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}

export default function TodoItem({ todo, onUpdate, onDelete, onToggle }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-primary"
      />
      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1" autoFocus />
          <Button size="icon" variant="ghost" onClick={handleUpdate} aria-label="Save">
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancel} aria-label="Cancel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} aria-label="Edit todo">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(todo.id)} aria-label="Delete todo">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

