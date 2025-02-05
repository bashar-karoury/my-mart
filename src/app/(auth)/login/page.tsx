"use client";
import React, { useState } from "react";
import { userLoginSchema } from "@/utils/validation";
import { ZodFormattedError } from "zod";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<ZodFormattedError<any> | null>(
    null
  );

  const router = useRouter();
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
    const result = userLoginSchema.safeParse(formData);

    if (!result.success) {
      console.log("Validation Errors:", result.error.format());
      const errorMessages = result.error.format();
      setFormErrors(errorMessages);
    } else {
      console.log("Valid Data:", result.data);
      // Proceed with API request or form submission
      try {
        const response = await fetch("/api/v1/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.data),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
          router.push("/");
        }
      } catch (error) {
        console.error("Error of POST request:", error);
        // Handle error
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
