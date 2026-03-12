import React, { useState } from 'react'
import CustomSelect from '../shared/custom-select'
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { ArrowBigLeft, ArrowRight, RefreshCcw, School } from 'lucide-react';
import { useNavigate } from 'react-router';
import { removeDash } from '../../utils/helpers';

const DepartInstituteProgressM = () => {
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const axios = useAxiosPrivate();
    const navigate = useNavigate()

    const { data: colleges } = useQuery<any>({
        queryKey: ['fetch-colleges'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/selector/colleges');
                return data;
            } catch (error) {
                toast.error("Error fetching colleges");
                throw error;
            }
        },
    })

    const { data: schools, isLoading: fetchingSchools } = useQuery({
        queryKey: ['fetch-schools', selectedCollege],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/selector/schools?collegeId=${selectedCollege}`);
                return data as any[];
            } catch (error) {
                toast.error("Error fetching schools");
                throw error;
            }
        },
        enabled: !!selectedCollege,
    });

    const { data: departments, isLoading: fetchingDepartments } = useQuery({
        queryKey: ['fetch-departments', selectedSchool],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/selector/departments?schoolId=${selectedSchool}`);
                return data as any[];
            } catch (error) {
                toast.error("Error fetching departments");
                throw error;
            }
        },
        enabled: !!selectedSchool && selectedSchool !== "institute",
    })

    const { data: institutes } = useQuery({
        queryKey: ['fetch-institutes', selectedCollege],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/selector/centers-and-institutes?collegeId=${selectedCollege}`);
                return data as any[];
            } catch (error) {
                toast.error("Error fetching institutes");
                throw error;
            }
        },
        enabled: selectedSchool === "institute" && !!selectedCollege,
    })


    const fetchAllDepartments = async () => {
        try {
            const { data }: any = await axios.get('/departments/');
            // setAllDepartments(data);
            console.log('Departments fetched:', data);
            return data as any[];
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to fetch departments');
        }
    }

    const { isLoading: fetchingAllDepart, data: allDepart } = useQuery({
        queryFn: fetchAllDepartments,
        queryKey: ['fetch-all-departments'],
        enabled: selectedSchool !== "institute"
    })

    const getSchoolOptions = () => {
        if (schools) {
            return [...schools.map((school) => ({ label: removeDash(school.name), value: school.id })), { label: "Centre/Institutes", value: "institute" }];
        }
        return [];
    }


    const getDepartmentsOrInstitutes = () => {
        if (selectedSchool === "institute") {
            return institutes?.map((institute) => ({ label: institute.name, value: institute.id }));
        } else {
            return departments?.map((department) => ({ label: department.name, value: department.id }));
        }
    }
    const navigateToDetais = (label: string) => {
        const selected = allDepart?.find((value: any) => value.name === label);
        if (selected) {
            navigate(`/progress-monitoring/${selected.id}`);
        } else {
            // Check in institutes if not found in departments
            const selectedInst = institutes?.find((inst: any) => inst.name === label);
            if (selectedInst) {
                navigate(`/progress-monitoring/${selectedInst.id}`);
            } else {
                toast.error("Could not find record details");
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <CustomSelect
                    label='College'
                    value={selectedCollege}
                    onChange={option => setSelectedCollege(option)}
                    options={colleges?.map((college: any) => ({ label: removeDash(college.name), value: college.id }))}
                    placeholder="Select College"
                />
                <CustomSelect
                    label='School'
                    value={selectedSchool}
                    onChange={option => setSelectedSchool(option)}
                    options={getSchoolOptions()}
                    placeholder="Select Department/Institute"
                    isLoading={fetchingSchools}
                    disabled={!selectedCollege}
                />
                {/* <CustomSelect
                    label='Department/Institute'
                    value={selectedDepartment}
                    isClearable
                    onChange={option => setSelectedDepartment(option?.value)}
                    options={getDepartmentsOrInstitutes()}
                    isLoading={fetchingDepartments}
                    disabled={!selectedSchool && !selectedCollege}
                    placeholder="Select Department/Institute"
                /> */}
            </div>
            {selectedCollege && selectedSchool ?
                <div className='bg-white dark:bg-card w-full p-6 border border-gray-100 dark:border-border rounded-xl shadow-sm mt-7 transition-all duration-300'>
                    <div className=' flex items-center justify-between mb-6 border-b dark:border-border'>
                        <div className='flex'>
                            <button className={`py-3 px-6 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${!(selectedSchool === "institute") ? "text-blue-950 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 border-none"}`}>Department</button>
                            <button className={`py-3 px-6 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${selectedSchool === "institute" ? "text-blue-950 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 border-none"}`}>Institute/Center</button>
                        </div>
                        {fetchingDepartments && <div className='pr-4'>
                            <RefreshCcw size={15} className={`animate-spin text-gray-800`} />
                        </div>}
                    </div>
                    <div className='w-full'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='text-left bg-blue-50/50 dark:bg-blue-900/20 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400'>
                                    <th className='py-4 px-4 font-bold rounded-l-lg'>Department / Entity</th>
                                    <th className='py-4 px-4 font-bold rounded-r-lg'>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {getDepartmentsOrInstitutes()?.length === 0 ?
                                    <tr>
                                        <td colSpan={2} className='p-8 text-center text-gray-500 dark:text-gray-400 italic'>
                                            No Department or Institute/Center found in this selection
                                        </td>
                                    </tr>
                                    :
                                    getDepartmentsOrInstitutes()?.map((dept: any) => (
                                        <tr key={dept.value} className='group border-b border-gray-100 dark:border-border/40 hover:bg-gray-50 dark:hover:bg-secondary/5 transition-all duration-200'>
                                            <td className='py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-200'>{dept.label}</td>
                                            <td className='py-4 px-4'>
                                                <button
                                                    onClick={() => navigateToDetais(dept.label)}
                                                    className='w-10 h-10 cursor-pointer text-blue-600 dark:text-blue-400 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300 shadow-sm'>
                                                    <ArrowRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                : <div className='w-full text-center py-20 px-10 bg-gray-50 dark:bg-card border border-dashed dark:border-border rounded-2xl'>
                    <div className='bg-blue-50 dark:bg-blue-900/20 size-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <School className='text-blue-600 dark:text-blue-400' size={32} />
                    </div>
                    <h4 className='text-gray-800 dark:text-white font-bold text-lg'>Selection Required</h4>
                    <p className='text-gray-500 dark:text-gray-400 mt-2'>Select a College and School above to monitor department or center progress</p>
                </div>}
        </div>
    )
}

export default DepartInstituteProgressM