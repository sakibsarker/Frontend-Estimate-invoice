"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import toast, { Toaster } from "react-hot-toast";

interface TaxFormProps {
  open: boolean;
  onClose: () => void;
}

export function TaxForm({ open, onClose }: TaxFormProps) {
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/taxes/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            tax_name: taxName,
            tax_rate: parseFloat(taxRate),
          }),
        }
      );

      if (response.ok) {
        toast.success("Tax created successfully!");
        setTaxName("");
        setTaxRate("");
        onClose();
      } else {
        throw new Error("Failed to create tax");
      }
    } catch (error) {
      toast.error("Error creating tax");
    }
  };

  return (
    <>
      <Toaster />
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-6 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle>New Tax</SheetTitle>
              </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="taxName">Tax Name</Label>
                    </div>
                    <Input
                      id="taxName"
                      value={taxName}
                      onChange={(e) => setTaxName(e.target.value)}
                      placeholder="e.g., GST"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    </div>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      placeholder="e.g., 18.00"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t p-6 mt-auto">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full bg-indigo-600 text-white hover:text-gray-300 hover:bg-indigo-800"
                  size="lg"
                >
                  Create Tax
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
