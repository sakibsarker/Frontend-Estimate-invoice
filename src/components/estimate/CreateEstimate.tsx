"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import Vehicle_Database from "@/lib/Vehicle_Database.json";
import { useCreateRepairRequestMutation } from "@/features/server/repairRequestSlice";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function CreateEstimate() {
  const [repairDate, setRepairDate] = useState<Date | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const navigate = useNavigate();

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

  const [createRepairRequest, { isLoading }] = useCreateRepairRequestMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();

    // Add text fields
    formData.append(
      "username",
      (event.currentTarget.elements.namedItem("username") as HTMLInputElement)
        .value
    );
    formData.append(
      "email",
      (event.currentTarget.elements.namedItem("email") as HTMLInputElement)
        .value
    );
    formData.append(
      "phone_number",
      (
        event.currentTarget.elements.namedItem(
          "phone_number"
        ) as HTMLInputElement
      ).value
    );
    formData.append(
      "repair_details",
      (
        event.currentTarget.elements.namedItem(
          "repair_details"
        ) as HTMLTextAreaElement
      ).value
    );

    // Add vehicle info
    const vehicleName = `${selectedYear} ${selectedMake} ${selectedModel}`;
    formData.append("vehicle_name", vehicleName);

    // Add repair date
    if (repairDate) {
      formData.append("repair_date", repairDate.toISOString());
    }

    // Add all accumulated files
    selectedFiles.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      await createRepairRequest(formData).unwrap();
      toast.success("Estimate request submitted successfully!");

      // Clear files after successful upload
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedYear("");
      setSelectedMake("");
      setSelectedModel("");
      setRepairDate(undefined);
      // Add page reload after successful submission
      window.location.reload();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to submit estimate request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" />

      <Card className="mx-auto max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-2xl font-semibold">
            {t("estimateRequestForm")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("name")}:</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}:</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}:</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_year">{t("vehicleYear")}</Label>
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
                <Label htmlFor="vehicle_make">{t("vehicleMake")}</Label>
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
                <Label htmlFor="vehicle_model">{t("vehicleModel")}</Label>
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
                <Label htmlFor="attachments">{t("attachments")}:</Label>

                <Input
                  id="attachments"
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full border rounded-lg p-2"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.mp4,.mov,.avi,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,image/*,video/*"
                />
                <p className="text-sm text-muted-foreground">
                  {t("uploadDocuments")}
                </p>

                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Selected files:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="repair_date">{t("expireDate")}:</Label>
                <DateTimePicker date={repairDate} setDate={setRepairDate} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repair_details">{t("repairDetails")}:</Label>
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
                disabled={isLoading}
              >
                {isLoading ? t("submitting") : t("submitYourEstimate")}
              </Button>
              <Button variant="outline" onClick={() => navigate("/estimate")}>
                {t("close")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
