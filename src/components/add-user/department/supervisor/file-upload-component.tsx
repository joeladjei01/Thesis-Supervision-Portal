import React, {
  useState,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import userStore from "../../../../store";
import SolidButton from "../../../shared/buttons/SolidButton";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onDownloadTemplate?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onDownloadTemplate,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supervisorRole = import.meta.env.VITE_SUPERVISOR_ROLE;
  const formData = new FormData();
  const { person } = userStore();

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv", // .csv
  ];

  const axios = useAxiosPrivate();
  const handleBulkSubmit = async () => {
    // Create a fresh FormData instance when submitting
    const submitFormData = new FormData();

    // Ensure all required fields are set
    if (selectedFile) {
      submitFormData.append("csv_file", selectedFile);
      submitFormData.append("create_type", "bulk");
      submitFormData.append("role", supervisorRole);
      submitFormData.append("department", person.department.name);
      submitFormData.append("school", person.department.school);
      submitFormData.append("college", person.department.college);
    }

    await axios.post("accounts/", submitFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  const { mutate, isPending: loading } = useMutation({
    mutationFn: handleBulkSubmit,
    onError: (error) => {
      console.log(error);
      setError("File upload failed");
      toast.error("Failed to create users");
    },
    onSuccess: () => {
      toast.success("Users created successfully");
      setSelectedFile(null);
    },
  });
  const validateFile = (file: File): boolean => {
    const isValidType =
      allowedTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".csv") ||
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls");

    if (!isValidType) {
      setError("Please upload only .xlsx or .csv files");
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      formData.set("csv_file", file);
      onFileSelect?.(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("uploaded file:", files);
    if (files && files.length > 0) {
      console.log("file selected:", files[0]);
      handleFileSelect(files[0]);
      formData.set("csv_file", files[0]);
      formData.set("create_type", "bulk");
      formData.set("role", supervisorRole);
      formData.set("department", person.department.name);
      formData.set("school", person.department.school);
      formData.set("college", person.department.college);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    const fileUrl = "/supervisor.csv"; // Path to the file in the public directory
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = "supervisor.csv"; // The name of the file to be downloaded
    a.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${error ? "border-red-300 bg-red-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center">
              <Upload className="w-16 h-16 text-blue-900" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-900">
              Upload your file
            </h3>
            <p className="text-gray-400">
              Support for .xlsx and .csv file formats
            </p>
          </div>

          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {selectedFile && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div className="relative flex-1 text-left">
                  <p className="font-medium text-green-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-600">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <button
                    className="absolute top-0 right-0 bg-white text-gray-500 hover:text-red-500 p-1 rounded-full shadow-sm border border-gray-200 transition-colors duration-150 flex items-center justify-center hover:cursor-pointer"
                    onClick={() => setSelectedFile(null)}
                    aria-label="Remove file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SolidButton
              title="Select File"
              onClick={handleSelectClick}
              className="w-f"
            />

            <button
              onClick={handleDownloadTemplate}
              className="border border-gray-300 text-gray-700 px-6 py-1 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>
          <button
            onClick={() => mutate()}
            className="border border-gray-300 text-white ug-blue-background px-4 py-2 rounded-lg ml-auto mr-auto font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center space-x-2
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:cursor-pointer"
            disabled={!selectedFile || loading}
          >
            <span>{loading ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
