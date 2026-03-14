import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import Header from "../../components/shared/text/Header";
import StudentSubmissionsTable from "../../components/supervisor/SubmissionsTable";
import OutlineButton from "../../components/shared/buttons/OutlineButton";
import toast from "react-hot-toast";
import usePageTile from "../../hooks/usePageTitle";
import Loading from "../../components/shared/loader/Loading";

const StudentSubmissionsDetail: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { person } = userStore();
  const [searchQuery, setSearchQuery] = useState("");

  usePageTile("ThesisFlow - Student Submissions Detail");

  // Fetch student details
  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/retrieve/${studentId}/`,
        );
        return data.data;
      } catch (error) {
        toast.error("Failed to load student details");
        console.log(error);
        return null;
      }
    },
    enabled: !!studentId,
  });

  //fetch Assignments for this student
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["assignments", studentId],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/assignment/student/${studentId}/`,
        );
        return data.data;
      } catch (error) {
        console.log(error);
        toast.error("Error fetching student assignments");
        return [];
      }
    },
    enabled: !!studentId,
  });

  // Fetch submissions for this specific student
  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["studentSubmissions", studentId],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/student/${studentId}/`,
        );

        return data.data;
      } catch (error) {
        toast.error("Failed to load submissions");
        console.log(error);
        return [];
      }
    },
    enabled: !!studentId,
    refetchOnWindowFocus: false,
  });

  // Fetch feedbacks
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: ["feedbacks", studentId],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/student/${studentId}/feedbacks/`,
        );
        return data.data;
      } catch (error) {
        toast.error("Failed to load feedbacks");
        console.log(error);
        return [];
      }
    },
    enabled: !!studentId,
  });

  // Memoize filtered submissions for performance
  const filteredSubmissions = useMemo(() => {
    if (!submissions || submissions.length === 0) return [];
    if (!searchQuery) return submissions;

    const query = searchQuery.toLowerCase();
    return submissions.filter(
      (submission: any) =>
        submission.chapter_assignment.topic.title
          .toLowerCase()
          .includes(query) ||
        submission.chapter_assignment.chapter.custom_title
          .toLowerCase()
          .includes(query),
    );
  }, [submissions, searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const loading =
    studentLoading ||
    submissionsLoading ||
    assignmentsLoading ||
    feedbacksLoading;

  return (
    <div className="container mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-muted-foreground hover:text-foreground mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to All Submissions
      </button>

      {/* Header with Student Info */}
      {student && (
        <div className="mb-8">
          <Header
            title={`${student.name}'s Submissions`}
            subtitle={`Student ID: ${student.student_id} | Programme: ${student.programme || "N/A"}`}
          />
        </div>
      )}

      {/* Stats Cards */}
      {submissions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm">Total Submissions</p>
            <p className="text-2xl font-bold text-foreground">
              {assignments
                ? `${submissions.length} / ${assignments.length}`
                : "-/-"}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm">Pending Review</p>
            <p className="text-2xl font-bold text-foreground">
              {submissions.filter((s: any) => !s.approved).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-sm">Approved</p>
            <p className="text-2xl font-bold text-primary">
              {submissions.filter((s: any) => s.approved).length}
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {!loading && submissions && submissions.length > 0 && (
        <div className="mb-6 flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by topic or chapter..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-card pl-10 pr-4 py-2 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
            <Search className="absolute left-3 top-2.5 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Loading State */}
      {/* {loading && (
        <div className="flex justify-center items-center h-64">
          <OutlineButton
            title="Loading..."
            onClick={() => {}}
            className="py-2"
            disabled={true}
            Icon={
              <svg
                className="h-5 w-5 text-gray-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
          />
        </div>
      )} */}

      {/* Empty State */}
      {!loading && submissions && submissions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
          <svg
            className="h-32 w-32 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <p className="text-muted-foreground text-lg">
            No submissions found for this student.
          </p>
        </div>
      )}

      <div>
        {feedbacksLoading && (
          <div className="p-4 w-full">
            <Loading message="Loading Student Submissions..." loaderSize={30} />
          </div>
        )}
      </div>

      {/* Submissions Table */}
      {filteredSubmissions && filteredSubmissions.length > 0 && (
        <StudentSubmissionsTable
          submissions={filteredSubmissions}
          feedbacks={feedbacks}
        />
      )}
    </div>
  );
};

export default StudentSubmissionsDetail;
