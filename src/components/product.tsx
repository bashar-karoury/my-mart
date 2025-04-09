"use client";
import React from "react";
import { createSession } from "@/utils/payment";

const Product: React.FC = () => {
  return (
    <div>
      <h1>Product</h1>
      <p>product with details</p>
      <button
        onClick={async () => {
          const sessionLink = await createSession("acct_1RBwZSR9iy8XaQUL");
          window.location.href = sessionLink;
        }}
      >
        purchase
      </button>
    </div>
  );
};

export default Product;
