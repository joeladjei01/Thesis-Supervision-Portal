import type { ReactNode } from "react";
import logo from "../../assets/UG_LOGO_FULL-01.png";
import logoWhite from "../../assets/uglogo-white.png";
import heroImg from "../../assets/Hero.png";

export default function Auth({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-1 bg-white dark:bg-background transition-colors duration-300">
      <div className="relative bg-slate-50 dark:bg-secondary/5  hidden flex-1/2 border-r border-gray-200 dark:border-border lg:block overflow-hidden">
        <img alt="Hero" src={heroImg} className="size-full object-cover opacity-90" />
        
        <div className="absolute w-full bg-linear-to-t from-white dark:from-primary to-transparent bottom-0 pb-15 pt-20 left-0 flex items-end">
          <h2 className="text-5xl pl-9 w-[65%] text-primary dark:text-gray-200 font-outfit font-bold tracking-tight">
            Thesis<br /> Supervision <span className="text-gray-500 dark:text-blue-400 font-medium">Portal</span>
          </h2>
          <div className="h-2 w-[35%] bg-gray-500 dark:bg-blue-400 translate-y-[-10px]" />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col px-4 mt-12 sm:px-6 lg:flex-1/2 lg:px-20 xl:px-24 justify-center">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="max-w-full flex flex-col items-center">
            <div className="mb-2">
              <img
                alt="UG Logo"
                src={logo}
                className="dark:hidden w-48 object-contain"
              />
              <img
                alt="UG Logo"
                src={logoWhite}
                className="hidden dark:block w-48 object-contain"
              />
            </div>
            <h2 className="text-3xl mt-2 text-primary dark:text-gray-100 font-outfit font-bold text-center">
              Thesis Supervision <span className="text-gray-600 dark:text-blue-400 font-normal">Portal</span>
            </h2>
            <div className="flex justify-center gap-1 w-full mt-2">
              <div className="h-1 rounded-full w-40 bg-gray-200 dark:bg-blue-900/30" />
              <div className="h-1 rounded-full w-12 bg-secondary dark:bg-blue-400" />
            </div>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
