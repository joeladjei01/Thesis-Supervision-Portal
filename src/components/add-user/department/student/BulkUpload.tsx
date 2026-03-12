import { useState } from "react";
import FileUpload from "./file-upload-component";
import UploadTemplate from "./UploadTemplate";
import UploadHistory from "./UploadHistory";
import Header from "../../../shared/text/Header";

type selectorsType = {
  title: string;
  id: "up" | "hs" | "tp";
};

const selectors: selectorsType[] = [
  {
    title: "Upload File",
    id: "up",
  },
  {
    title: "Upload History",
    id: "hs",
  },
  {
    title: "Template",
    id: "tp",
  },
];

const BulkUpload = () => {
  const [selected, setSelected] = useState<"up" | "hs" | "tp">("up");

  return (
    <div className={""}>
      {/*Selector*/}
      <div
        className={"flex w-full justify-between bg-blue-100 dark:bg-card p-[3px] rounded-sm"}
      >
        {selectors.map((value, index) => (
          <button
            key={index}
            className={`py-2 px-12 ${
              selected === value.id && "bg-white dark:bg-primary"
            } font-semibold text-blue-900 dark:text-blue-200 rounded-sm`}
            onClick={() => setSelected(value.id)}
          >
            {value.title}
          </button>
        ))}
      </div>

      {selected === "up" && (
        <div className={"border-2 bg-white dark:bg-card border-gray-200 p-6 rounded-lg mt-12"}>
          <Header
            title="Upload Student"
            subtitle="Upload a CSV file with students information. Make sure to follow the required format."
          />

          <FileUpload />
        </div>
      )}
      {selected === "hs" && (
        <div className={"border-2 bg-white dark:bg-card border-gray-200 p-6 rounded-lg mt-12"}>
          <Header
            title={"Upload History"}
            subtitle={"View past uploads and their Status"}
          />

          <UploadHistory />
        </div>
      )}
      {selected === "tp" && (
        <div className={"border-2 bg-white dark:bg-card border-gray-200 p-6 rounded-lg mt-12"}>
          <Header
            title={"Available Template"}
            subtitle={"Template for uploading student information"}
          />

          <UploadTemplate />
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
