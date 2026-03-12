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
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6 mt-6">
      <h1 className="text-lg font-cal-sans tracking-wide text-gray-500 mb-4">
        Topics Proposals
      </h1>

      <div className="overflow-x-auto rounded-2xl border-gray-200 border">
        <table className="min-w-full bg-white ">
          <thead>
            <tr className="border-b border-gray-200 bg-blue-50">
              <th className="px-4 py-4 text-left text-sm font-medium text-gray-600 ">
                Title
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600 ">
                Status
              </th>
              <th className="px-4 py-2 pr-7 text-right text-sm font-medium text-gray-600 ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-50">
                <td className="px-4 py-5 text-sm text-gray-800">
                  {shortenText(topic.title, 50)}
                </td>
                <td
                  className={`px-4 py-2 text-sm text-center font-medium ${
                    topic.status === "approved"
                      ? "text-green-700"
                      : topic.status === "pending"
                        ? "text-yellow-700"
                        : "text-red-700"
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
                      onUpadteClick(topic);
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
