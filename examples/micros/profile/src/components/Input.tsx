import React from "react";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ value, onChange }: InputProps) {
  return (
    <input
      type="text"
      name="username"
      value={value || ""}
      onChange={onChange}
    />
  );
}
