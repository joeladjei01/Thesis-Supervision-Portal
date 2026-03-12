import { Loader2 } from 'lucide-react';
// import logo from "../../../assets/UG_LOGO_SHORT.png"
import React from 'react'

type Props = {
  message?: string
  loaderSize?: number
}

const Loading = ({ message, loaderSize = 75 }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      {/* <img src={logo} className='h-30 w-30 object-center' /> */}
      <Loader2 size={loaderSize} className="animate-spin text-blue-900" />
      <p className="text-gray-700">
        {message}
      </p>
    </div>
  );
}

export default Loading