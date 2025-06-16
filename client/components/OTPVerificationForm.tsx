"use client";

import React, { useState } from "react";
// Import Shadcn Form, Input, Button later

interface OTPVerificationFormProps {
  phoneNumber: string;
  userId: string;
  onSubmit: (otp: string) => void;
  onResendOTP: () => void;
}

export default function OTPVerificationForm({
  phoneNumber,
  userId,
  onSubmit,
  onResendOTP,
}: OTPVerificationFormProps) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Verifying phone number: {phoneNumber}</p>
      <div>
        <label htmlFor="otp">Enter OTP</label>
        {/* Shadcn Input */}
        <input
          id="otp"
          type="text" // Or 'number' with pattern
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6} // Assuming 6-digit OTP
        />
      </div>
      {/* Shadcn Button */}
      <button type="submit">Verify OTP</button>
      <button type="button" onClick={onResendOTP}>
        Resend OTP
      </button>
    </form>
  );
}
