// import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
// import { MdClose as XMarkIcon } from "react-icons/md";
// import { useState } from "react";
// import SolidButton from "../shared/buttons/SolidButton";

// type NotifiPanelProps = {
//   onOpenPanel: (value: boolean) => void;
//   isOpen: boolean;
// }

// const mockNotifications = [
//     {
//       id: 1,
//       title: "New Assignment",
//       description: "You have been assigned a new supervisor.",
//       timestamp: "2 hours ago",
//     },
//     {
//       id: 2,
//       title: "Submission Reminder",
//       description: "Your thesis submission deadline is approaching.",
//       timestamp: "1 day ago",
//     },
//     {
//       id: 3,
//       title: "Meeting Scheduled",
//       description: "A meeting with your supervisor has been scheduled.",
//       timestamp: "3 days ago",
//     },
//   ];

// const NotifiPanel = ({onOpenPanel , isOpen} : NotifiPanelProps) => {
//     const [notifications, setNotifications] = useState(mockNotifications);

//     const handleClearNotifications = () => {
//         setNotifications([]);
//       };

//   return(
//     <Dialog
//         open={isOpen}
//         onClose={onOpenPanel}
//         className="relative z-50 "
//     >
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-gray-900/60 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//         />

//         <div className="fixed right-0 inset-0 flex justify-end">
//             <DialogPanel
//                 transition
//                 className={"relative flex  w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:translate-x-full"}
//             >

//                 {/* <div className="flex grow flex-col gap-y- overflow-y-auto ug-blue-background pt-">
//                     Notification Panel
//                 </div> */}

//             <div className="flex grow flex-col gap-y-4 overflow-y-auto bg-gray-50">
//             <div className="">
//               <h2 className="text-lg text-center w-full py-2 ug-blue-background  font-semibold text-gray-100">Notifications</h2>
//               <button
//                 onClick={handleClearNotifications}
//                 className="text-sm text-blue-600 hover:underline px-4 cursor-pointer mt-1"
//               >
//                 Clear All
//               </button>
//             </div>

//             {notifications.length > 0 ? (
//               <ul className="space-y-4 p-4">
//                 {notifications.map((notification) => (
//                   <li
//                     key={notification.id}
//                     className="p-4 bg-white rounded-lg shadow-sm border border-blue-700/60"
//                   >
//                     <h3 className="text-sm font-medium text-gray-900">
//                       {notification.title}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {notification.description}
//                     </p>
//                     <span className="text-xs text-gray-400">
//                       {notification.timestamp}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-500 text-center">
//                 No notifications available.
//               </p>
//             )}
//           </div>

                

//                 <TransitionChild>
//                   <div className="absolute right-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
//                     <button
//                       type="button"
//                       onClick={() => onOpenPanel(false)}
//                       className="-m-2.5 p-2.5"
//                     >
//                       <span className="sr-only">Close sidebar</span>
//                       <XMarkIcon aria-hidden="true" className="size-6 text-white" />
//                     </button>
//                   </div>
//                 </TransitionChild>

//             </DialogPanel>
//         </div>
        
        
//     </Dialog>
//   );
// }
// export default NotifiPanel;