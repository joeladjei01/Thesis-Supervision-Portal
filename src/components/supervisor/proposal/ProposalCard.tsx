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
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      approved: {
        label: "Approved",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-100 text-red-800 border-red-200",
      },
      revise: {
        label: "Need Revision",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    };
    return configs[status];
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full border ${config.className}`}
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <StatusBadge status={proposal.status} />
          {proposal.status == "pending" && (
            <SolidButton
              title={"Review Proposal"}
              onClick={onReviewClick}
              className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 transition-colors
            hover:cursor-pointer"
              type="button"
            />
          )}
        </div>

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
