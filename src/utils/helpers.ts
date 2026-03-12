import { type Option } from "./types";
import { type SingleValue, type MultiValue } from "react-select";

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
  });
};

export const formatTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const CompareTime = (isoDate: string): number => {
  const date = new Date(isoDate);
  const date1 = new Date(
    `1970-01-01T${date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ":" + date.getSeconds().toString().padStart(2, "0")}`,
  );

  const now = new Date();
  const date2 = new Date(
    `1970-01-01T${now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0") + ":" + now.getSeconds().toString().padStart(2, "0")}`,
  );

  console.log("time 1,", date1);
  console.log("ime 1", date2);
  const result = date1.getTime() - date2.getTime();
  if (result > 0) {
    console.log("due");
    return 1; // date1 is later than date2
  }
  return -1; // date1 is earlier than date2
};

const handleSelectionOnChange = (
  option: SingleValue<Option>,
  field: string,
  formik: any,
) => {
  return formik.setFieldValue(field, option ? option : "");
};

const handleMultiSelectionOnChange = (
  options: MultiValue<Option>,
  field: string,
  formik: any,
) => {
  const values = options ? options.map((option) => option.value) : [];
  return formik.setFieldValue(field, values);
};

function getStudentsBySupervisor(response: any, supervisorId: string) {
  console.log(supervisorId);

  const students = [];

  response.forEach((student) => {
    student.supervisors.forEach((supervisor) => {
      if (supervisor.id === supervisorId) {
        supervisor.students.forEach((s) => {
          students.push(s);
        });
      }
    });
  });
  console.log(students);

  return students;
}

export const removeDash = (str: string) => {
  return str.replace(/-/g, " ");
};

export const addDash = (str: string) => {
  const StringArr = str.split(" ");
  return StringArr.join("-");
};

export const chapters = [
  { value: "chapter-1", label: "Chapter 1: Introduction" },
  { value: "chapter-2", label: "Chapter 2: Literature Review" },
  { value: "chapter-3", label: "Chapter 3: Methodology" },
  { value: "chapter-4", label: "Chapter 4: Results" },
  { value: "chapter-5", label: "Chapter 5: Discussion" },
  { value: "chapter-6", label: "Chapter 6: Conclusion and Recommendations" },
];

export const sections = [
  { value: "A", label: "Background" },
  { value: "B", label: "Problem Statement" },
  { value: "C", label: "Objectives" },
  { value: "D", label: "Scope" },
  { value: "E", label: "Significance" },
  { value: "F", label: "Structure of the Thesis" },
];

function getChaperById(value: string) {
  return chapters.find((chapter) => chapter.value === value);
}

function getSectionById(value: string) {
  return sections.find((section) => section.value === value);
}

export {
  getChaperById,
  getSectionById,
  getStudentsBySupervisor,
  formatDate,
  handleSelectionOnChange,
  handleMultiSelectionOnChange,
};

export const shortenText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

export const getFileNameFromURL = (url: string): string => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDaysLeft = (dueDate: string): any => {
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = due.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return daysLeft;
};

export const inputStyles =
  "py-2 px-3 border border-gray-300 rounded-md dark:bg-transparent dark:text-white focus:outline-1.5 focus:-outline-offset- focus:outline-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-5"

export const isInstitute = (name: string): boolean => {
  return (
    name.toLowerCase().includes("institute") ||
    name.toLowerCase().includes("institute")
  );
};

export const accountType = (school: string): string => {
  if (school === "institute") {
    return "Institute";
  }
  return "Department";
};

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export const orderChapters = (chaptersByLevel): any[] => {
  return chaptersByLevel?.sort((a, b) => a.name.localeCompare(b.name));
};
