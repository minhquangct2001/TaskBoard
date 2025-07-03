"use client"


import { Task } from "../../app/api/mockData"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@workspace/ui/components/button"

import { ArrowUpDown, Edit, Trash2, Loader2 } from "lucide-react"

interface ColumnContext {
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  deletingTaskId?: string | null
}

export const createColumns = (context?: ColumnContext): ColumnDef<Task>[] => [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description") as string
            return (
                <div className="max-w-[300px]">
                    <p className="truncate" title={description}>
                        {description}
                    </p>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="outline"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const statusColors = {
                TODO: "bg-gray-100 text-gray-800",
                IN_PROGRESS: "bg-blue-100 text-blue-800",
                DONE: "bg-green-100 text-green-800"
            }
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
                    {status.replace('_', ' ')}
                </span>
            )
        },
    },
    {
        accessorKey: "assignee.name",
        header: "Assignee",
    },
    {
        accessorKey: "dueDate",
        header: "Due date",
        cell: ({ row }) => {
            const dueDate = row.getValue("dueDate") as string
            if (!dueDate) return <span className="text-muted-foreground">-</span>
            
            const date = new Date(dueDate)
            const now = new Date()
            const isOverdue = date < now
            const isToday = date.toDateString() === now.toDateString()
            
            return (
                <span className={`text-sm ${
                    isOverdue ? "text-red-600 font-medium" : 
                    isToday ? "text-orange-600 font-medium" : 
                    "text-gray-700"
                }`}>
                    {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </span>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const task = row.original
            const isDeleting = context?.deletingTaskId === task.id
            
            return (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => context?.onEdit?.(task)}
                        className="h-8 w-8 p-0"
                        disabled={isDeleting}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => context?.onDelete?.(task.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            )
        },
    },
]

// Keep the old export for backward compatibility
export const columns = createColumns()



