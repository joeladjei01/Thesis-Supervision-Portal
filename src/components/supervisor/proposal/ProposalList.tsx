/* eslint-disable @typescript-eslint/no-explicit-any */
// import { TopicProposal } from "@/utils/types";
import ProposalCard from "./ProposalCard";
import { FileText } from "lucide-react";
// // interface ProposalListProps {
// //   proposals: TopicProposal[];
// //   onReview: (proposalId: string) => void;
// }

const ProposalList = ({ proposals , onActive , active }) => {
  if (proposals.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No proposals found
        </h3>
        <p className="text-gray-500">
          There are no proposals matching the current filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {active === "pendingReview" && <div className="mt-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Pending Topic Proposals
        </h2>
        <p className="text-gray-500 text-sm">
          Student proposals awaiting your review
        </p>
      </div>}

      {proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} onActive={onActive} active={active} />
      ))}
    </div>
  );
};
export default ProposalList;
