import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import usePageTile from "../../hooks/usePageTitle";
import {
  Search,
  User,
  Clock,
  MapPin,
  Shield,
  Activity,
  RefreshCcw,
  Loader2,
  XCircle,
  School,
} from "lucide-react";
import Loading from "../../components/shared/loader/Loading";
import CustomSelect from "../../components/shared/custom-select";
import Header from "../../components/shared/text/Header";
import SolidButton from "../../components/shared/buttons/SolidButton";
import { inputStyles, isInstitute } from "../../utils/helpers";
import { useNavigate } from "react-router";

interface ActivityLog {
  id: number;
  action: string;
  target: string;
  details: {
    role: string;
  };
  ip_address: string;
  created_at: string;
  user: string;
}

const ActivityLogs = () => {
  usePageTile("Activity Logs");
  const axios = useAxiosPrivate();
  // const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const navigate = useNavigate();

  const Admin = import.meta.env.VITE_ADMIN_ROLE;
  const supervisor = import.meta.env.VITE_SUPERVISOR_ROLE;
  const student = import.meta.env.VITE_STUDENT_ROLE;
  const department = import.meta.env.VITE_DEPARTMENT_ROLE;

  function roleMapper(roleId: string) {
    switch (roleId) {
      case Admin:
        return "Admin";
      case supervisor:
        return "Supervisor";
      case student:
        return "Student";
      case department:
        return "Department";
      default:
        return "Unknown";
    }
  }

  const fetchActivityLogs = async () => {
    try {
      const { data }: any = await axios.get("/departments/");
      console.log("Departments", data);
      return data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Failed to fetch activity logs.");
      throw error;
    }
  };

  const {
    isLoading,
    refetch,
    data: departments,
  } = useQuery({
    queryKey: ["all-department"],
    queryFn: fetchActivityLogs,
    // onSuccess: (data) => {
    //     setActivityLogs(data);
    // }
  });

  const { data: actLogs } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get("/activitylog/activity-logs/");

        return data;
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        toast.error("Failed to fetch activity logs.");
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
          log.user.toLowerCase().includes(query.toLowerCase()) ||
          log.action.toLowerCase().includes(query.toLowerCase()) ||
          log.target.toLowerCase().includes(query.toLowerCase()) ||
          log.ip_address.includes(query),
      );
    }

    if (selectedAction) {
      filtered = filtered.filter((log) => log.action === selectedAction);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.created_at);
        return logDate.toDateString() === filterDate.toDateString();
      });
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [actLogs, query, selectedAction, dateFilter]);

  const filteredDepartments = useMemo(() => {
    let filtered = departments || [];

    if (query.trim()) {
      filtered = filtered.filter((dept) =>
        dept.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return filtered;
  }, [departments, query]);

  const clearFilters = () => {
    setQuery("");
    setSelectedAction("");
    setDateFilter("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "user signed in":
        return <User className="w-4 h-4 text-green-600" />;
      case "user signed out":
        return <User className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  // Get action color class
  const getActionColorClass = (action: string) => {
    switch (action.toLowerCase()) {
      case "user signed in":
        return " text-green-800 border-l-green-200";
      case "user signed out":
        return " text-red-800 border-l-red-200";
      default:
        return " text-blue-800 border-l-blue-200";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Header
          title="Activity Logs"
          subtitle="Monitor user activities and system events"
        />
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white dark:bg-card p-4 rounded-xl border border-gray-300 dark:border-border shadow-sm">
        <div className="gap-4 mb-4">
          {/* Search Input */}
          <div className="relative col-span-2">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search department/center/institute"
              className={`w-full bg-white dark:bg-secondary/5 py-2 px-3 pl-10 dark:text-gray-200 dark:placeholder:text-gray-500 ${inputStyles}`}
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
          {/* <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          /> */}
        </div>

        {/* Filter Summary and Clear Button */}
        {/* <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {actLogs?.length} activity logs
            {(query || selectedAction || dateFilter) && (
              <span className="ml-2">(filtered)</span>
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
        </div> */}
      </div>

      {/* Activity Logs Content */}
      <div className="min-h-96 bg-white dark:bg-card border border-gray-300 dark:border-border rounded-xl p-4 shadow-sm">
        {/* Loading State */}
        {isLoading && <Loading message="Loading activity logs..." />}

        {/* Activity Logs List */}
        {!isLoading && (
          <>
            {filteredDepartments?.length > 0 && (
              <div className="space-y-3">
                {filteredDepartments?.map((department) => (
                  <div
                    key={department.id}
                    className="border border-gray-200 dark:border-border/50 rounded cursor-pointer p-4 hover:shadow-md transition-all duration-200 border-r-7 border-l-3 border-l-sky-700 dark:border-l-blue-600 dark:bg-secondary/5 hover:bg-gray-50 dark:hover:bg-secondary/10 group"
                    onClick={() => navigate(`/activity-logs/${department.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <School className="w-4 h-4 text-ug-blue dark:text-blue-400 group-hover:scale-110 transition-transform" />
                              <span className="font-bold text-gray-800 dark:text-gray-200 font-montserrat">
                                {isInstitute(department.name)
                                  ? ""
                                  : "Department of "}{" "}
                                {department.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* <div className="mt-4 border-t border-gray-300 px-4 pt-4">
          {filteredLogs.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 mb-2">
                {actLogs?.length === 0
                  ? "No activity logs found."
                  : "No activity logs match your search criteria."}
              </div>
              {(query || selectedAction || dateFilter) && (
                <button
                  onClick={clearFilters}
                  className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {filteredLogs.length > 0 && !isLoading && (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`border border-gray-200 rounded p-4 border-l-3 border-r-7 ${getActionColorClass(
                    log.action
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getActionIcon(log.action)}
                      <div className="flex-1 min-w-0">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700 font-montserrat">
                            <p>{log.user} </p>
                            <p className="font-semibold text-gray-600">
                              {log.action}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600">
                            Role: {roleMapper(log.details.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>

      {/* Refresh Button */}
      {/* <div className="mt-4 flex justify-end">
        <SolidButton
          title={isLoading ? "Refreshing..." : "Refresh Logs"}
          Icon={
            isLoading ? (
              <Loader2
                size={16}
                className={`${isLoading ? "animate-spin" : ""}`}
              />
            ) : (
              <RefreshCcw size={18} />
            )
          }
          onClick={() => refetch()}
          disabled={isLoading}
        />
      </div> */}
    </div>
  );
};

export default ActivityLogs;
