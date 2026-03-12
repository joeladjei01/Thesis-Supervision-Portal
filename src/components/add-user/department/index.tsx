import { useLocation, useNavigate } from "react-router";
import Tab from "../Tab";
import AddStudent from "./student/AddStudent";
import AddSupervisor from "./supervisor/AddSupervisor";
import { MdOutlineSettings as Cog6ToothIcon } from "react-icons/md";
import SolidButton from "../../../components/shared/buttons/SolidButton";
import { useDepartmentDataStore } from "../../../store/useDepartmentDataStore";

function Department() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("userType");
  const navigate = useNavigate();
  const { programTitles, researchAreas } = useDepartmentDataStore();

  return (
    <div>
      {programTitles?.length == 0 && researchAreas?.length == 0 && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-6">
          <div className="w-full max-w-xl rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <Cog6ToothIcon
                  className="h-8 w-8 text-ug-blue"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No program titles or research areas found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                You need to add at least one program title and research area
                before creating users. These help categorize and organize
                student and supervisor data.
              </p>

              <div className="mt-5 flex w-full justify-center gap-3">
                <SolidButton
                  type="button"
                  title={"Go to Settings"}
                  Icon={<Cog6ToothIcon className="h-4 w-4" />}
                  onClick={() => navigate("/settings")}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-ug-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Tab />
      {userType === "supervisors" ? <AddSupervisor /> : <AddStudent />}
    </div>
  );
}

export default Department;
