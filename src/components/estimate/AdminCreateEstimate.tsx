"use client";

import { useState, useEffect } from "react";
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
import Loader from "../Loader";
import { useNavigate } from "react-router";

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
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const navigate = useNavigate();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No authentication token found");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/customers/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(
          data.map(
            (user: {
              id: any;
              customer_display_name: any;
              email_address: any;
              phone_number: any;
            }) => ({
              id: user.id,
              username: user.customer_display_name,
              email: user.email_address,
              phone_number: user.phone_number,
            })
          )
        );
      } catch (err: any) {
        toast.error(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Uncomment and update this useEffect
  useEffect(() => {
    const foundUser = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    if (foundUser) {
      setEmail(foundUser.email);
      setPhone(foundUser.phone_number);
    } else {
      setEmail("");
      setPhone("");
    }
  }, [username, users]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
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
        (
          event.currentTarget.elements.namedItem(
            "repair_details"
          ) as HTMLTextAreaElement
        )?.value
      );

      // Append files
      const fileInput = event.currentTarget.elements.namedItem(
        "estimate_attachments"
      ) as HTMLInputElement;
      if (fileInput.files) {
        Array.from(fileInput.files).forEach((file) => {
          formData.append("estimate_attachments", file);
        });
      }

      // Append date
      if (repairDate) {
        formData.append("repair_date", repairDate.toISOString().split("T")[0]);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/repair-requests/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Estimate creation failed");
      }

      const result = await response.json();
      console.log("Estimate created:", result);

      toast.success("Repair request created successfully!");
      form.reset();
      setUsername("");
      setEmail("");
      setPhone("");
      setRepairDate(undefined);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to create repair request");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" />
      {/* {loading && <Loader />} */}

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
                        <CommandEmpty>No name found.</CommandEmpty>
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
              <Button
                variant="secondary"
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => navigate("/estimate")}
              >
                Back to home page
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                Submit Estimate
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
