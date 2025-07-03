'use client'

import { Button } from "@workspace/ui/components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { UserPlus } from "lucide-react"
import { get, post } from "@workspace/ui/lib/apiClients"
import { User } from "../../app/api/mockData"
import { z } from "zod"
import { toast } from "sonner"

const addUserFormSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  role: z.enum(["MEMBER", "ADMIN"], {
    required_error: "Please select a role",
  }),
})

type AddUserFormValues = z.infer<typeof addUserFormSchema>

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
  onUserAdded?: () => void
}

export function InviteUserModal({ isOpen, onClose, projectId, projectName, onUserAdded }: InviteUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      userId: "",
      role: "MEMBER",
    },
  })

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers()
    }
  }, [isOpen, projectId])

  const fetchAvailableUsers = async () => {
    try {
      setLoading(true)
      const users = await get<User[]>(`/api/projects/${projectId}/available-users`)
      setAvailableUsers(users)
    } catch (error) {
      console.error('Error fetching available users:', error)
      toast.error("Failed to load available users")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: AddUserFormValues) {
    try {
      setIsSubmitting(true)
      
      await post(`/api/projects/${projectId}/members`, {
        userId: data.userId,
        role: data.role
      })
      
      toast.success("User added to project successfully")
      form.reset()
      onClose()
      onUserAdded?.()
      
    } catch (error) {
      console.error('Error adding user to project:', error)
      toast.error("Failed to add user to project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add User to Project
          </DialogTitle>
          <DialogDescription>
            Add a user to collaborate on {projectName}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Loading users..." : "Select a user"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                      {availableUsers.length === 0 && !loading && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No available users to add
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || availableUsers.length === 0}>
                {isSubmitting ? "Adding User..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
