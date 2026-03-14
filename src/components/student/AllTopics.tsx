import React from "react";
import SolidButton from "../shared/buttons/SolidButton";
import OutlineButton from "../shared/buttons/OutlineButton";
import { shortenText } from "../../utils/helpers";

interface Topic {
  id: string;
  title: string;
  status: string;
  created_at: string;
  student: {
    name: string;
    email: string;
    level_title: string;
  };
}

interface AllTopicsProps {
  topics: Topic[];
  onViewDetails: (topicId: any) => void;
  onUpadteClick?: (topicId: any) => void;
}

const AllTopics: React.FC<AllTopicsProps> = ({
  onUpadteClick,
  topics,
  onViewDetails,
}) => {
  return (
    <div className="max-w-6xl mx-auto bg-card rounded-2xl shadow-sm border border-border p-6 mt-6">
      <h1 className="text-lg font-bold text-foreground mb-6">
        Topics Proposals
      </h1>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full bg-card">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 pr-7 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors duration-200 last:border-0">
                <td className="px-4 py-5 text-sm text-foreground font-medium">
                  {shortenText(topic.title, 50)}
                </td>
                <td
                  className={`px-4 py-2 text-sm text-center font-bold ${
                    topic.status === "approved"
                      ? "text-green-500"
                      : topic.status === "pending"
                        ? "text-yellow-500"
                        : "text-destructive"
                  }`}
                >
                  {topic.status.charAt(0).toUpperCase() + topic.status.slice(1)}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-end">
                  <SolidButton
                    title={"View Details"}
                    className={"py-1 w-fit"}
                    onClick={() => {
                      onViewDetails(topic);
                    }}
                  />

                  <OutlineButton
                    title={"Update"}
                    className={"py-1 px-2 w-fit ml-2"}
                    onClick={() => {
                      onUpadteClick?.(topic);
                    }}
                    disabled={topic.status === "pending" ? false : true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTopics;
