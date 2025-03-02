import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Loader from "../Loader";

export default function Layout() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true); // State to handle rendering delay

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("token"); // Check for token in local storage

    if (isLoggedIn) {
      // Redirect to the profile page if logged in
      navigate("/");
    } else {
      setIsChecking(false); // Allow rendering of the outlet
    }
  }, [navigate]);

  if (isChecking) {
    // Optional: Show a loading indicator while checking login status
    return <Loader />;
  }

  return (
    <>
      <Outlet /> {/* Render Login or Signup pages if not logged in */}
    </>
  );
}
