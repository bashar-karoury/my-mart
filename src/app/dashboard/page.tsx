import React from "react";
import { getUserFromSession } from "@/utils/sessions";
import CustomerDashboard from "@/components/customerDashboard";
import SellerDashboard from "@/components/sellerDashboard";
import AdminDashboard from "@/components/adminDashboard";
import { redirect } from "next/navigation";

const DashboardPage: React.FC = async () => {
  const user = await getUserFromSession();
  // const session_id = cookieStore.get("session_id")?.value;
  // console.log("user from session", user);

  if (user?.role === "Customer") {
    return <CustomerDashboard />;
  } else if (user?.role === "Seller") {
    return <SellerDashboard />;
  } else if (user?.role === "Admin") {
    return <AdminDashboard />;
  } else {
    redirect("/login");
  }
};

export default DashboardPage;
