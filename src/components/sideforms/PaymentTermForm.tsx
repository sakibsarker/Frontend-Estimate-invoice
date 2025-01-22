"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { X } from "lucide-react"

interface PaymentTermFormProps {
  open: boolean
  onClose: () => void
}

export function PaymentTermForm({ open, onClose }: PaymentTermFormProps) {
  const [termName, setTermName] = useState("")
  const [termDays, setTermDays] = useState("")

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>New Payment Term</SheetTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-destructive">*</span>
                    <Label htmlFor="termName">Term name</Label>
                  </div>
                  <Input
                    id="termName"
                    placeholder="e.g., Net 30"
                    value={termName}
                    onChange={(e) => setTermName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-destructive">*</span>
                    <Label htmlFor="termDays">Days until due</Label>
                  </div>
                  <Input
                    id="termDays"
                    type="number"
                    min="0"
                    placeholder="e.g., 30"
                    value={termDays}
                    onChange={(e) => setTermDays(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t p-6">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                // Here you would typically handle the form submission
                console.log("New payment term:", { termName, termDays })
                onClose()
              }}
            >
              Add New Payment Term
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

