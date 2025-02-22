"use client";
import React, { useState } from "react";
import { passwordScheme } from "@/utils/validation";
import { ZodFormattedError } from "zod";

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<ZodFormattedError<any> | null>(
    null
  );
  const [misMatchError, setMisMatchError] = useState(false);

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
    const result = passwordScheme.safeParse(formData.password);

    if (!result.success) {
      console.log("Validation Errors:", result.error.format());
      const errorMessages = result.error.format();
      setFormErrors(errorMessages);
    } else {
      console.log("Valid Data:", result.data);
      // Proceed with API request or form submission
      if (formData.password !== formData.confirmPassword) {
        setMisMatchError(true);
      }
      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get("token");

      try {
        const response = await fetch("/api/v1/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: result.data, token: resetToken }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
        }
      } catch (error) {
        console.error("Error of POST request:", error);
        // Handle error
      }
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="confirm password">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {misMatchError && <p className="error"> passwords dont match</p>}
        </div>
        <button type="submit">reset password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
