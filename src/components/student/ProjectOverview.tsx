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
        return { icon: <Play className="w-4 h-4 text-primary" />, color: "bg-primary", text: "In Progress", progress: 55 };
      case "not-started":
        return { icon: <AlertCircle className="w-4 h-4 text-muted-foreground" />, color: "bg-muted-foreground/30", text: "Not Started" ,progress: 10 };
      case "reject":
        return { icon: <AlertCircle className="w-4 h-4 text-destructive" />, color: "bg-destructive", text: "Rejected", progress: 100 };
      case "revise":
        return { icon: <AlertCircle className="w-4 h-4 text-yellow-500" />, color: "bg-yellow-500", text: "Revise", progress: 75 };
      case "due":
        return { icon: <AlertCircle className="w-4 h-4 text-destructive" />, color: "bg-destructive/50", text: "Due", progress: 25 };
        default:
        return { icon: <AlertCircle className="w-4 h-4 text-muted-foreground" />, color: "bg-muted", text: "Unknown", progress: 0 };
    }
  };

  const { icon, color, text, progress } = getStatusAssets();

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm font-semibold text-foreground">
            {label}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{text}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/10">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const ProjectOverview: React.FC<IProjectOverviewProps> = ({ project }) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center">
        <FileText className="w-5 h-5 mr-3 text-primary" />
        Project Overview
      </h3>

      <div className="mb-6 border-b border-border pb-6">
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1" >
            Project Title
          </p>
          <p className="text-base font-medium text-foreground leading-snug">{project.title}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Supervisor</p>
          <p className="text-base font-medium text-foreground">{project.supervisor}</p>
        </div>
      </div>

      <div className="px-2">
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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