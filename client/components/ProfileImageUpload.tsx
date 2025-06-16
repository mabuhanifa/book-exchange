"use client";

import React, { useRef } from "react";
// Import Shadcn Button, Dialog later

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function ProfileImageUpload({
  currentImageUrl,
  onImageUpload,
  loading,
  error,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div>
      {currentImageUrl && (
        <img
          src={currentImageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />
      {/* Shadcn Button */}
      <button onClick={handleButtonClick} disabled={loading}>
        {loading
          ? "Uploading..."
          : currentImageUrl
          ? "Change Image"
          : "Upload Image"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {/* Potentially add Shadcn Dialog for preview/cropping */}
    </div>
  );
}
