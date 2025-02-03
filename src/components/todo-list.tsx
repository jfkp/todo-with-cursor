"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TodoItem from "@/components/todo-item"
import { db } from "@/lib/firebase"
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[]
      setTodos(todosData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      try {
        await addDoc(collection(db, "todos"), {
          text: newTodo.trim(),
          completed: false,
          createdAt: new Date().toISOString()
        })
        setNewTodo("")
      } catch (error) {
        console.error("Error adding todo:", error)
      }
    }
  }

  const updateTodo = async (id: string, newText: string) => {
    try {
      const todoRef = doc(db, "todos", id)
      await updateDoc(todoRef, { text: newText })
    } catch (error) {
      console.error("Error updating todo:", error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id))
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      try {
        const todoRef = doc(db, "todos", id)
        await updateDoc(todoRef, { completed: !todo.completed })
      } catch (error) {
        console.error("Error toggling todo:", error)
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
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
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onUpdate={updateTodo} 
                onDelete={deleteTodo} 
                onToggle={toggleTodo} 
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 