import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Loader from "@/components/Loader";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    if (token) {
      // User is logged in, proceed to render the Outlet
      setLoading(false);
    } else {
      // User is not logged in, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    // Show a loading indicator while checking the login status
    return <Loader />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
