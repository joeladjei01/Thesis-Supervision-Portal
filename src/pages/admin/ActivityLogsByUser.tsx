import { formatDate, inputStyles } from "../../utils/helpers";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowLeft,
  Clock1,
  Edit,
  PlusCircle,
  Search,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import Loading from "../../components/shared/loader/Loading";
import { AiOutlineFileSearch } from "react-icons/ai";

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: string;
  performed_by: {
    id: string;
    email: string;
  };
  timestamp: string;
}

interface DepartmentData {
  id: string;
  name: string;
  school: string;
  college: string;
  head: string;
}

const ActivityLogsByUser = () => {
  const [dateFilter, setDateFilter] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");

  const navigate = useNavigate();
  const id = useParams().id as string;
  const axios = useAxiosPrivate();

  const { data: dapartData } = useQuery({
    queryKey: ["department-data"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(`/departments/retrieve/${id}/`);
        return data.department as DepartmentData;
      } catch (error) {
        console.error("Error fetching department data:", error);
        toast.error("Failed to fetch department data.");
        throw error;
      }
    },
  });

  const { data: actLogs, isLoading } = useQuery({
    queryKey: ["activity-logs-by-id", id],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/departments/activity-logs/${id}/`
        );
        console.log("Fetched activity log by ID:", data);
        return data as ActivityLog[];
      } catch (error) {
        console.error("Error fetching activity log by ID:", error);
        toast.error("Failed to fetch activity log.");
        throw error;
      }
    },
  });

  // Filter activity logs based on search query and selected filters
  const filteredLogs = useMemo(() => {
    let filtered = actLogs || [];

    if (query.trim()) {
      filtered = filtered.filter(
        (log) =>
          // log.user.toLowerCase().includes(query.toLowerCase()) ||
          log.action.toLowerCase().includes(query.toLowerCase()) ||
          log.details.toLowerCase().includes(query.toLowerCase()) ||
          log.performed_by.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedAction) {
      filtered = filtered.filter((log) => log.action === selectedAction);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === filterDate.toDateString();
      });
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [actLogs, query, selectedAction, dateFilter]);

  const clearFilters = () => {
    setQuery("");
    setSelectedAction("");
    setDateFilter("");
  };

  const getActionIcon = (action: string) => {
    const userAction = action.toLowerCase();
    if (userAction.includes("updated")) {
      return <Edit className="w-4 h-4 text-green-600" />;
    } else if (userAction.includes("created")) {
      return <PlusCircle className="w-4 h-4 text-purple-600" />;
    } else {
      return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  // Get action color class
  const getActionColorClass = (action: string) => {
    const userAction = action.toLowerCase();
    if (userAction.includes("updated")) {
      return " text-green-800 border-l-green-200";
    } else if (userAction.includes("created")) {
      return " text-purple-800 border-l-purple-200";
    } else {
      return " text-blue-800 border-l-blue-200";
    }
  };

  return (
    <div>
      <div>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="group bg-gray-200 dark:bg-card flex items-center justify-center rounded-lg gap-2 cursor-pointer text-gray-700 dark:text-gray-200 py-2.5 px-4 border dark:border-border/50 hover:bg-gray-300 dark:hover:bg-secondary/20 transition-all duration-200 font-medium shadow-sm"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>

        {isLoading && <Loading message="Please wait..." />}

        {!isLoading && (
          <div>
            <div className="my-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                {dapartData?.name} Activity Logs
              </h3>
            </div>

            <div>
              <div className="mb-6 bg-white dark:bg-card p-6 rounded-xl border border-gray-300 dark:border-border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Search Input */}
                  <div className="relative col-span-2">
                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by action, or user email..."
                      className={`w-full bg-white dark:bg-secondary/5 py-2.5 px-3 pl-10 dark:text-gray-200 dark:placeholder:text-gray-500 border-none ring-1 ring-gray-300 dark:ring-border focus:ring-2 focus:ring-blue-500 rounded-lg outline-none transition-all ${inputStyles}`}
                    />
                    {query && (
                      <XCircle
                        size={18}
                        className="absolute top-3 right-2 text-gray-400"
                        onClick={() => setQuery("")}
                      />
                    )}
                  </div>

                  {/* Date Filter */}
                  <div className="relative">
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full bg-white dark:bg-secondary/5 py-2.5 px-3 border border-gray-300 dark:border-border dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Filter Summary and Clear Button */}
                <div className="flex justify-between items-center bg-gray-50 dark:bg-secondary/5 p-3 rounded-lg border dark:border-border/40 mt-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Showing <span className="text-blue-600 dark:text-blue-400">{filteredLogs.length}</span> of <span className="text-gray-800 dark:text-gray-200">{actLogs?.length}</span> activities
                    {(query || dateFilter) && (
                      <span className="ml-2 text-xs text-orange-600 font-bold uppercase">(filtered)</span>
                    )}
                  </div>
                  {(query || selectedAction || dateFilter) && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 text-sm text-blue-900 hover:text-blue-800 border border-blue-900 rounded-md hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              <div className="min-h-96 bg-white dark:bg-card border border-gray-300 dark:border-border p-6 rounded-2xl shadow-sm">
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`border border-gray-200 dark:border-border/40 rounded-xl p-4 border-l-4 border-r-8 dark:bg-secondary/5 transition-all duration-200 hover:shadow-md ${getActionColorClass(
                        log.action
                      )}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getActionIcon(log.action)}
                          <div className="flex-1 min-w-0">
                            <div className="space-y-1">
                              <div className="text-sm font-medium dark:text-gray-200 font-montserrat">
                                <p className="text-gray-900 dark:text-white font-bold">{log.performed_by.email} </p>
                                <p className="mt-1 font-semibold opacity-90">
                                  {log.action}
                                </p>
                              </div>
                              {/* <div className="text-sm text-gray-600">
                              {log.details}
                            </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-secondary/20 px-2 py-1 rounded-md">
                          <Clock1 size={13} />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredLogs.length === 0 && (
                  <div className="text-gray-500 py-8">
                    <AiOutlineFileSearch
                      className="text-gray-400 mx-auto"
                      size={70}
                    />

                    <p className="text-center">No activity logs found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsByUser;
