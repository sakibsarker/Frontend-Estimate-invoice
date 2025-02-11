"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface ItemFormProps {
  open: boolean
  onClose: () => void
}

export function ItemForm({ open, onClose }: ItemFormProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>New Item</SheetTitle>
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
                    <Label htmlFor="name">Item name</Label>
                  </div>
                  <Input id="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-destructive">*</span>
                    <Label htmlFor="price">Unit price</Label>
                  </div>
                  <Input id="price" type="number" min="0" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t p-6">
            <Button className="w-full" size="lg">
              Add New Item
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

