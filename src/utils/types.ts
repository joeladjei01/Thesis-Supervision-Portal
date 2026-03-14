/* eslint-disable @typescript-eslint/no-explicit-any */
export type Options = {
  value: string;
  label: string;
};

export interface IuserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  school: string;
  college: string;
  department_id?: any;
  has_changed_password: boolean;
}
export interface UserStateType {
  isLogin: boolean;
  accessToken: string;
  refreshToken: string;
  userInfo: IuserInfo;
  person?: any;
}
export interface programme_level {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export interface Student {
  id: string;
  name: string;
  student_id: string;
  thesis_topic: string;
  programme?: string;
  programme_category?: string;
  user: IuserInfo;
  supervisors: Supervisor[];
  level_title: string;
  programme_level: programme_level;
}


export interface Supervisor {
  id: string;
  name: string;
  email: string;
  research_area: any[];
  staff_id: string;
  current_load: number;
  user: IuserInfo;
  max: number;
  students?: any[];
  status: "Available" | "Not Available";
}

export interface StateActions {
  updateIsLogin: (by: boolean) => void;
  updateAccessToken: (by: string) => void;
  updateRefreshToken: (by: string) => void;
  updateUserInfo: (by: IuserInfo) => void;
  updatePerson: (student: any) => void;
  reset: () => void;
}

export interface AdminStatProps {
  headTitle: string;
  metric: string;
  footer: string;
}

export interface IStudentType {
  studentId: string;
  studentName: string;
  gender: string;
  email: string;
  programmeLevel: string;
  programmeName: string;
  thesisTopic: string;
  contact: string;
  role: string;
}
export interface ProposalReviewModalRef {
  submit: () => void;
}
export interface StatusBadgeProps {
  status: ProposalStatus;
}

export interface TopicProposal {
  id: string;
  title: string;
  student: Student;
  submittedDate: string;
  status: ProposalStatus;
  description: string;
  methodology: string;
  supervisor_feedback?: string;
  supervisor: Supervisor;
  updated_at: string;
}

export interface Option {
  value: string;
  label: string;
}

export type ProposalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needRevision"
  | string;

export type GenderType = "male" | "female";

export type LevelType = "600" | "700" | "800";

export type SupervisorStatus = "Available" | "Not Available";

export interface StudentData {
  id: string;
  name: string;
  student_id: string;
  department: string;
  school: string;
  college: string;
  thesis_topic: string;
  gender: GenderType;
  programme: string;
  level_title: string;
  level: LevelType;
  created_at: string;
  updated_at: string;
  programme_category: string;
  user: string;
}

export interface SupervisorData {
  id: string;
  name: string;
  staff_id: string;
  school: string;
  college: string;
  department: string;
  current_load: number;
  status: SupervisorStatus;
  created_at: string;
  updated_at: string;
  user: string;
  research_area: string[];
}

export interface AssignmentData {
  id: string;
  student: StudentData;
  supervisor: SupervisorData;
  status: string;
  proposed_topic: string;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentResponse {
  message: string;
  data: AssignmentData[];
}

export interface ChapterAssignment {
  id: string;
  chapter: {
    id: string;
    custom_title: string;
    description: string;
  };
  topic: {
    id: string;
    title: string;
  };
  student: {
    id: string;
    name: string;
    student_id: string;
  };
}

export interface ChapterSubmission {
  id: string;
  chapter_assignment: ChapterAssignment;
  content: string;
  approved: boolean;
  feedback: string;
  files: string[];
  status: "pending" | "reviewed" | "draft" | "approved" | "submitted";
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChapterSubmissionFeedback {
  id: string;
  chapter_assignment: ChapterAssignment;
  status: "submitted" | "needs_revision" | "approved" | "rejected";
  decision: "revise" | "approved" | "reject";
  score: number;
  feedback_text: string;
  file_attachment: string;
  created_at: string;
  updated_at: string;
  chapter?: any;
}

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
}

export interface MeetingSchedule {
  id: string;
  organisor: MeetingParticipant;
  invitees: MeetingParticipant[];
  session_title: string;
  zoom_link?: string;
  description?: string;
  agenda?: string;
  meeting_type: string;
  status: string;
  location?: string;
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  created_at: string;
  updated_at: string;
}
