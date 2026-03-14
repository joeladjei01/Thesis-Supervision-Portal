import React, { useEffect, useState } from "react";
import ProposalList from "../../components/supervisor/proposal/ProposalList";
import { useQueryClient } from "@tanstack/react-query";
import Header from "../../components/shared/text/Header";
import usePageTile from "../../hooks/usePageTitle";
import Loading from "../../components/shared/loader/Loading";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";

type ProposalStatus = "pending" | "approved" | "rejected" | "needRevision";

interface Student {
  id: string;
  name: string;
  degree: "PhD" | "MSc" | "BSc";
  email: string
}

interface TopicProposal {
  id: string;
  title: string;
  student: Student;
  submittedDate: string;
  status: ProposalStatus;
  description: string;
  methodology: string;
}

interface TabData {
  key: string;
  label: string;
  count: number;
  status?: ProposalStatus;
}

interface FilterTabProps {
  tabs: TabData[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

const FilterTabs: React.FC<FilterTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => (
  <div className={"overflow-auto flex w-full justify-between bg-blue-50 dark:bg-secondary/5 p-[3px] rounded-lg border border-blue-100 dark:border-border"}>
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
          activeTab === tab.key
            ? "bg-white dark:bg-primary text-blue-900 dark:text-white shadow-sm"
            : "text-blue-900/60 dark:text-gray-400 hover:text-blue-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
        } cursor-pointer font-bold`}
      >
        {tab.label} ({tab.count})
      </button>
    ))}
  </div>
);


// Main Component
const TopicProposalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("allProposals");
  const queryClient = useQueryClient();
  usePageTile("ThesisFlow - Topic Submissions");
  const topicProposals = useSupervisorDataStore((state) => state.topicProposals);




  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["fetchProposals"] });
  }, [])

  const tabs = [
    {
      key: "allProposals",
      label: "All proposals",
      count: topicProposals?.length || 0,
    },
    {
      key: "pendingReview",
      label: "Pending Review",
      count: topicProposals?.filter((p) => p.status === "pending").length || 0,
    },
  ];

  const getFilteredProposals = (): TopicProposal[] => {
    switch (activeTab) {
      case "pendingReview":
        return topicProposals?.filter((p) => p.status === "pending") || [];
      case "approved":
        return topicProposals?.filter((p) => p.status === "approved") || [];
      case "allProposals":
      default:
        return topicProposals || [];
    }
  };

  // const handleReview = (proposalId: string) => {
  //   console.log("Review proposal:", proposalId);
  //   // In a real app, this would navigate to a detailed review page or open a modal
  // };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const filteredProposals = getFilteredProposals();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Header title="Topic Proposals" subtitle="Review and approve student thesis topic proposals" />

        {
          topicProposals.length == 0 && !topicProposals  &&
          <Loading
           message="Loading topic proposals..."
          />
        }

        {
          topicProposals?.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-card rounded-2xl border-2 border-dashed border-gray-200 dark:border-border transition-all duration-300">
            <div className="bg-gray-50 dark:bg-secondary/10 p-6 rounded-full mb-6 group">
              <svg
                className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform duration-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 11h8M8 15h4"
                />
              </svg>
            </div>
            <p className="text-gray-900 dark:text-white text-xl font-bold mb-2">No proposals found</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs text-center">
              There are currently no topic proposals submitted for your review.
            </p>
          </div>
          )
      }


        {topicProposals?.length > 0 && <div>
          <div className="max-w-md mx-auto mb-4">
          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          </div>

          <ProposalList proposals={filteredProposals} active={activeTab} onActive={setActiveTab} />
        </div>}
        </div>
    </div>
  );
};

export default TopicProposalsPage;
