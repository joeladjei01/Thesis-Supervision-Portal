import React from "react";

interface TopicDetailsProps {
  topic: {
    id: string;
    title: string;
    description: string;
    methodology: string;
    status: string;
    created_at: string;
    updated_at: string;
    student: {
      name: string;
      email: string;
      level_title: string;
    };
  };
  onBack: () => void;
}

const TopicDetails: React.FC<TopicDetailsProps> = ({ topic, onBack }) => {
  return (
    <div className="max-w-4xl relative mx-auto ">
      <h1 className="text-2xl text-blue-900 font-bold  mb-4">
        <span className={"text-gray-600 py-2 text-lg"}>Proposed Topic:</span>
        <br />
        {topic.title}
      </h1>
      <p className="text-sm text-gray-500 mb-2">
        Created At: {new Date(topic.created_at).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Last Updated: {new Date(topic.updated_at).toLocaleString()}
      </p>

      <div className="absolute top-0 right-4 flex gap-3 items-center mb-6">
        <h2 className="text-md font-semibold text-gray-500">Status</h2>
        <p
          className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
            topic.status === "approved"
              ? "bg-green-100 text-green-700"
              : topic.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {/* {topic.status.charAt(0).toUpperCase() + topic.status.slice(1)} */}
          {topic.status}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-md font-medium text-blue-900 mb-1">Description</h2>

        <div
          className="min-h-30 border border-gray-300 p-3 rounded-lg text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: topic.description }}
        />
      </div>

      {topic.methodology && (
        <div className="mb-6">
          <h2 className="text-md font-medium text-blue-900 mb-1">
            Aim and Objectives
          </h2>
          <div
            className="min-h-30 border border-gray-300 p-3 rounded-lg text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: topic.methodology }}
          />
        </div>
      )}

      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Student Details</h2>
        <p className="text-gray-700">
          <strong>Name:</strong> {topic.student.name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {topic.student.email}
        </p>
        <p className="text-gray-700">
          <strong>Level:</strong> {topic.student.level_title}
        </p>
      </div> */}
    </div>
  );
};

export default TopicDetails;
