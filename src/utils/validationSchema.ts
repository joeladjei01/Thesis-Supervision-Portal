import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const chapterAssignmentSchema = Yup.object().shape({
  // programmeLevel: Yup.string().required().label('Programme Level'),
  student: Yup.array().required().label("Student"),
  chapter_title: Yup.string().required().label("Chapter"),
  // section: Yup.string().required().label('Section'),
  due_date: Yup.date().required().label("Date"),
  description: Yup.string().required().label("Description"),
});

export const scheduleMeetingSchema = Yup.object().shape({
  studentId: Yup.string().required().label("Student ID"),
  meetingType: Yup.string().required().label("Meeting Type"),
  date: Yup.date().required().label("Date"),
  time: Yup.string().required().label("Time"),
  agenda: Yup.string().required().label("Meeting Agenda"),
});

export const teamSessionSchema = Yup.object().shape({
  students: Yup.string().required().label("Students"),
  title: Yup.string().required().label("Session Title"),
  link: Yup.string().required().label("Link"),
  description: Yup.string().label("Description"),
});

export { loginSchema };
