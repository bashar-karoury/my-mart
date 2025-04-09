import React from "react";
import Product from "./product";

const CustomerDashboard: React.FC = () => {
  return (
    <div>
      <h1>Customer Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <Product />
    </div>
  );
};

export default CustomerDashboard;
