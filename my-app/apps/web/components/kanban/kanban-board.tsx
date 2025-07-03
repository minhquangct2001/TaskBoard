"use client"

import React from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, User } from '../../app/api/mockData'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Calendar, User as UserIcon, Plus } from 'lucide-react'

interface KanbanBoardProps {
  tasks: Task[]
  users: User[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onCreateTask: () => void
  isUpdating: boolean
}

interface Column {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', status: 'TODO' },
  { id: 'in-progress', title: 'In Progress', status: 'IN_PROGRESS' },
  { id: 'done', title: 'Done', status: 'DONE' },
]

interface TaskCardProps {
  task: Task
  users: User[]
  isDragging?: boolean
}

function TaskCard({ task, users, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.8 : 1,
    zIndex: isDragging || isSortableDragging ? 1000 : 'auto',
  }

  const assignee = users.find(u => u.id === task.assignee.id)
  
  // Determine priority color based on due date
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  let dueDateColor = "text-muted-foreground"
  let priorityIndicator = ""
  
  if (daysUntilDue < 0) {
    dueDateColor = "text-red-500"
    priorityIndicator = "border-l-4 border-red-500"
  } else if (daysUntilDue <= 2) {
    dueDateColor = "text-orange-500"
    priorityIndicator = "border-l-4 border-orange-500"
  } else if (daysUntilDue <= 7) {
    dueDateColor = "text-yellow-600"
    priorityIndicator = "border-l-4 border-yellow-500"
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-3 cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-200 bg-card min-h-[120px] ${priorityIndicator} ${
        isDragging || isSortableDragging ? 'shadow-xl ring-2 ring-primary/50' : ''
      }`}
    >
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground/90 leading-tight">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {assignee && (
              <div className="flex items-center space-x-2 bg-muted rounded-full px-2 py-1">
                <Avatar className="h-5 w-5 border border-border">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary-foreground text-primary-foreground font-medium">
                    {assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground/70 font-medium">{assignee.name.split(' ')[0]}</span>
              </div>
            )}
          </div>
          {task.dueDate && (
            <div className={`flex items-center space-x-1 text-xs font-medium ${dueDateColor} bg-muted rounded-full px-2 py-1`}>
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  users: User[]
  onCreateTask: () => void
  isUpdating: boolean
}

function KanbanColumn({ column, tasks, users, onCreateTask, isUpdating }: KanbanColumnProps) {
  const columnTasks = tasks.filter(task => task.status === column.status)
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  // Get column theme based on status
  const getColumnTheme = (status: string) => {
    switch (status) {
      case 'TODO':
        return {
          headerBg: 'bg-blue-50',
          headerText: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-700',
          dropIndicator: 'border-blue-400 bg-blue-50/50'
        }
      case 'IN_PROGRESS':
        return {
          headerBg: 'bg-amber-50',
          headerText: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-700',
          dropIndicator: 'border-amber-400 bg-amber-50/50'
        }
      case 'DONE':
        return {
          headerBg: 'bg-green-50',
          headerText: 'text-green-700',
          badge: 'bg-green-100 text-green-700',
          dropIndicator: 'border-green-400 bg-green-50/50'
        }
      default:
        return {
          headerBg: 'bg-gray-50',
          headerText: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-700',
          dropIndicator: 'border-gray-400 bg-gray-50/50'
        }
    }
  }

  const theme = getColumnTheme(column.status)

  return (
    <div className="flex flex-col h-full rounded-lg bg-muted/30">
      <div className={`flex items-center justify-between p-3 rounded-t-lg ${theme.headerBg}`}>
        <div className="flex items-center space-x-3">
          <h3 className={`font-semibold text-base ${theme.headerText}`}>{column.title}</h3>
          <Badge className={`${theme.badge} border-0`}>{columnTasks.length}</Badge>
        </div>
        {column.status === 'TODO' && (
          <Button 
            size="sm" 
            variant="ghost"
            className={`hover:${theme.headerBg}`}
            onClick={onCreateTask}
            disabled={isUpdating}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 p-3 rounded-b-lg transition-all duration-300 ease-in-out overflow-y-auto ${
          isOver ? `border-2 border-dashed ${theme.dropIndicator}` : ''
        }`}
        style={{ minHeight: '600px', maxHeight: '600px' }}
      >
        <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 h-full transition-all duration-300 ease-in-out">
            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} users={users} />
            ))}
            {columnTasks.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground/70 min-h-[200px] transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl mb-2 opacity-50">
                    {column.status === 'TODO' ? '📋' : column.status === 'IN_PROGRESS' ? '⚡' : '✅'}
                  </div>
                  <p className="text-sm font-medium">{
                    column.status === 'TODO' ? 'No tasks to do yet' : 
                    column.status === 'IN_PROGRESS' ? 'No tasks in progress' : 
                    'No completed tasks'
                  }</p>
                  {isOver && (
                    <p className={`text-xs mt-2 font-medium ${theme.headerText} animate-pulse`}>
                      Drop task here
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export function KanbanBoard({ tasks, users, onUpdateTask, onCreateTask, isUpdating }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const task = tasks.find(t => t.id === taskId)
    
    if (!task) return

    let newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE' = task.status
    
    const overElement = over.id as string
    
    const columnStatusMap: { [key: string]: 'TODO' | 'IN_PROGRESS' | 'DONE' } = {
      'todo': 'TODO',
      'in-progress': 'IN_PROGRESS', 
      'done': 'DONE'
    }
    
    if (columnStatusMap[overElement]) {
      newStatus = columnStatusMap[overElement]
    } else {
      const overTask = tasks.find(t => t.id === over.id)
      if (overTask) {
        newStatus = overTask.status
      }
    }

    if (newStatus !== task.status) {
      onUpdateTask(taskId, { status: newStatus })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[700px] p-4 bg-gradient-to-b from-background to-muted/20 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              <SortableContext items={[column.id]} strategy={verticalListSortingStrategy}>
                <KanbanColumn
                  column={column}
                  tasks={tasks}
                  users={users}
                  onCreateTask={onCreateTask}
                  isUpdating={isUpdating}
                />
              </SortableContext>
            </div>
          ))}
        </div>
      </div>
      
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask ? (
          <div className="transform-gpu scale-105">
            <TaskCard task={activeTask} users={users} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
