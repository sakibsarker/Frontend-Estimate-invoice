"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";

export default function CreateEstimate() {
  const [repairDate, setRepairDate] = useState<Date | undefined>(undefined);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Append date separately (since FormData does not support Date objects)
    if (repairDate) {
      formData.append("repair_date", repairDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/repair-requests/create/`,
        {
          method: "POST",
          body: formData, // Send FormData directly
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Estimate creation failed");
      }

      // Handle successful response
      const result = await response.json();
      console.log("Estimate created:", result);
      alert("Estimate request submitted successfully!");

      // Reset form
      event.currentTarget.reset();
      setRepairDate(undefined);
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to submit estimate request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-2xl font-normal">
            Estimate Request Form:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Name:</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone:</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_name">Vehicle Name</Label>
                <select
                  id="vehicle_name"
                  name="vehicle_name"
                  className="w-full border rounded-lg p-2"
                  required
                >
                  <option value="" disabled selected>
                    Select a vehicle model
                  </option>
                  <optgroup label="BMW">
                    <option value="BMW X5">BMW X5</option>
                    <option value="BMW X3">BMW X3</option>
                    <option value="BMW X7">BMW X7</option>
                    <option value="BMW 3 Series">BMW 3 Series</option>
                    <option value="BMW 5 Series">BMW 5 Series</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimate_attachments">File Attachment</Label>
                <Input
                  id="estimate_attachments"
                  name="estimate_attachments"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repair_date">Repair Date and Time:</Label>
                <DateTimePicker date={repairDate} setDate={setRepairDate} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repair_details">Repair Details:</Label>
              <Textarea
                id="repair_details"
                name="repair_details"
                placeholder="Describe the repairs needed"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                Submit Estimate Request
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900"
              >
                Close
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
