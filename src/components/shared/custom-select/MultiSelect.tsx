import Select, { type MultiValue } from "react-select";

import {
  MultiSelect as MultiSelectUI,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  onChange: (options: string[]) => void;
  value: string[];
  options: Option[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isClearable?: boolean;
}

function MultiSelect({ 
  onChange, 
  value, 
  isClearable = true, 
  disabled, 
  label, 
  options, 
  placeholder = "Select options..." 
}: MultiSelectProps) {
  const defaultValue = (
    options: Option[] | undefined,
    values: string[] | undefined
  ) => {
    if (!options || !values) return [];
    return options.filter((option) => values.includes(option.value));
  };

  return (
    <div>
      {label && (
        <label className={"text-blue-900 mb-1.5 text-sm font-medium leading-6"}>
          {label}
        </label>
      )}
      <div className="mt-2">
                  <MultiSelectUI values={value} onValuesChange={(selectedOptions) => onChange(selectedOptions)}>
      <MultiSelectTrigger className="w-full max-w-[400px]">
        <MultiSelectValue placeholder="Select frameworks..." />
      </MultiSelectTrigger>
      <MultiSelectContent>
        {/* Items must be wrapped in a group for proper styling */}
        <MultiSelectGroup>
          {options?.map((option) => (
            <MultiSelectItem key={option.value} value={option.value}>
              {option.label}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelectUI>



        {/* <Select
          isMulti
          options={options || []}
          onChange={(selectedOptions) => onChange(selectedOptions)}
          value={defaultValue(options, value)}
          isClearable={isClearable}
          classNamePrefix="select"
          isDisabled={disabled}
          placeholder={placeholder}
          closeMenuOnSelect={false}
        /> */}
      </div>
    </div>
  );
}

export default MultiSelect;