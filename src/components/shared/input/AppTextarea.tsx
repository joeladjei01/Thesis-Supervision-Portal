import type { FormikProps } from "formik";

type textareaProp = {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  formik?: FormikProps<any>;
};

const AppTextarea = ({
  label,
  name,
  placeholder,
  rows = 4,
  formik,
}: textareaProp) => {
  return (
    <div className="flex flex-col mb-2">
      <label className="text-blue-900 mb-1.5 font-semibold">{label}</label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        className="py-2 px-3 border-1 border-gray-300 rounded-md focus:outline-1.5 focus:-outline-offset- focus:outline-blue-600 resize-none"
        value={formik?.values[name]}
      />
      {formik?.touched[name] && formik?.errors[name] && (
        <div className="text-red-600 text-sm mt-1">
          {String(formik?.errors[name])}
        </div>
      )}
    </div>
  );
};

export default AppTextarea;
