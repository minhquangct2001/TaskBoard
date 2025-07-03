"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Alert, AlertTitle, AlertDescription } from "@workspace/ui/components/alert"
import { AlertTriangle } from "lucide-react"

interface ConfirmDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  isDeleting?: boolean
}

export function ConfirmDeleteDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Task", 
  description = "Are you sure you want to delete this task?",
  isDeleting = false
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
        </DialogHeader>
        

          <Alert variant="destructive" >
            <AlertDescription>
            <AlertTriangle className="h-4 w-4" />
              {description}
            </AlertDescription>
          </Alert>
       
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
