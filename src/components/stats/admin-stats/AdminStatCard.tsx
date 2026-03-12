import type { AdminStatProps } from "../../../utils/types";

function AdminStatCard({ headTitle, metric, footer }: AdminStatProps) {
  return (
    <div className="border-2 border-[#8A8A8A] rounded-lg w-64 max-w-sm py-2 px-4">
      <h2 className="text-base  text-left text-[#030816]">{headTitle}</h2>
      <p className="text-sm font-bold text-left text-[#8A8A8A]">{metric}</p>
      <p className="text-left text-[#8A8A8A] text-xs">{footer}</p>
    </div>
  );
}

export default AdminStatCard;
