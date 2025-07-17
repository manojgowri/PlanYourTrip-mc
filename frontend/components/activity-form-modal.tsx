"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivityForm } from "./activity-form"
import type { Activity } from "@/lib/models"

interface ActivityFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (activity: Omit<Activity, "_id">) => Promise<void>
  initialData?: Activity
  isSubmitting: boolean
}

export function ActivityFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ActivityFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Activity" : "Add New Activity"}</DialogTitle>
        </DialogHeader>
        <ActivityForm initialData={initialData} onSubmit={onSubmit} onCancel={onClose} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}
