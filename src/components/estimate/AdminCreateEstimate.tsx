"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Vehicle_Database from "@/lib/Vehicle_Database.json";
import { CustomerForm } from "../sideforms/CustomerForm";
import toast, { Toaster } from "react-hot-toast";

import { useNavigate } from "react-router";
import { useGetCustomersQuery } from "@/features/server/customerSlice";
import { useCreateRepairRequestMutation } from "@/features/server/repairRequestSlice";

// Add this type definition
type User = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
};

export default function AdminCreateEstimate() {
  const [repairDate, setRepairDate] = useState<Date | undefined>(undefined);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  //  RTK Query
  const {
    data: customers,
    isLoading,
    error: customersError,
  } = useGetCustomersQuery();

  const [createRepairRequest, { isLoading: isLoadingRepairRequest }] =
    useCreateRepairRequestMutation();

  useEffect(() => {
    if (customers) {
      setUsers(
        customers.map((customer) => ({
          id: customer.id,
          username: customer.customer_display_name,
          email: customer.email_address,
          phone_number: customer.phone_number,
        }))
      );
    }
  }, [customers]);

  useEffect(() => {
    if (customersError) {
      toast.error("Failed to load customers");
    }
  }, [customersError]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    const vehicleName = `${selectedYear} ${selectedMake} ${selectedModel}`;
    const form = event.currentTarget;

    try {
      // Append form fields
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone_number", phone);
      formData.append("vehicle_name", vehicleName);
      formData.append(
        "repair_details",
        (form.elements.namedItem("repair_details") as HTMLTextAreaElement)
          ?.value
      );
      formData.append("status", "ACCEPTED");

      // Append files from state
      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      // Append date
      if (repairDate) {
        formData.append("repair_date", repairDate.toISOString().split("T")[0]);
      }

      // Use RTK Query mutation
      const result = await createRepairRequest(formData).unwrap();
      toast.success("Repair request created successfully!");

      // Reset form and files
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      form.reset();
      setUsername("");
      setEmail("");
      setPhone("");
      setRepairDate(undefined);

      navigate(`/estimate/${result.id}/invoice/new/`);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create repair request");
    }
  };

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

  // Add this function inside your component
  const uniqueUsers = users.reduce((acc: User[], current: User) => {
    const existing = acc.find(
      (user) =>
        user.username === current.username &&
        user.email === current.email &&
        user.phone_number === current.phone_number
    );
    if (!existing) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Add file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" />

      <Card className="mx-auto max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-2xl font-semibold">
            Create Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Name:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {username ? username : "Select name..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search name..." />
                      <CommandList>
                        {isLoading ? (
                          <CommandEmpty>Loading customers...</CommandEmpty>
                        ) : (
                          <CommandEmpty>No name found.</CommandEmpty>
                        )}
                        <CommandGroup>
                          {uniqueUsers.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={`${user.username}-${user.id}`}
                              onSelect={() => {
                                setUsername(user.username);
                                setEmail(user.email);
                                setPhone(user.phone_number);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  username === user.username
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex gap-2 items-baseline">
                                <span>{user.username}</span>
                                <span className="text-xs text-muted-foreground">
                                  # {user.email}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone:</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                <Label htmlFor="attachments">Attachments:</Label>
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
                  Upload supporting documents (PDF, DOC/DOCX, XLS/XLSX, images,
                  videos up to 25MB each)
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
                <Label htmlFor="repair_date">Expire date :</Label>
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
              <Button variant="outline" onClick={() => navigate("/estimate")}>
                Go Back
              </Button>

              <Button
                type="submit"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                disabled={isLoadingRepairRequest}
              >
                {isLoadingRepairRequest ? "Submitting..." : "Submit Estimate"}
              </Button>

              <Button
                onClick={() => setShowCustomerForm(true)}
                type="button"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800"
              >
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <CustomerForm
        open={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
      />
    </div>
  );
}
