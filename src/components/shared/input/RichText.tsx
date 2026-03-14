import ReactQuill from "react-quill-new";

type RichTextProps = {
  value: string;
  label?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  onBlur?: () => void;
  [key: string]: any;
  h?: string;
};

const RichText = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  onBlur,
  h = "h-120",
  ...props
}: RichTextProps) => {
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  return (
    <div className="flex flex-col">
      <label className="text-foreground mb-1.5 text-sm font-medium leading-6">
        {props.label}
      </label>
      <div
        className={`${h} border border-border rounded-md overflow-hidden flex flex-col ${
          readOnly ? "bg-muted" : "bg-card"
        } `}
      >
        <ReactQuill
          modules={{ toolbar: toolbarOptions }}
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="flex-1 flex flex-col"
          onBlur={onBlur}
          {...props}
        />
      </div>
    </div>
  );
};

export default RichText;
