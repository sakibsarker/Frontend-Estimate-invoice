import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "@/components/Loader";
interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string; // Optional fields
  role: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/profile/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile.");
        }

        const data: UserProfile = await response.json();
        setUserProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      localStorage.removeItem("token");
      navigate("/login");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/logout/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed.");
      }

      // Clear token from localStorage

      // Redirect to login page
      navigate("/login");
    } catch (err: any) {
      console.error(err.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Profile Information
        </h2>
        {userProfile && (
          <div>
            <p className="mb-4">
              <span className="font-semibold">Name:</span>{" "}
              {userProfile.username}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Email:</span> {userProfile.email}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Role:</span> {userProfile.role}
            </p>
            {userProfile.phone && (
              <p className="mb-4">
                <span className="font-semibold">Phone:</span>{" "}
                {userProfile.phone}
              </p>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
