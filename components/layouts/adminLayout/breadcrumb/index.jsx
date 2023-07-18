import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import { getAvatar, getName, getRole, removeAllData } from "@/common/authStore";
import constants from "@/common/constants";
import Dropdown from "components/dropdown";
import { useRouter } from "next/router";
import { BsArrowBarUp } from "react-icons/bs";
import { FiAlignJustify } from "react-icons/fi";
import {
  IoMdNotificationsOutline,
} from "react-icons/io";
import moment from "moment";
import { AppContext } from "@/context/app-context";

const Breadcrumb = ({notificationData, ...props}) => {
  const [pageName, setPageName, connection, setConnection, connectionId, setConnectionId] = useContext(AppContext)
  const router = useRouter()
  const { onOpenSidenav, brandText } = props;

  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    setAvatar(getAvatar())

    const fullname = getName()
    const lastName = fullname.split(' ')
    setName(lastName[lastName.length - 1])

    const role = getRole()
    if (role == constants.roleIdConstant.MANAGER) {
      setRole('Manager')
    }
    if (role == constants.roleIdConstant.SALES) {
      setRole('Sales')
    }
    if (role == constants.roleIdConstant.GUARD) {
      setRole('Guard')
    }
  }, [])

  const onLogoutClick = () => {
    if(connection && connectionId){
      connection.send("RemoveConnection", connectionId)
    }
    removeAllData()
    router.push('/auth/login')
  }

  return (
    <nav className="my-4 z-[1] relative flex flex-row flex-wrap items-center justify-between rounded-xl backdrop-blur-xl dark:bg-[#0b14374d]">
      <div>
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink mt-2 text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            href="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>
      <div className="relative mt-[3px] flex h-[61px] w-[150px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:flex-grow-0 md:gap-1 xl:gap-2">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        {/* start Notification */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] h-[210px] bg-yellow-100 overflow-auto flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
              </div>

              {
                notificationData.map(data => 
                  <button className="flex w-full items-center border-t-[1px]" key={data.id}>
                    <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                      <p className="mb-1 text-left text-base font-semibold text-gray-900 dark:text-white">
                        {data.value}
                      </p>
                      <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                        {moment(data.createdAt).format("DD/MM/yyyy HH:mm:ss")}
                      </p>
                    </div>
                  </button>
                )
              }

            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        />
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="block w-10 h-10 object-cover rounded-full"
              src={avatar}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex pb-4 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="mt-3 mx-4">
                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm font-bold text-navy-700">
                    👋 Hello, {name}
                  </p>
                  <p className="text-sm font-bold text-green-700">
                    [{role}]
                  </p>
                </div>
              </div>
              <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="mt-3 ml-4 flex flex-col">
                <a
                  href="./profile"
                  className="text-sm text-gray-800 hover:font-medium"
                >
                  Profile Settings
                </a>
                <div
                  onClick={() => onLogoutClick()}
                  className="mt-3 text-sm font-medium text-red-500 hover:font-bold hover:cursor-pointer"
                >
                  Log Out
                </div>
              </div>
            </div>
          }
          classNames={"py-2 top-12 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Breadcrumb;
