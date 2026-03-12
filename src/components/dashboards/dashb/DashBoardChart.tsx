import {
  ResponsiveContainer
  , XAxis, YAxis, CartesianGrid, Legend, Tooltip, BarChart,
  Bar
} from "recharts";

interface dataType {
  supervisor: string;
  students: number;
  key2?: number;
}

type chartProps = {
  data?: dataType[];
};

const DashBoardChart = ({ data }: chartProps) => {
  ;


  return (
    <>

      <div className="h-100" >
        <ResponsiveContainer width={"100%"} height={"100%"} >
          <BarChart width={500} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <Tooltip content={customTooltip} />
            <Bar
              dataKey={"students"}
              fill="#C4B454"

              width={10}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="supervisor" />
            <YAxis />
            <Legend />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </>
  );
};

export default DashBoardChart;

const customTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-50 dark:bg-card p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">{label}</p>
        <p>{`Students: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};
