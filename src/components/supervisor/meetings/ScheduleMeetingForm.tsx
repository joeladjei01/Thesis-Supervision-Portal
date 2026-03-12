import React, { useEffect, useMemo } from "react";
import { useFormik } from "formik"; // Only need useFormik now
import * as Yup from "yup";
import CustomSelect from "../../shared/custom-select";
import {
  handleMultiSelectionOnChange,
  handleSelectionOnChange,
} from "../../../utils/helpers";
import AppInput from "../../shared/input/AppInput";
import SolidButton from "../../shared/buttons/SolidButton";
import Header from "../../shared/text/Header";
import MultiSelect from "../../../components/shared/custom-select/MultiSelect";
import { useSupervisorDataStore } from "../../../store/useSupervisorDataStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { FaLaptop, FaUsers } from "react-icons/fa";
import type { MeetingSchedule } from "../../../utils/types";
import OutlineButton from "../../../components/shared/buttons/OutlineButton";

// --- Typescript Interfaces and Mock Data ---

type MeetingType = "Virtual" | "In-Person";

interface FormData {
  studentId: string[];
  meetingType: MeetingType;
  selectedDate: string; // YYYY-MM-DD format
  selectedTime: string; // HH:MM AM/PM format
  description: string;
  scheduleType: "now" | "schedule";
  title: string;
  link: string;
  status?: "pending" | "completed" | "rejected" | "ongoing";
  location: string;
}

interface Student {
  id: string;
  name: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Smith" },
  { id: "3", name: "Charlie Brown" },
  { id: "4", name: "Diana Prince" },
];

