// import React from 'react'

type SolidButtonProps = {
  type?: "submit" | "button" | "reset";
  title: any;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  Icon?: any
};

const SolidButton = ({
  title,
  className,
  type,
  onClick,
  disabled,
  Icon
}: SolidButtonProps) => {
  return (
    <button
      type={type}
      className={`
        cursor-pointer py-2 px-11 flex items-center justify-center gap-2 
        text-sm text-white font-semibold rounded-sm
        transition-all duration-300 active:scale-95
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100
        ${disabled 
          ? "bg-gray-300 dark:bg-gray-800 dark:text-gray-500" 
          : "bg-primary hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm hover:shadow-lg dark:shadow-blue-900/40"
        }
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <span className="shrink-0">{Icon}</span>}
      <span className="truncate">{title}</span>
    </button>
  );
};

export default SolidButton;
