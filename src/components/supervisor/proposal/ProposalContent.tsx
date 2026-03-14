import { shortenText } from "../../../utils/helpers";

interface ProposalContentProps {
  title: string;
  description: string;
  methodology: string;
}

const ProposalContent: React.FC<ProposalContentProps> = ({
  title,
  description,
  methodology,
}) => (
  <div className="space-y-6">
    <div className="pb-4 border-b border-gray-100 dark:border-border/40">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white font-montserrat tracking-tight leading-snug">
        {title}
      </h3>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-1 w-8 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Executive Summary
        </h4>
      </div>
      <div
        className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-justify prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: shortenText(description, 260) }}
      />
    </div>

    {methodology && (
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Aim & Objectives
          </h4>
        </div>
        <div
          className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-justify prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: shortenText(methodology, 260) }}
        />
      </div>
    )}
  </div>
);
export default ProposalContent;
