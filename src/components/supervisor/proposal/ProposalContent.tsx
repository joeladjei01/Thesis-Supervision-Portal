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
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold text-slate-600 mb-2 font-montserrat">
        {title}
      </h3>
    </div>

    <div>
      <h4 className="font-medium text-gray-600 mb-2 border-b border-gray-300 pb-1">
        Description
      </h4>
      <div
        className="text-gray-700 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: shortenText(description, 260) }}
      />
    </div>

    {methodology && (
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Aim and Objectives</h4>
        <div
          className="text-gray-700 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: shortenText(methodology, 260) }}
        />
      </div>
    )}
  </div>
);
export default ProposalContent;
