
type cardProp = {
  title: string;
  number: number | string;
  subNum?: string;
  subTitle: string;
  onClick?: () => void;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const DashboardCard = ({ title, number, onClick, subTitle, Icon }: cardProp) => {
  return (
    <div
      className="bg-white dark:bg-card w-75 flex items-center justify-between rounded-md shadow-sm border border-gray-100 border-t-4 border-t-primary dark:border-t-secondary "
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="text-md font-medium text-slate-500 dark:text-white font-montserrat">{title}</h3>
        <div className="text-xl font-semibold tracking-wide text-primary dark:text-gray-200 mb-2 font-cal-sans">{number}</div>
        <div className="flex items-center text-xs">
          <span className="text-gray-500 font-montserrat ">{subTitle}</span>
        </div>
      </div>

      <div className="relative w-20 h-full bg-sky-50 dark:bg-gray-800 rounded-l-[130px]">
        <div className="flex justify-center items-center bg-primary dark:bg-card size-12 rounded-full absolute top-[43%] -left-2 p-0 border-white dark:border-card border-6">
          <Icon size={18} className="text-slate-50 " />
        </div>
      </div>


    </div>
  );
};

export default DashboardCard;
