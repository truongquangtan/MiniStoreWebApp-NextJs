/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import routes from "routes.js";
import { useEffect, useState } from "react";
import { getRole } from "@/common/authStore";
import constants from "@/common/constants";

const Sidebar = ({ open, onClose }) => {
  const [routesValue, setRoutesValue] = useState([])

  useEffect(() => {
    const role = getRole()
    if(role == constants.roleIdConstant.MANAGER){
      setRoutesValue(routes.manager)
    }
    if(role == constants.roleIdConstant.SALES){
      setRoutesValue(routes.sales)
    }
    if(role == constants.roleIdConstant.GUARD){
      setRoutesValue(routes.guard)
    }
  }, [])

  return (
    <div
      className={`flex sm:none duration-175 linear fixed !z-50 min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[30px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          Mini <span className="font-medium">Store</span>
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="w-[300px] mb-auto pt-1">
        <Links routes={routesValue} />
      </ul>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