const MOCK_TIMES: string[] = [
  "",
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "04:00 PM",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Simplified hardcoded calendar data for May 2024 to match the image visually.
// Dates are padded to fill the weeks correctly (May 1st is a Wednesday).
type Mdate = {
  day: number;
  month: "current" | "prev" | "next";
};

const MAY_DATES: Mdate[] = [
  { day: 28, month: "prev" },
  { day: 29, month: "prev" },
  { day: 30, month: "prev" },
  { day: 1, month: "current" },
  { day: 2, month: "current" },
  { day: 3, month: "current" },
  { day: 4, month: "current" },
  { day: 5, month: "current" },
  { day: 6, month: "current" },
  { day: 7, month: "current" },
  { day: 8, month: "current" },
  { day: 9, month: "current" },
  { day: 10, month: "current" },
  { day: 11, month: "current" },
  { day: 12, month: "current" },
  { day: 13, month: "current" },
  { day: 14, month: "current" },
  { day: 15, month: "current" },
  { day: 16, month: "current" },
  { day: 17, month: "current" },
  { day: 18, month: "current" },
  { day: 19, month: "current" },
  { day: 20, month: "current" },
  { day: 21, month: "current" },
  { day: 22, month: "current" },
  { day: 23, month: "current" },
  { day: 24, month: "current" },
  { day: 25, month: "current" },
  { day: 26, month: "current" },
  { day: 27, month: "current" },
  { day: 28, month: "current" },
  { day: 29, month: "current" },
  { day: 30, month: "current" },
  { day: 31, month: "current" },
  { day: 1, month: "next" },
];

// --- Validation Schema (Yup) ---

const validationSchema = Yup.object().shape({
  studentId: Yup.array()
    .min(1, "At least one student must be selected.")
    .required("Student selection is required."),
  meetingType: Yup.string()
    .oneOf(["Virtual", "In-Person"], "Meeting type is required.")
    .required("Meeting type is required."),
  selectedDate: Yup.string(),
  selectedTime: Yup.string(),
  title: Yup.string().required("Meeting agenda is required."),
  description: Yup.string(),
  link: Yup.string(),
  status: Yup.string(),
});

// --- Custom Components ---

/** Renders the Virtual/In-Person toggle button group. */
const MeetingTypeToggle: React.FC<{
  value: MeetingType;
  onChange: (type: MeetingType) => void;
}> = ({ value, onChange }) => {
  const isVirtual = value === "Virtual";

  const buttonClass = (isActive: boolean) =>
    `px-8 py-2.5 w-1/2 text-sm cursor-pointer font-semibold transition-all duration-300 ease-in-out 
     ${
       isActive ? "bg-blue-900 text-blue-50 " : "bg-transparent text-blue-900"
     }`;

  return (
    <div className="flex w-full overflow-auto border-b border-gray-300 px-7 mt-3 rounded-sm">
      <button
        type="button"
        className={` ${buttonClass(isVirtual)}`}
        onClick={() => onChange("Virtual")}
        aria-pressed={isVirtual}
      >
        <FaLaptop className="inline mr-2" />
        Virtual
      </button>
      <button
        type="button"
        className={` ${buttonClass(!isVirtual)}`}
        onClick={() => onChange("In-Person")}
        aria-pressed={!isVirtual}
      >
        <FaUsers className="inline mr-2" />
        In-Person
      </button>
    </div>
  );
};

const DatePicker: React.FC<{
  selectedDate: string;
  onSelect: (date: string) => void;
}> = ({ selectedDate, onSelect }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Helper to get the first day of the month
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Helper to get the number of days in a month
  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Generate the calendar grid
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty slots for the previous month's days
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, month: "prev" });
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: "current" });
    }

    // Add extra slots for the next month's days to complete the grid
    while (days.length % 7 !== 0) {
      days.push({ day: null, month: "next" });
    }

    return days;
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Format the selected date
  const formatDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const dayString = day.toString().padStart(2, "0");
    return `${year}-${month}-${dayString}`;
  };

  const isSelected = (day: number) => {
    return selectedDate === formatDate(day);
  };

  const calendarDays = generateCalendar();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between text-gray-900 mb-4">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <span className="text-lg font-bold">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </span>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 text-sm">
        {calendarDays.map((date, index) => (
          <div key={index} className="py-2 flex justify-center">
            {date.day ? (
              <button
                type="button"
                onClick={() => onSelect(formatDate(date.day))}
                disabled={date.month !== "current"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                  ${
                    date.month === "current"
                      ? "font-semibold text-gray-900 hover:bg-blue-100"
                      : "text-gray-400 cursor-not-allowed opacity-50"
                  }
                  ${
                    isSelected(date.day)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : ""
                  }`}
              >
                {date.day}
              </button>
            ) : (
              <div className="w-8 h-8"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Component ---
interface ScheduleMeetingFormProps {
  editMeetingData?: MeetingSchedule;
  onClose: () => void; // Optional prop to handle closing the form/modal after scheduling/updating
  setEditMeetingData?: (meeting: MeetingSchedule | null) => void; // Optional prop for editing existing meetings
}

const ScheduleMeetingForm: React.FC<ScheduleMeetingFormProps> = ({
  editMeetingData,
  setEditMeetingData,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const assignedStudents = useSupervisorDataStore(
    (state) => state.assignedStudents,
  );
  const axios = useAxiosPrivate();

  const buttonClass = (isActive: boolean) =>
    `px-8 py-3 w-1/2 text-sm cursor-pointer font-semibold text-blue-900 rounded-sm transition-all duration-300 ease-in-out 
     ${isActive ? "bg-white " : "bg-transparent "}`;

  useEffect(() => {
    if (editMeetingData) {
      formik.setFieldValue(
        "studentId",
        editMeetingData.invitees.map((invitee) => invitee.id),
      );
      formik.setFieldValue("meetingType", editMeetingData.meeting_type);
      const startDate = new Date(editMeetingData.start_time);
      const year = startDate.getUTCFullYear();
      const month = (startDate.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = startDate.getUTCDate().toString().padStart(2, "0");
      const hours = startDate.getUTCHours().toString().padStart(2, "0");
      const minutes = startDate.getUTCMinutes().toString().padStart(2, "0");
      formik.setFieldValue("selectedDate", `${year}-${month}-${day}`);
      formik.setFieldValue("selectedTime", `${hours}:${minutes}`);
      formik.setFieldValue("description", editMeetingData.description || "");
      formik.setFieldValue("title", editMeetingData.session_title);
      formik.setFieldValue("link", editMeetingData.zoom_link || "");
      formik.setFieldValue("location", editMeetingData.location || "");
      formik.setFieldValue("status", editMeetingData.status);
    }
  }, [editMeetingData]);

  const { mutateAsync: updateMeeting } = useMutation({
    mutationFn: async (meetingData: any) => {
      try {
        const response = await axios.put(
          `/supervisors/meetings/${meetingData.id}/`,
          meetingData,
        );
        toast.success("Meeting updated successfully!");
        return response.data;
      } catch (error) {
        console.error("Error updating meeting:", error);
        toast.error("Failed to update meeting. Please try again.");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supervisor-meeting-schedules"],
      });
    },
  });

  const { mutateAsync: handleScheduleMeeting } = useMutation({
    mutationFn: async (values: FormData) => {
      try {
        const response = await axios.post("/supervisors/meetings/", {
          invitees_ids: values.studentId,
          session_title: values.title,
          description: values.description,
          agenda: values.title,
          meeting_type: values.meetingType,
          start_time:
            formik.values.scheduleType === "schedule"
              ? `${values.selectedDate}T${values.selectedTime}.000Z`
              : null,
          zoom_link: values.link,
          location: values.location,
        });
        toast.success("Meeting scheduled successfully!");
        return response.data;
      } catch (error) {
        console.error("Error scheduling meeting:", error);
        toast.error("Failed to schedule meeting. Please try again.");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supervisor-meeting-schedules"],
      });
    },
  });

  const initialValues: FormData = {
    studentId: [],
    meetingType: "Virtual", // Default to Virtual as it's selected in the image
    selectedDate: "",
    selectedTime: "",
    description: "",
    title: "",
    scheduleType: "schedule",
    link: "",
    status: "pending",
    location: "",
  };

  const formik = useFormik<FormData>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (values.selectedDate === "" && values.scheduleType === "schedule") {
        formik.setFieldError(
          "selectedDate",
          "Please select a date for scheduling.",
        );
        setSubmitting(false);
        return;
      }
      if (editMeetingData) {
        try {
          const payload = {
            id: editMeetingData.id,
            invitees_ids: values.studentId,
            session_title: values.title,
            description: values.description,
            agenda: values.title,
            meeting_type: values.meetingType,
            start_time: `${values.selectedDate}T${values.selectedTime}.000Z`,
            zoom_link: values.link,
            location: values.location,
            status: values.status,
          };
          await updateMeeting(payload);
          setEditMeetingData && setEditMeetingData(null);
          resetForm();
          onClose();
          return;
        } catch (error) {
          toast.error("Failed to update meeting. Please try again.");
          console.error("Error updating meeting:", error);
          throw error;
        }
      }
      try {
        await handleScheduleMeeting(values);
        onClose();
      } catch (error) {
        throw error;
      } finally {
        setSubmitting(false);
        resetForm();
      }
    },
  });

  // Helper function for rendering manual error messages
  const renderError = (name: keyof FormData) => {
    return formik.touched[name] && formik.errors[name] ? (
      <div className="mt-1 text-sm text-red-500">{formik.errors[name]}</div>
    ) : null;
  };

  // Helper function for dynamic input styling
  const getInputClasses = (name: keyof FormData) => {
    return `block w-full rounded-xl border px-4 py-3 appearance-none cursor-pointer 
      ${
        formik.touched[name] && formik.errors[name]
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      }`;
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full border border-gray-300 p-4 rounded-md space-y-6"
      >
        <div>
          <label
            htmlFor="studentId"
            className={"text-blue-900 mb-1.5 text-sm font-medium leading-6"}
          >
            Student
          </label>
          <div>
            <input
              type="radio"
              name="meetingWithAll"
              value="all"
              onChange={() =>
                formik.setFieldValue(
                  "studentId",
                  assignedStudents.map((s) => s.student.id),
                )
              }
              checked={
                formik.values.studentId.length === assignedStudents.length
              }
              className="mr-1"
            />{" "}
            <label
              className="text-sm text-gray-600 hover:cursor-pointer"
              onClick={() =>
                formik.setFieldValue(
                  "studentId",
                  assignedStudents.map((s) => s.student.id),
                )
              }
            >
              Meeting with all students
            </label>
          </div>
          <div className="relative">
            <MultiSelect
              options={assignedStudents.map((s) => ({
                value: s.student.id,
                label: `${s.student.name} - ${s.student.student_id}`,
              }))}
              onChange={(options) =>
                handleMultiSelectionOnChange(options, "studentId", formik)
              }
              value={formik.values.studentId}
              isClearable
              placeholder="Select Students"
            />
          </div>
          {renderError("studentId")}
        </div>

        {/* 2. Meeting Type Toggle (Custom component using formik.setFieldValue) */}
        <div className="pt-4">
          <label
            htmlFor="meetingType"
            className={"text-blue-900 text-sm font-medium leading-6"}
          >
            Meeting Type
          </label>
          <MeetingTypeToggle
            value={formik.values.meetingType}
            onChange={(type) => {
              formik.setFieldValue("meetingType", type);
              // Manually set touched to trigger validation on interaction
              formik.setFieldTouched("meetingType", true, false);
            }}
          />
          {renderError("meetingType")}
        </div>

        {/* 4. Time Select (Standard HTML Select) */}
        {formik.values.meetingType === "Virtual" && (
          <div className="flex w-full overflow-auto bg-blue-100 p-[3px] rounded-sm">
            <button
              type="button"
              className={` ${buttonClass(
                formik.values.scheduleType === "schedule",
              )}`}
              onClick={() => formik.setFieldValue("scheduleType", "schedule")}
            >
              Schedule
            </button>
            <button
              type="button"
              className={` ${buttonClass(
                formik.values.scheduleType === "now",
              )}`}
              onClick={() => formik.setFieldValue("scheduleType", "now")}
            >
              Now
            </button>
          </div>
        )}

        {/* 3. Date Picker (Custom component using formik.setFieldValue) */}
        {formik.values.scheduleType === "schedule" && (
          <>
            <DatePicker
              selectedDate={formik.values.selectedDate}
              onSelect={(date) => {
                formik.setFieldValue("selectedDate", date);
                // Manually set touched to trigger validation on interaction
                formik.setFieldTouched("selectedDate", true, false);
              }}
            />
            {/* Render error manually. Note: The text-center class is kept for visual placement. */}
            {formik.touched.selectedDate && formik.errors.selectedDate && (
              <div className="text-sm text-red-500 text-center">
                {formik.errors.selectedDate}
              </div>
            )}

            <div>
              <AppInput
                type="time"
                label="Time"
                name="selectedTime"
                formik={formik}
                placeholder="Select time"
              />
              {renderError("selectedTime")}
            </div>
          </>
        )}

        {editMeetingData && (
          <CustomSelect
            label="Status"
            onChange={(option) => formik.setFieldValue("status", option?.value)}
            value={formik.values.status}
            options={[
              { value: "pending", label: "Pending" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
              { value: "canceled", label: "Canceled" },
            ]}
            placeholder="Select Status"
          />
        )}

        <AppInput
          label={"Session Title"}
          name={"title"}
          formik={formik}
          type={"text"}
          placeholder={"e.g., Progress Review Meeting"}
        />

        {formik.values.meetingType === "Virtual" && (
          <div>
            <AppInput
              label={"Teams/Zoom Link"}
              name={"link"}
              formik={formik}
              type={"url"}
              placeholder={"Teams/Zoom Link"}
            />

            <AppInput
              label={" Description (Optional)"}
              name={"description"}
              formik={formik}
              type={"text"}
              as={"textarea"}
              placeholder={"Meeting agenda or additional notes..."}
            />
          </div>
        )}

        {formik.values.meetingType === "In-Person" && (
          <div>
            <AppInput
              label={"Location"}
              name={"location"}
              formik={formik}
              type={"text"}
              placeholder={"Meeting location"}
            />
          </div>
        )}

        {/* 6. Submit Button */}
        <div className="flex gap-2">
          {editMeetingData && (
            <OutlineButton
              title="Cancel"
              type="button"
              onClick={() => {
                formik.resetForm();
                setEditMeetingData && setEditMeetingData(null);
              }}
              className="py-2 w-full"
            />
          )}
          <SolidButton
            title={
              formik.isSubmitting
                ? "Scheduling..."
                : editMeetingData
                  ? "Update Meeting"
                  : "Schedule Meeting"
            }
            type="submit"
            disabled={formik.isSubmitting}
            className="py-2 w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default ScheduleMeetingForm;
