"use client"

import { useState } from "react"
import { Task, Project, User } from "../../app/api/mockData"
import { TaskForm } from "./task-form"
import { TaskFormData } from "./task-form-schema"
import { TaskUpdateData } from "./task-update-schema"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { AlertTriangle } from "lucide-react"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  projects: Project[]
  users: User[]
  defaultProjectId?: string
  onSubmit: (data: TaskFormData | TaskUpdateData) => Promise<void>
}

export function TaskModal({ 
  isOpen, 
  onClose, 
  task, 
  projects, 
  users, 
  defaultProjectId,
  onSubmit 
}: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: TaskFormData | TaskUpdateData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await onSubmit(data)
      onClose()
    } catch (error) {
      console.error("Error submitting task:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <TaskForm
            task={task}
            projects={projects}
            users={users}
            defaultProjectId={defaultProjectId}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
