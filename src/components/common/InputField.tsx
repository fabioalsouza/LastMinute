import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  hint,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="text-xs font-semibold text-on-surface">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all ${
            icon ? 'pl-11' : ''
          } ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {hint && !error && (
        <span className="text-[11px] text-on-surface-variant">{hint}</span>
      )}
      {error && (
        <span className="text-[11px] font-medium text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </span>
      )}
    </div>
  );
};
