// import Select, { type SingleValue } from "react-select";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Option {
  value: string;
  label: string;
}


interface CustomSelectProps {
  // onChange: (option: SingleValue<Option>) => void;
  onChange: (option: any) => void;
  value: string;
  options: Option[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

function CustomSelect({
  onChange,
  isLoading,
  value,
  disabled,
  placeholder = "Select an option",
  label,
  options,
}: CustomSelectProps) {

  return (
    <div>
      {/* <p className={"text-sm mb-1"}>{label}</p> */}
      <label className={"text-blue-900 dark:text-white text-sm font-medium leading-6"}>
        {label}
      </label>

      <Select value={value}   onValueChange={value => onChange(value)} disabled={disabled} >
        <SelectTrigger  className="w-full py-2 px-3" >
          <SelectValue placeholder={placeholder} className="py-2 px-3 text-xl" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup> 
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {isLoading && <p className="mt-1 text-gray-600 dark:text-white text-xs italic">Loading...</p>}

      {/* <Select
         options={options || []}
         onChange={(option) => onChange(option)}
         value={defaultValue(options, value)}
         isClearable={isClearable}
         classNamePrefix={classNamePrefix}
         isDisabled={disabled}
         isLoading={isLoading}
       /> */}
    </div>
  );
}

export default CustomSelect;
