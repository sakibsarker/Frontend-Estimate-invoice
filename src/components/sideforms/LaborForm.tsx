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

export function LaborForm({ open, onClose }: TaxFormProps) {
  const [laborCostName, setLaborCostName] = useState("");
  const [laborCostRate, setLaborCostRate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/labor-costs/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            labor_cost_name: laborCostName,
            labor_cost_rate: parseFloat(laborCostRate),
          }),
        }
      );

      if (response.ok) {
        toast.success("Labor cost created successfully!");
        setLaborCostName("");
        setLaborCostRate("");
        onClose();
      } else {
        throw new Error("Failed to create labor cost");
      }
    } catch (error) {
      toast.error("Error creating labor cost");
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
                <SheetTitle>New Labor Charge</SheetTitle>
              </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="laborCostName">Labor Cost Name</Label>
                    </div>
                    <Input
                      id="laborCostName"
                      value={laborCostName}
                      onChange={(e) => setLaborCostName(e.target.value)}
                      placeholder="e.g., Standard Service"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="laborCostRate">Labor Rate ($)</Label>
                    </div>
                    <Input
                      id="laborCostRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={laborCostRate}
                      onChange={(e) => setLaborCostRate(e.target.value)}
                      placeholder="e.g., 45.00"
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
                  Create Labor Cost
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
