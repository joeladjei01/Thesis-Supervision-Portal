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
    py-2 px-3 border border-border rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50
    bg-card text-foreground
    ${className}
  `;

  return (
    <div className={"flex flex-col mb-2 group"}>
      <label className={"text-foreground mb-1.5 text-sm font-medium leading-6"}>
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
        <div className={"text-destructive text-xs mt-1 font-medium animate-fadeIn"}>
          {String(formik?.errors[name])}
        </div>
      )}
    </div>
  );
};

export default AppInput;
