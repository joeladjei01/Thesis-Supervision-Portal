import usePageTile from '../../hooks/usePageTitle';
import Loading from '../../components/shared/loader/Loading';
import Header from '../../components/shared/text/Header';
import { useStudentDataStore } from '../../store/useStudentDataStore';
import SolidButton from '../../components/shared/buttons/SolidButton';
import { useNavigate } from 'react-router';

const StudentSupervisors = () => {
    usePageTile("My Supervisors");
    const navigate = useNavigate();
    const supervisors = useStudentDataStore((state)=> state.supervisors)

    if (!supervisors) {
        return <Loading message='' loaderSize={30} />;
    }

    return (
        <div className="">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 border-b border-border">
                    <Header
                        title='My Supervisors'
                        subtitle='View and manage your academic supervisors for your thesis project.'
                    />
                </div>


                {supervisors && supervisors.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
                        {supervisors.map((supervisorData) => (
                            <div
                                key={supervisorData.id}
                                className={`bg-card rounded-lg shadow-sm overflow-hidden border-l-4 transition-all hover:shadow-md ${supervisorData.lead
                                        ? 'border-l-primary bg-primary/5'
                                        : 'border-l-muted'
                                    } border-y border-r border-border`}
                            >
                                <div className="p-6">
                                    {/* Lead Supervisor Badge */}
                                    {supervisorData.lead && (
                                        <div className="mb-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                                                </svg>
                                                Lead Supervisor
                                            </span>
                                        </div>
                                    )}

                                    {/* Supervisor Info */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-montserrat font-semibold text-foreground mb-1">
                                            {supervisorData.supervisor.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            ID: {supervisorData.supervisor.staff_id}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {supervisorData.supervisor.user.email}
                                        </p>
                                    </div>

                                    {/* Status and Load */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${supervisorData.supervisor.status === 'Available'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full mr-1 ${supervisorData.supervisor.status === 'Available'
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                    }`}></span>
                                                {supervisorData.supervisor.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Research Areas */}
                                    <div className="mb-4">
                                        <p className="text-xs text-muted-foreground mb-2">Research Areas</p>
                                        {supervisorData.supervisor.research_area && supervisorData.supervisor.research_area.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {supervisorData.supervisor.research_area.map((area: any) => (
                                                    <span
                                                        key={area.id}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border"
                                                    >
                                                        {area.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground/50 italic">No research areas specified</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {/* <div className="flex gap-2">
                                        <button className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
                                            Contact
                                        </button>
                                        <button className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-200 transition-colors">
                                            Schedule Meeting
                                        </button>
                                    </div> */}

                                    {/* Assignment Date */}
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <p className="text-xs text-muted-foreground">
                                            Assigned: {new Date(supervisorData.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card rounded-lg shadow-sm p-8 text-center border border-border">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No Supervisors Assigned</h3>
                        <p className="text-muted-foreground mb-4">
                            You don't have any supervisors assigned yet. Please contact your department for assistance.
                        </p>
                        <SolidButton
                            title={"Request Supervisor Assignment"}
                            onClick={()=> navigate('/requests')}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentSupervisors