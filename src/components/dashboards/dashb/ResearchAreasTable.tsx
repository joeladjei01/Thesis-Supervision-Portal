interface ResearchArea {
  area: string;
  students: number;
}

type researchAreasProps = {
  data: ResearchArea[];
};

const ResearchAreasTable = ({ data }: researchAreasProps) => {
  return (
    <div className="bg-white rounded-2xl">
      <div className="overflow-hidden text-blue-900">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold ">Research Area</h3>
          <h3 className="text-lg font-semibold ">Students</h3>
        </div>

        <div className="space-y-2">
          {data.map((area, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2"
            >
              <span className=" font-medium text-lg">{area.area}</span>
              <span className=" font-semibold text-lg">{area.students}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchAreasTable;
