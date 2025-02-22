"use client";
import React, { useState } from "react";
import { userSignUpSchema } from "@/utils/validation";
import { Role } from "@/utils/types";
import { ZodFormattedError } from "zod";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });

  const [formErrors, setFormErrors] = useState<ZodFormattedError<any> | null>(
    null
  );

  const [waitVerification, setWaitVerification] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    // Validate with Zod
    const result = userSignUpSchema.safeParse(formData);

    if (!result.success) {
      console.log("Validation Errors:", result.error.format());
      const errorMessages = result.error.format();
      setFormErrors(errorMessages);
    } else {
      console.log("Valid Data:", result.data);
      // Proceed with API request or form submission
      try {
        const response = await fetch("/api/v1/init-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.data),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
          setWaitVerification(true);
        }
      } catch (error) {
        console.error("Error of POST request:", error);
        // Handle error
      }
    }
  };

  return waitVerification ? (
    <div>verfication email sent to registered email, verfiy please</div>
  ) : (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {formErrors && formErrors?.name && (
            <p className="error">{formErrors.name._errors.join(", ")}</p>
          )}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {formErrors && formErrors?.email && (
            <p className="error">{formErrors.email._errors.join(", ")}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formErrors && formErrors?.password && (
            <p className="error">{formErrors.password._errors.join(", ")}</p>
          )}
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {formErrors && formErrors?.address && (
            <p className="error">{formErrors.address._errors.join(", ")}</p>
          )}
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
