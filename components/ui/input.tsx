'use client';

import { cn } from '@/lib/utils/cn';
import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { heights, borderRadius, transitions, typography, iconSizes } from '@/lib/design-tokens';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  floatingLabel?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    success,
    helperText,
    floatingLabel = false,
    leftIcon,
    rightIcon,
    id,
    placeholder,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const inputId = id || `input-${Math.random().toString(36).substring(7)}`;
    const showFloatingLabel = floatingLabel && (isFocused || hasValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className={cn(typography.label, 'block text-foreground mb-1.5')}
          >
            {label}
            {props.required && <span className="text-error ml-1" aria-label="required">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Floating Label */}
          {floatingLabel && (
            <AnimatePresence>
              {(isFocused || hasValue || props.value || props.defaultValue) && (
                <motion.label
                  initial={{ y: 12, scale: 1, opacity: 0 }}
                  animate={{ y: -10, scale: 0.85, opacity: 1 }}
                  exit={{ y: 12, scale: 1, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  htmlFor={inputId}
                  className="absolute left-3 top-0 bg-card px-1 text-xs font-medium text-foreground z-10 pointer-events-none"
                >
                  {label}
                  {props.required && <span className="text-error ml-0.5">*</span>}
                </motion.label>
              )}
            </AnimatePresence>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder={floatingLabel ? (isFocused || hasValue ? placeholder : label) : placeholder}
            className={cn(
              'flex w-full border bg-background px-3 py-2',
              heights.input,
              borderRadius.base,
              typography.bodySmall,
              transitions.normal,
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              (rightIcon || error || success) && 'pr-10',
              error
                ? 'border-error focus:ring-error'
                : success
                ? 'border-success focus:ring-success'
                : 'border-border focus:ring-primary',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Right Icons (Error, Success, or Custom) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <AlertCircle className={cn(iconSizes.md, 'text-error')} aria-hidden="true" />
              </motion.div>
            )}
            {success && !error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Check className={cn(iconSizes.md, 'text-success')} aria-hidden="true" />
              </motion.div>
            )}
            {rightIcon && !error && !success && rightIcon}
          </div>
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              id={`${inputId}-error`}
              className={cn('mt-1.5 flex items-center gap-1 text-error', typography.bodySmall)}
              role="alert"
            >
              {error}
            </motion.p>
          )}
          {!error && helperText && (
            <motion.p
              key="helper"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              id={`${inputId}-helper`}
              className={cn('mt-1.5', typography.helpText)}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
