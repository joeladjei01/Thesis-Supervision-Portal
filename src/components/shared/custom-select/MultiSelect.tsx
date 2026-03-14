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
  label?: string;
}

function MultiSelect({ 
  onChange, 
  value, 
  label, 
  options, 
}: MultiSelectProps) {

  return (
    <div>
      {label && (
        <label className={"text-foreground mb-1.5 text-sm font-medium leading-6"}>
          {label}
        </label>
      )}
      <div className="mt-2">
                  <MultiSelectUI values={value} onValuesChange={(selectedOptions) => onChange(selectedOptions)}>
      <MultiSelectTrigger className="w-full">
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