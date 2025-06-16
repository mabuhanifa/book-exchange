"use client";

import React, { useState } from "react";
// Import Shadcn Form, Input, Button later

interface RegistrationFormProps {
  onSubmit: (phoneNumber: string) => void;
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="phone">Phone Number</label>
        {/* Shadcn Input */}
        <input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      {/* Shadcn Button */}
      <button type="submit">Register & Send OTP</button>
    </form>
  );
}
