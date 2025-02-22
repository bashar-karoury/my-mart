"use client";
import React, { useState, useEffect } from "react";

const AdminDashboard: React.FC = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);

  useEffect(() => {
    const fetchApprovalRequests = async () => {
      try {
        const response = await fetch("/api/v1/approvalRequests?type=PENDING");
        const data = await response.json();
        console.log("list of approval requests", data);
        setApprovalRequests(data);
      } catch (error) {
        console.error("Error fetching approval requests:", error);
      }
    };

    fetchApprovalRequests();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2> Pending requests</h2>
      <ul>
        {approvalRequests.map((request, index) => (
          <li key={index}>
            {request.email}
            <button
              onClick={async () => {
                try {
                  const response = await fetch(
                    `/api/v1/approvalRequests/${request.id}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ newStatus: "APPROVED" }),
                    }
                  );
                  if (response.ok) {
                    console.log("Request approved successfully");
                  } else {
                    console.error("Failed to approve request");
                  }
                } catch (error) {
                  console.error("Error approving request:", error);
                }
              }}
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
