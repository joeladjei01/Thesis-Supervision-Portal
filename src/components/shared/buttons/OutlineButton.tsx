type OutlineButtonProps = {
    title: any,
    className?: string,
    onClick: ()=> void
    disabled?: boolean,
    type?: "submit" | "button",
    Icon?: React.ReactNode
}

const OutlineButton = ({title , className, Icon , onClick , disabled , type}: OutlineButtonProps) => {
  return (
    <button
        type={type}
        className={`
          flex items-center justify-center gap-2 cursor-pointer font-medium text-sm py-2 px-6 rounded-sm 
          bg-transparent text-blue-900 border border-gray-400
          transition-all duration-300 active:scale-95
          disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-400 disabled:border-gray-200
          hover:bg-blue-400/5 
          dark:text-blue-400 dark:border-border dark:hover:bg-blue-400/10
          ${className}
        `}
        onClick={onClick}
        disabled={disabled}
    >
        {Icon && <span className="shrink-0">{Icon}</span>}
        <span className="truncate">{title}</span>
    </button>
  )
}

export default OutlineButton