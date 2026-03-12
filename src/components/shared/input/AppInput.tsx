import type { FormikProps } from "formik";

type inputProp = {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  formik?: FormikProps<any>;
  as?: "text" | "textarea";
  className?: string;
};

const AppInput = ({
  label,
  as = "text",
  type,
  name,
  placeholder,
  formik,
  disabled,
  className = "",
}: inputProp) => {
  const commonStyles = `
    py-2 px-3 border border-gray-300 rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
    dark:bg-secondary/5 dark:text-white dark:border-border dark:focus:border-blue-500/50 dark:focus:ring-blue-500/20
    ${className}
  `;

  return (
    <div className={"flex flex-col mb-2 group"}>
      <label className={"text-blue-900 group-focus-within:text-blue-700 dark:text-gray-300 dark:group-focus-within:text-blue-400 mb-1.5 text-sm font-medium leading-6 transition-colors"}>
        {label}
      </label>
      {as === "text" && (
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={formik?.handleChange}
          onBlur={formik?.handleBlur}
          disabled={disabled}
          className={commonStyles}
          value={formik?.values[name] || ""}
        />
      )}

      {as === "textarea" && (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={formik?.handleChange}
          onBlur={formik?.handleBlur}
          disabled={disabled}
          className={commonStyles}
          value={formik?.values[name] || ""}
          rows={4}
        />
      )}
      {formik?.touched[name] && formik?.errors[name] && (
        <div className={"text-red-500 text-xs mt-1 font-medium animate-fadeIn"}>
          {String(formik?.errors[name])}
        </div>
      )}
    </div>
  );
};

export default AppInput;
