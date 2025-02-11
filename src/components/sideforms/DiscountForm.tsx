"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";

interface TaxFormProps {
  open: boolean;
  onClose: () => void;
}

export function DiscountForm({ open, onClose }: TaxFormProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>New Discount Rate</SheetTitle>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-destructive">*</span>
                    <Label htmlFor="taxName">Tax name</Label>
                  </div>
                  <Input id="taxName" placeholder="e.g., Sales Tax" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <span className="text-destructive">*</span>
                    <Label htmlFor="taxRate">Tax rate (%)</Label>
                  </div>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 8.25"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t p-6">
            <Button className="w-full" size="lg">
              Add New Tax Rate
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
