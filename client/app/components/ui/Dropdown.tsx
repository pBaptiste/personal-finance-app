import { useState, useRef, useEffect } from "react";
import type React from "react";
import caretDown from "../../images/icon-caret-down.svg"

/**
 * DropdownOption interface for dropdown options
 */
export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Accessible Dropdown Component
 * 
 * A fully accessible custom dropdown component that replaces native select elements.
 * Features:
 * - Full keyboard navigation (Arrow keys, Enter, Escape, Home, End, Tab)
 * - ARIA attributes for screen readers
 * - Click outside to close
 * - Focus management
 * - Works with React Router forms via hidden input
 * 
 * @example
 * ```tsx
 * <Dropdown
 *   id="type"
 *   name="type"
 *   label="Transaction Type"
 *   value={formData.type}
 *   options={[
 *     { value: 'income', label: 'Income' },
 *     { value: 'expense', label: 'Expense' }
 *   ]}
 *   onChange={(value) => setFormData({ ...formData, type: value })}
 *   required
 * />
 * ```
 */

interface DropdownProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
  "aria-describedby"?: string;
}

export default function Dropdown({
  id,
  name,
  label,
  value,
  options,
  onChange,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  className = "",
  error,
  "aria-describedby": ariaDescribedBy,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [listboxPosition, setListboxPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Find the selected option's label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        listboxRef.current &&
        !listboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && listboxRef.current && focusedIndex >= 0) {
      const options = listboxRef.current.querySelectorAll('[role="option"]');
      if (options[focusedIndex]) {
        (options[focusedIndex] as HTMLElement).focus();
      }
    }
  }, [isOpen, focusedIndex]);

  // Set initial focused index to selected option
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, value, options]);

  // Calculate position for fixed dropdown list
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setListboxPosition({
        top: buttonRect.bottom + 16, // mt-4 = 16px
        left: buttonRect.left,
        width: buttonRect.width,
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (!options.find((opt) => opt.value === optionValue)?.disabled) {
      onChange(optionValue);
      setIsOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen && options.length > 0) {
          setIsOpen(true);
        } else if (isOpen && options.length > 0) {
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case "Home":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          setFocusedIndex(0);
        }
        break;
      case "End":
        e.preventDefault();
        if (isOpen && options.length > 0) {
          setFocusedIndex(options.length - 1);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    optionValue: string
  ) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleSelect(optionValue);
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
    }
  };

  const handleOptionMouseEnter = (index: number) => {
    setFocusedIndex(index);
  };

  // Generate unique IDs
  const listboxId = `${id}-listbox`;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <label
        htmlFor={id}
        className="block text-grey-500 text-preset-5-bold mb-1"
      >
        {label}
        {required && <span className="text-red" aria-label="required"> *</span>}
      </label>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        id={`${id}-button`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        aria-required={required}
        aria-invalid={!!error}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          w-full px-5 py-3 border rounded-lg text-preset-4 text-left
          focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-between
          ${
            error
              ? "border-red"
              : "border-beige-500"
          }
          ${disabled ? "bg-grey-100" : "bg-white cursor-pointer"}
          ${isOpen ? "ring-2 ring-blue" : ""}
        `}
      >
        <span
          id={`${id}-label`}
          className={value ? "text-grey-900" : "text-grey-500"}
        >
          {displayValue}
        </span>
        <img 
          src={caretDown}
          alt="Caret"
          className={`transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Error Message */}
      {error && (
        <div id={errorId} className="mt-1 text-preset-5 text-red" role="alert">
          {error}
        </div>
      )}

      {/* Dropdown List */}
      {isOpen && options.length > 0 && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          style={{
            position: 'fixed',
            top: `${listboxPosition.top}px`,
            left: `${listboxPosition.left}px`,
            width: `${listboxPosition.width}px`,
            zIndex: 9999,
          }}
          className="bg-white rounded-lg shadow-2xl max-h-64 overflow-auto focus:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isFocused = index === focusedIndex;
            const isDisabled = option.disabled || false;
            const isLast = index === options.length - 1;

            return (
           
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                tabIndex={isFocused ? 0 : -1}
                onClick={() => !isDisabled && handleSelect(option.value)}
                onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                onMouseEnter={() => !isDisabled && handleOptionMouseEnter(index)}
                className={`
                  px-4 py-3 text-preset-4 cursor-pointer
                  ${!isLast ? "border-b border-grey-100" : ""}
                  focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2
                  ${
                    isSelected
                      ? "text-grey-900"
                      : "text-grey-500"
                  }
                  ${
                    isFocused && !isSelected
                      ? "text-grey-900"
                      : ""
                  }
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-grey-100"
                  }
                `}
              >
                {option.label}
                {isSelected && (
                  <span className="sr-only"> (selected)</span>
                )}
              </li>
            
            );
          })}
        </ul>
      )}
    </div>
  );
}

