import { useNavigate } from "react-router";
import SubmitChapter from "../../components/student/SubmitChapter";
import React, { useEffect } from "react";
import useChapterStore from "../../store/useChapterStore";
import { ArrowLeft } from "lucide-react";
import usePageTile from "../../hooks/usePageTitle";
import { useParams } from "react-router";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const StudentSubmitChapter = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navgate = useNavigate();
  const axios = useAxiosPrivate();
  const selectedChapter = useChapterStore((state) => state.selectedChapter);
  const reset = useChapterStore((state) => state.reset);
  usePageTile(
    `Submit Chapter | ${
      selectedChapter ? selectedChapter.chapter.custom_title : ""
    }`
  );

  const fetchChapterbyID = async () => {
    try {
      const { data } = await axios.get(`/students/chapter/${id}/feedbacks/`);
      return data;
    } catch (error) {
      console.error("Error fetching chapter:", error);
      toast.error("Failed to fetch chapter details");
    }
  };

  const { mutateAsync: mutateFeedback } = useMutation({
    mutationFn: fetchChapterbyID,
  });

  const onClose = () => {
    navgate(-1);
    setTimeout(() => {
      reset();
    }, 1000);
  };

  const refreshChapterData = () => {
    queryClient.invalidateQueries({ queryKey: ["student-chapters"] });
    queryClient.invalidateQueries({ queryKey: ["student-feedbacks"] });
    queryClient.invalidateQueries({ queryKey: ["student-topics"] });
    queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
  };

  useEffect(() => {
    if (selectedChapter === null) {
      navgate("/submissions", { replace: true });
    }
  }, [selectedChapter, navgate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Are you sure you want to leave? Any unsaved data will be lost.";

      // Setting the return value is needed to trigger the confirmation dialog
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => onClose()}
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-white cursor-pointer outline-none mb-3"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back</span>
        </button>
      </div>
      <div className="border-b border-gray-300 mb-6 pb-3">
        <h2 className="text-xl s font-bold text-gray-600">
          Submit Assigned Task
        </h2>
        <p className="text-gray-500 mt-1 text-sm font-light">
          Upload your document for supervisor review. Supported file types: PDF,
          DOC, DOCX.
        </p>
      </div>

      <div>
        <SubmitChapter
          selectedChapter={selectedChapter}
          onClose={() => onClose()}
          refresh={refreshChapterData}
        />
      </div>
    </div>
  );
};

export default StudentSubmitChapter;
