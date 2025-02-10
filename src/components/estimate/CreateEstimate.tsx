"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import Vehicle_Database from "@/lib/Vehicle_Database.json";

export default function CreateEstimate() {
  const [repairDate, setRepairDate] = useState<Date | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  // Parse the vehicle database to create a structured object
  const vehicleOptions = Vehicle_Database.reduce((acc, vehicle) => {
    if (!acc[vehicle.Year]) {
      acc[vehicle.Year] = {};
    }
    if (!acc[vehicle.Year][vehicle.Make]) {
      acc[vehicle.Year][vehicle.Make] = [];
    }
    if (!acc[vehicle.Year][vehicle.Make].includes(vehicle.Model)) {
      acc[vehicle.Year][vehicle.Make].push(vehicle.Model);
    }
    return acc;
  }, {} as Record<string, Record<string, string[]>>);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Combine vehicle details into one string
    const vehicleName = `${selectedYear} ${selectedMake} ${selectedModel}`;
    formData.append("vehicle_name", vehicleName);

    // Append date separately
    if (repairDate) {
      formData.append("repair_date", repairDate.toISOString().split("T")[0]);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/repair-requests/create/`,
        {
          method: "POST",
          body: formData,
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
                <Label htmlFor="vehicle_year">Vehicle Year</Label>
                <select
                  id="vehicle_year"
                  className="w-full border rounded-lg p-2"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMake("");
                    setSelectedModel("");
                  }}
                  required
                >
                  <option value="" disabled>
                    Select a year
                  </option>
                  {Object.keys(vehicleOptions).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_make">Vehicle Make</Label>
                <select
                  id="vehicle_make"
                  className="w-full border rounded-lg p-2"
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setSelectedModel("");
                  }}
                  required
                  disabled={!selectedYear}
                >
                  <option value="" disabled>
                    {selectedYear ? "Select a make" : "First select a year"}
                  </option>
                  {selectedYear &&
                    Object.keys(vehicleOptions[selectedYear]).map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_model">Vehicle Model</Label>
                <select
                  id="vehicle_model"
                  className="w-full border rounded-lg p-2"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  required
                  disabled={!selectedMake}
                >
                  <option value="" disabled>
                    {selectedMake ? "Select a model" : "First select a make"}
                  </option>
                  {selectedMake &&
                    vehicleOptions[selectedYear][selectedMake].map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
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
              <Button
                type="button"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800"
              >
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
