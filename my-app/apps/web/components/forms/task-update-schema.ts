import { z } from "zod"

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"], {
    required_error: "Status is required",
  }),
  assigneeId: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
  projectId: z.string().min(1, "Project is required"),
})

// Schema for updating task (only status)
export const taskUpdateSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"], {
    required_error: "Status is required",
  }),
})

export type TaskFormData = z.infer<typeof taskFormSchema>
export type TaskUpdateData = z.infer<typeof taskUpdateSchema>
