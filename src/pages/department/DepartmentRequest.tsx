import useRequestStore from '../../store/useRequestStore'
import RequestTab from '../../components/request/RequestTab'
import userStore from '../../store'
import {  MessageSquareTextIcon } from 'lucide-react'



const DepartmentRequest = () => {
    const { currentTab } = useRequestStore()
    const { person } = userStore()



    return (
        <div className='w-full min-h-[80vh]'>
            {/* {currentTab.value == "stud" && */}
                <div className='w-full grid grid-cols-1 md:grid-cols-3 '>
                    <div className='col-span-1'>
                        <RequestTab requests={[]} />
                    </div>
                    <div className='hidden md:block col-span-2'>
                        <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 border border-gray-200">
                            <div className="relative w-full text-center mx-aut p-8">
                                <div className="mb-8 relative">
                                    <div className="w-32 h-32 mx-auto bg-blue-800 rounded-full flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                        <MessageSquareTextIcon size={60} className="text-white" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-blue-800 mb-2 bg-gradient-to-r ">
                                    Select a Request
                                </h2>

                                <div className="text-center">

                                    <p className="text-sm text-gray-500 mt-2">
                                        Select from your available requests on the left
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/* } */}

            {currentTab.value == "sup" &&
                <div>
                    ddd
                </div>
            }

        </div>
    )
}

export default DepartmentRequest
