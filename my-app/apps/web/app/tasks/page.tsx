'use client'

import { Project, Task, User } from "../api/mockData";
import { createColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { TaskModal } from "@/components/forms/task-modal";
import { ConfirmDeleteDialog } from "@/components/forms/confirm-delete-dialog";
import { TaskFormData } from "@/components/forms/task-form-schema";
import { TaskUpdateData } from "@/components/forms/task-update-schema";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { get, post, put, patch, del } from "@workspace/ui/lib/apiClients";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@workspace/ui/components/button";
import { Alert, AlertTitle, AlertDescription } from "@workspace/ui/components/alert";
import { TaskTableSkeleton } from "@workspace/ui/components/task-table-skeleton";
import { DataTableErrorBoundary } from "@/components/table/data-table-error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { useUIStore } from "../../store/ui-store";
import { Plus, AlertTriangle, Table, Kanban } from "lucide-react";
import ErrorBoundary from "./error";
import { toast } from "sonner";

import { NoSSR } from "@/components/no-ssr";

const Page = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-1");
    const [error, setError] = useState<string | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { viewMode, setViewMode } = useUIStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [projectsData, tasksData, usersData] = await Promise.all([
                    get<Project[]>("/api/projects"),
                    get<Task[]>(`/api/projects/${selectedProjectId}/tasks`),
                    get<User[]>("/api/users")
                ]);
                setProjects(projectsData);
                setTasks(tasksData);
                setUsers(usersData);
            } catch (err) {
                console.error("API Error:", err);
                setError(err instanceof Error ? err.message : "Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedProjectId]);

    useEffect(() => {
        if (lastRefresh && !refreshing) {
            const timer = setTimeout(() => {
                setLastRefresh(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lastRefresh, refreshing]);

    const handleCreateTask = useCallback(() => {
        setEditingTask(null);
        setIsModalOpen(true);
    }, []);

    const handleEditTask = useCallback((task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    }, []);

    const refreshTasks = useCallback(async () => {
        try {
            setRefreshing(true);
            setError(null);
            const tasksData = await get<Task[]>(`/api/projects/${selectedProjectId}/tasks`);
            setTasks(tasksData);
            setLastRefresh(new Date());
        } catch (err) {
            console.error("Refresh Error:", err);
            setError(err instanceof Error ? err.message : "Failed to refresh tasks. Please try again.");
            toast.error("Failed to refresh tasks");
        } finally {
            setRefreshing(false);
        }
    }, [selectedProjectId]);

    const handleDeleteTask = useCallback(async (taskId: string) => {
        setTaskToDelete(taskId);
        setIsDeleteDialogOpen(true);
    }, []);

    const confirmDeleteTask = useCallback(async () => {
        if (!taskToDelete) return;

        try {
            setDeletingTaskId(taskToDelete);
            setError(null);
            await del(`/api/tasks/${taskToDelete}`);
            await refreshTasks();
            setIsDeleteDialogOpen(false);
            setTaskToDelete(null);
            toast.success("Task deleted successfully");
        } catch (err) {
            console.error("Delete Error:", err);
            setError(err instanceof Error ? err.message : "Failed to delete task. Please try again.");
            toast.error("Failed to delete task");
            try {
                await refreshTasks();
            } catch (refreshErr) {
                console.error("Refresh after delete error failed:", refreshErr);
            }
        } finally {
            setDeletingTaskId(null);
        }
    }, [taskToDelete, refreshTasks]);

    const cancelDeleteTask = useCallback(() => {
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
    }, []);

    const handleSubmitTask = useCallback(async (data: TaskFormData | TaskUpdateData) => {
        try {
            if (editingTask) {
                await patch<Task>(`/api/tasks/${editingTask.id}`, data);
                toast.success("Task updated successfully");
            } else {
                await post<Task>("/api/tasks", data);
                toast.success("Task created successfully");
            }
            await refreshTasks();
        } catch (err) {
            console.error("Submit Error:", err);
            toast.error(editingTask ? "Failed to update task" : "Failed to create task");
            try {
                await refreshTasks();
            } catch (refreshErr) {
                console.error("Refresh after error failed:", refreshErr);
            }
            throw err;
        }
    }, [editingTask, refreshTasks]);

    const handleUpdateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
        try {
            setIsUpdating(true);
            setError(null);

            await patch<Task>(`/api/tasks/${taskId}`, updates);
            toast.success("Task updated successfully");

            await refreshTasks();
        } catch (err) {
            console.error("Update Error:", err);
            setError(err instanceof Error ? err.message : "Failed to update task. Please try again.");
            toast.error("Failed to update task");
        } finally {
            setIsUpdating(false);
        }
    }, [refreshTasks]);

    const columns = useMemo(() => createColumns({
        onEdit: handleEditTask,
        onDelete: handleDeleteTask,
        deletingTaskId,
    }), [handleEditTask, handleDeleteTask, deletingTaskId]);

    const handleProjectChange = useCallback((projectId: string) => {
        setSelectedProjectId(projectId);
        setError(null);
    }, []);

    const retryLoading = useCallback(() => {
        setError(null);
        setLoading(true);
    }, []);

    if (loading) {
        return (
            <NoSSR>
                <div className="py-10">
                    <TaskTableSkeleton rows={5} />
                </div>
            </NoSSR>
        );
    }

    return (
        <ErrorBoundary>
            <div className="py-10">
                {error && (
                    <div className="mb-6">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription className="mt-2">
                                {error}
                                <div className="mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={retryLoading}
                                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'kanban')}>
                    <div className="flex items-center justify-between mb-6 px-9">
                        <TabsList>
                            <TabsTrigger value="table" className="flex items-center gap-2">
                                <Table className="h-4 w-4" />
                                Table View
                            </TabsTrigger>
                            <TabsTrigger value="kanban" className="flex items-center gap-2">
                                <Kanban className="h-4 w-4" />
                                Kanban Board
                            </TabsTrigger>
                        </TabsList>

                        <Button
                            onClick={handleCreateTask}
                            disabled={refreshing || isUpdating}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Task
                        </Button>
                    </div>

                    <TabsContent value="table" className="min-h-[600px]">
                        <DataTableErrorBoundary onRetry={refreshTasks}>
                            {refreshing && tasks.length === 0 ? (
                                <NoSSR>
                                    <TaskTableSkeleton rows={3} />
                                </NoSSR>
                            ) : (
                                <div className="relative">
                                    <DataTable
                                        columns={columns}
                                        data={tasks}
                                        title="Task Management"
                                        projects={projects}
                                        selectedProjectId={selectedProjectId}
                                        onProjectChange={handleProjectChange}
                                    />
                                </div>
                            )}
                        </DataTableErrorBoundary>
                    </TabsContent>

                    <TabsContent value="kanban" className="min-h-[600px]">
                        <ErrorBoundary>
                            {refreshing && tasks.length === 0 ? (
                                <NoSSR>
                                    <div className="flex items-center justify-center h-[700px]">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Loading Kanban board...</p>
                                        </div>
                                    </div>
                                </NoSSR>
                            ) : (
                                <div className="relative">
                                    {(refreshing || isUpdating) && tasks.length > 0 && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <div className="bg-blue-50 border border-blue-200 rounded-md px-2 py-1 text-xs text-blue-700">
                                                {isUpdating ? "Updating task..." : "Refreshing..."}
                                            </div>
                                        </div>
                                    )}
                                    <KanbanBoard
                                        tasks={tasks}
                                        users={users}
                                        onUpdateTask={handleUpdateTask}
                                        onCreateTask={handleCreateTask}
                                        isUpdating={isUpdating}
                                    />
                                </div>
                            )}
                        </ErrorBoundary>
                    </TabsContent>
                </Tabs>

                <ErrorBoundary>
                    <TaskModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        task={editingTask}
                        projects={projects}
                        users={users}
                        defaultProjectId={selectedProjectId}
                        onSubmit={handleSubmitTask}
                    />
                </ErrorBoundary>

                <ConfirmDeleteDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={cancelDeleteTask}
                    onConfirm={confirmDeleteTask}
                    isDeleting={!!deletingTaskId}
                />
            </div>
        </ErrorBoundary>
    );
};

export default Page;
