import StudentInfo from "./StudentInfo";
import ProposalContent from "./ProposalContent";
import { useRef, useState } from "react";
import Modal from "../../../layouts/Modal";
import ProposalReviewForm from "./ProposalReviewModal";
import type {
  ProposalReviewModalRef,
  ProposalStatus,
  TopicProposal,
} from "../../../utils/types";
import toast from "react-hot-toast";
import SolidButton from "../../../components/shared/buttons/SolidButton";

interface StatusBadgeProps {
  status: ProposalStatus | string;
}

interface ProposalCardProps {
  proposal: TopicProposal;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: ProposalStatus) => {
    const configs = {
      pending: {
        label: "Pending",
        className: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30",
      },
      approved: {
        label: "Approved",
        className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
      },
      rejected: {
        label: "Rejected",
        className: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/30",
      },
      revise: {
        label: "Needs Revision",
        className: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30",
      },
    };
    return configs[status] || configs.pending;
  };

  const config = getStatusConfig(status as ProposalStatus);

  return (
    <span
      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${config.className} shadow-sm`}
    >
      {config.label}
    </span>
  );
};

const ProposalCard = ({ proposal, active, onActive }) => {
  const [openModal, setOpenModal] = useState(false);
  const reviewRef = useRef<ProposalReviewModalRef>(null);

  const onReview = () => {
    setOpenModal(true);
  };

  const handleSubmit = () => {
    if (reviewRef.current) {
      setOpenModal(false);
      reviewRef.current.submit();
      toast.success("Review sent");
    }
  };

  const onReviewClick = () => {
    if (proposal.status !== "pending") {
      proposal.status = "pending";
      toast.success("Proposal status changed to pending");
      onActive("pendingReview");
    } else if (proposal.status === "pending" && active == "allProposals") {
      onActive("pendingReview");
    } else {
      onReview();
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-8">
          <StatusBadge status={proposal.status} />
          {proposal.status == "pending" && (
            <SolidButton
              title={"Start Review"}
              onClick={onReviewClick}
              className="py-2 px-6 text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/10"
              type="button"
            />
          )}
        </div>

        <div className="space-y-6">
          <StudentInfo
            student={proposal.student}
            submittedDate={proposal.created_at}
          />

          <ProposalContent
            title={proposal.title}
            description={proposal.description}
            methodology={proposal.methodology}
          />
        </div>
      </div>

      {openModal && (
        <Modal
          headTitle="Review and Provide Feedback for student"
          subHeadTitle={`${proposal.student.name} || ${proposal.student.email} ${proposal.student.level_title}`}
          handleConfirm={handleSubmit}
          handleCancel={() => setOpenModal(false)}
          buttonDisabled={false}
          w="max-w-[1000px]"
        >
          <ProposalReviewForm
            proposal={proposal}
            closeModal={setOpenModal}
            handleCancel={() => setOpenModal(false)}
          />
        </Modal>
      )}
    </>
  );
};
export default ProposalCard;
