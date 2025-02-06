"use client";
import React from "react";

const SignoutButton: React.FC = () => {
  const handleSignout = async () => {
    try {
      const response = await fetch("/api/v1/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Handle successful logout, e.g., redirect to login page
        console.log("Successfully logged out");
      } else {
        // Handle error
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={handleSignout}>Sign Out</button>;
};

export default SignoutButton;
