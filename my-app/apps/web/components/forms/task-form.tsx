"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskFormSchema, type TaskFormData } from "./task-form-schema"
import { taskUpdateSchema, type TaskUpdateData } from "./task-update-schema"
import { Task, Project, User } from "../../app/api/mockData"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Calendar } from "@workspace/ui/components/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface TaskFormProps {
  task?: Task | null
  projects: Project[]
  users: User[]
  defaultProjectId?: string
  onSubmit: (data: TaskFormData | TaskUpdateData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function TaskForm({ 
  task, 
  projects, 
  users, 
  defaultProjectId,
  onSubmit, 
  onCancel,
  isSubmitting = false
}: TaskFormProps) {
  const isEditing = !!task

  const schema = isEditing ? taskUpdateSchema : taskFormSchema
  
  const form = useForm<TaskFormData | TaskUpdateData>({
    resolver: zodResolver(schema),
    defaultValues: isEditing ? {
      status: task.status,
    } : {
      title: "",
      description: "",
      status: "TODO",
      assigneeId: "",
      dueDate: "",
      projectId: defaultProjectId || "",
    }
  })

  useEffect(() => {
    if (isEditing && task) {
      form.setValue("status", task.status)
    } else if (!isEditing && defaultProjectId) {
      form.setValue("projectId", defaultProjectId)
    }
  }, [task, defaultProjectId, form, isEditing])

  const handleFormSubmit = (data: TaskFormData | TaskUpdateData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {!isEditing && (
            <>
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter task description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project */}
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assignee */}
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
                  const selectedDate = field.value ? new Date(field.value) : undefined
                  
                  return (
                    <FormItem>
                      <FormLabel>Due Date *</FormLabel>
                      <FormControl>
                        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : "Select due date"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  field.onChange(format(date, "yyyy-MM-dd"))
                                  setIsCalendarOpen(false)
                                }
                              }}
                              initialFocus
                            />
                          </DialogContent>
                        </Dialog>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Show task details in edit mode for context */}
          {isEditing && task && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Task Details:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Title:</span> {task.title}</p>
                <p><span className="font-medium">Description:</span> {task.description}</p>
                <p><span className="font-medium">Assignee:</span> {task.assignee.name}</p>
                <p><span className="font-medium">Due Date:</span> {task.dueDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            {(isSubmitting || form.formState.isSubmitting) ? "Saving..." : isEditing ? "Update Status" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
