/**
 * Professional Weight Input Component
 * 
 * Features:
 * - Accepts both comma (,) and dot (.) as decimal separator
 * - Stores internally as number for backend
 * - EU-friendly UX (0,230 → 0.23)
 * - Auto-formats on blur
 * - Prevents non-numeric input
 */

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface WeightInputProps {
  value: number; // Current numeric value
  onChange: (numericValue: number) => void; // Only number passed up
  unit?: string; // Optional unit display (g, kg, ml)
  placeholder?: string;
  className?: string;
  min?: number;
  disabled?: boolean;
}

export function WeightInput({
  value,
  onChange,
  unit = "g",
  placeholder = "150",  // Changed: show whole number example
  className = "w-24",
  min = 0,
  disabled = false
}: WeightInputProps) {
  // UI state: string (allows partial input like "0," or "1.")
  const [inputText, setInputText] = useState<string>("");

  // Initialize from prop
  useEffect(() => {
    if (value === 0 && inputText === "") return; // Don't overwrite empty input
    if (value !== parseInputToNumber(inputText)) {
      setInputText(formatNumberToInput(value));
    }
  }, [value]);

  /**
   * Parse user input to number
   * "150" → 150
   * "1,5" → 1.5
   * "0,230" → 0.23
   * "25" → 25
   * "" → 0
   */
  function parseInputToNumber(text: string): number {
    if (text === "" || text === "," || text === ".") return 0;
    const normalized = text.replace(",", ".");
    const num = Number(normalized);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Format number to display string
   * 0.23 → "0,23"
   * 1.5 → "1,5"
   * 25 → "25"
   */
  function formatNumberToInput(num: number): string {
    if (num === 0) return "";
    return num.toString().replace(".", ",");
  }

  /**
   * Format for display with appropriate decimals
   * 150 → "150"
   * 1.5 → "1,5"
   * 0.23 → "0,23"
   */
  function formatWithDecimals(num: number): string {
    if (num === 0) return "";
    
    // For whole numbers, don't show decimals
    if (Number.isInteger(num)) {
      return num.toString();
    }
    
    // For decimals, show up to 2 decimal places (remove trailing zeros)
    return num.toFixed(2).replace(/\.?0+$/, '').replace(".", ",");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow only digits, comma, and dot
    if (!/^[\d.,]*$/.test(raw)) return;

    // Prevent multiple separators
    const commaCount = (raw.match(/,/g) || []).length;
    const dotCount = (raw.match(/\./g) || []).length;
    if (commaCount + dotCount > 1) return;

    setInputText(raw);

    // Parse and notify parent
    const numeric = parseInputToNumber(raw);
    if (numeric >= min) {
      onChange(numeric);
    }
  };

  const handleBlur = () => {
    const numeric = parseInputToNumber(inputText);
    
    if (numeric === 0) {
      setInputText("");
      return;
    }

    // Auto-format with appropriate decimals
    setInputText(formatWithDecimals(numeric));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select(); // Select all on focus for easy editing
  };

  return (
    <div className="relative inline-flex items-center">
      <Input
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={inputText}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        className={`${className} text-right pr-8`}
      />
      {unit && (
        <span className="absolute right-3 text-sm text-muted-foreground pointer-events-none">
          {unit}
        </span>
      )}
    </div>
  );
}
