"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TodoItem from "@/components/todo-item"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        },
      ])
      setNewTodo("")
    }
  }

  const updateTodo = (id: number, newText: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newTodo.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </form>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No todos yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} onToggle={toggleTodo} />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

