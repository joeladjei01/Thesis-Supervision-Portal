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
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border transition-all">
        <FileText size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          No proposals found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          There are no proposals matching the current filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {active === "pendingReview" && <div className="mt-2 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Pending Topic Proposals
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
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
