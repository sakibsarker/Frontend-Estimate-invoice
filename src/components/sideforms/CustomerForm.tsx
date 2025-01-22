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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
}

export function CustomerForm({ open, onClose }: CustomerFormProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        aria-describedby="customer-form-description"
        className="w-[400px] sm:w-[540px] p-0"
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>New Customer</SheetTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold">Contact details</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="displayName">Customer display name</Label>
                    </div>
                    <Input id="displayName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input id="companyName" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Contact first name</Label>
                      <Input id="firstName" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Contact last name</Label>
                      <Input id="lastName" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input id="phone" type="tel" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold">Billing Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="US">
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address line 1</Label>
                    <Input id="addressLine1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address line 2</Label>
                    <Input id="addressLine2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t p-6">
            <Button className="w-full" size="lg">
              Add New Customer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
