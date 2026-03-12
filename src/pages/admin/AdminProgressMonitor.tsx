import React from "react";
import Header from "../../components/shared/text/Header";
import DepartInstituteProgressM from "../../components/admin/DepartInstituteProgressM";
import usePageTile from "../../hooks/usePageTitle";


const AdminProgressMonitor = () => {
    usePageTile("Admin - Progress Monitor");
    return (
        <div>
            <Header
                title="Progress Monitor"
                subtitle="Monitor the progress of various departments and institutes within the university."
            />

            <div className="mt-6">
                <DepartInstituteProgressM />

            </div>
        </div>
    )
}

export default AdminProgressMonitor