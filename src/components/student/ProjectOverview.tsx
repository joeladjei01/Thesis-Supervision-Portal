import { AlertCircle, CheckCircle, FileText, Play } from "lucide-react";


// Types and Interfaces (Interface Segregation Principle)
interface IProjectPhase {
  id: string;
  name: string;
  status: "approved" | "in-progress" | "not-started" | "reject" | "revise" | "due";
  startDate?: string;
  endDate?: string;
}

interface IProject {
  id: string;
  title: string;
  supervisor: string;
  phases: IProjectPhase[];
}


// Project Overview Component
interface IProjectOverviewProps {
  project: IProject;
}

// Progress Bar Component
interface IProgressBarProps {
  label: string;
  status: "approved" | "in-progress" | "not-started" | "reject" | "revise" | "due";
}

const ProgressBar: React.FC<IProgressBarProps> = ({
  label,
  status,
}) => {
  const getStatusAssets = () => {
    switch (status) {
      case "approved":
        return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, color: "bg-green-500", text: "Approved", progress: 100 };
      case "in-progress":
        return { icon: <Play className="w-4 h-4 text-blue-800" />, color: "bg-blue-700", text: "In Progress", progress: 55 };
      case "not-started":
        return { icon: <AlertCircle className="w-4 h-4 text-gray-400" />, color: "bg-gray-400", text: "Not Started" ,progress: 0 };
      case "reject":
        return { icon: <AlertCircle className="w-4 h-4 text-red-500" />, color: "bg-red-500", text: "Rejected", progress: 100 };
      case "revise":
        return { icon: <AlertCircle className="w-4 h-4 text-yellow-500" />, color: "bg-yellow-500", text: "Revise", progress: 75 };
      case "due":
        return { icon: <AlertCircle className="w-4 h-4 text-red-500" />, color: "bg-red-300", text: "Due", progress: 25 };
        default:
        return { icon: <AlertCircle className="w-4 h-4 text-gray-400" />, color: "bg-gray-400", text: "Unknown", progress: 0 };
    }
  };

  const { icon, color, text, progress } = getStatusAssets();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm font-medium text-gray-900">
            {label}
          </span>
        </div>
        <span className="text-xs text-gray-500">{text}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const ProjectOverview: React.FC<IProjectOverviewProps> = ({ project }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold font-nunito-sans text-slate-700 mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Project Overview
      </h3>

      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-600 " >
            Project Title
          </p>
          <p className="text-md text-gray-900">{project.title}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Supervisor</p>
          <p className="text-md text-gray-900">{project.supervisor}</p>
        </div>
      </div>

      <div className="px-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-3">
            Project Timeline
          </p>
        </div>

        <div className="">
          {project.phases.map((phase) => (
            <ProgressBar
              key={phase.id}
              label={phase.name}
              status={phase.status}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProjectOverview