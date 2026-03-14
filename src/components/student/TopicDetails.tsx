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

const TopicDetails: React.FC<TopicDetailsProps> = ({ topic }) => {
  return (
    <div className="max-w-4xl relative mx-auto ">
      <h1 className="text-2xl text-foreground font-bold mb-6">
        <span className={"text-muted-foreground py-2 text-sm uppercase tracking-wider font-semibold"}>Proposed Topic:</span>
        <br />
        {topic.title}
      </h1>
      <p className="text-sm text-muted-foreground mb-1">
        Created At: {new Date(topic.created_at).toLocaleString()}
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Last Updated: {new Date(topic.updated_at).toLocaleString()}
      </p>

      <div className="absolute top-0 right-4 flex gap-3 items-center mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</h2>
        <p
          className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${
            topic.status === "approved"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : topic.status === "pending"
                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {topic.status.toUpperCase()}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h2>

        <div
          className="min-h-30 border border-border p-4 rounded-xl text-foreground leading-relaxed bg-muted/30"
          dangerouslySetInnerHTML={{ __html: topic.description }}
        />
      </div>

      {topic.methodology && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Aim and Objectives
          </h2>
          <div
            className="min-h-30 border border-border p-4 rounded-xl text-foreground leading-relaxed bg-muted/30"
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
