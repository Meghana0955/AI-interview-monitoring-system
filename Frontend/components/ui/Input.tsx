"use client";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const inputBase =
  "w-full rounded-xl border border-[#1e2d47] bg-[#0d1524] px-4 py-2.5 text-sm text-[#e2e8f0] placeholder:text-[#64748b] outline-none transition-all duration-300 focus:border-[#3b82f6]/60 focus:bg-[#101828] focus:ring-2 focus:ring-[#3b82f6]/20 hover:border-[#243655]";

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">{icon}</span>
        )}
        <input
          className={cn(inputBase, icon && "pl-10", className)}
          {...props}
        />
      </div>
    </div>
  );
}

interface PasswordInputProps extends Omit<InputProps, "type"> {
  label?: string;
}

export function PasswordInput({ label, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={cn(inputBase, "pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition-colors hover:text-white/70"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {label}
        </label>
      )}
      <select
        className={cn(inputBase, "cursor-pointer appearance-none", className)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0d1524]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
