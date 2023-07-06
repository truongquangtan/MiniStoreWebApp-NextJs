import { buttonTypes } from "@/common/type";
import Button from "../button";
import { useEffect, useState } from "react";
import Loading from "../loading";
import CheckAttendanceService from "@/services/check-attendance.service";
import { toast } from "react-toastify";
import moment from "moment";
import UserService from "@/services/user.service";
import { formatCurrency } from "@/common/currencyFormatHelper";

export default function AttendancePage(props) {
  const [isTableUnCheckedLoading, setIsTableUnCheckedLoading] = useState(false)
  const [isTableCheckedLoading, setIsTableCheckedLoading] = useState(false)

  const [checkedTimesheets, setCheckedTimesheets] = useState([])
  const [uncheckedTimesheets, setUncheckedTimesheets] = useState([])
  const [user, setUser] = useState(undefined)

  const fetchUncheckedTimesheets = async () => {
    setIsTableUnCheckedLoading(true)
    const { error, data } = await CheckAttendanceService.getScheduledTime()
    if (error) {
      toast.error("Error when fetching data")
      return
    }

    setUncheckedTimesheets(data)
    setIsTableUnCheckedLoading(false)
  }

  const fetchCheckedTimesheets = async () => {
    setIsTableCheckedLoading(true)
    const { error, data } = await CheckAttendanceService.getAllCheckedAttendance()
    if (error) {
      toast.error("Error when fetching data")
      return
    }

    setCheckedTimesheets(data)
    setIsTableCheckedLoading(false)
  }

  const fetchUser = async () => {
    const {error, data} = await UserService.getInfo()
    if (error) {
      toast.error("Error when fetching data")
      return
    }

    setUser(data)
  }

  useEffect(() => {
    fetchUncheckedTimesheets()
    fetchCheckedTimesheets()
    fetchUser()
  }, [])

  const checkAttendance = async (registrationId) => {
    const {error} = await CheckAttendanceService.checkAttendance(registrationId)
    if (error) {
      toast.error("Cannot check the attendance")
      return
    }
    toast.success("Check attendance successfully")

    fetchCheckedTimesheets()
    fetchUncheckedTimesheets()
    fetchUser()
  }

  return (
    <div>
      <main className="border rounded shadow bg-white p-2">
      <div className="font-bold text-2xl p-2 text-gray-800 mb-3">On-going worksheet</div>
        <div className="transition-all duration-500">
          {
            isTableUnCheckedLoading ? (
              <Loading size={32} />
            ) : (
              <div className="w-full overflow-auto max-h-[29rem]">
                <ul className="min-w-full text-gray-800 w-max">
                  <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                    <div className="w-[15%] font-medium flex-none">Timesheet Name</div>
                    <div className="w-[15%] font-medium flex-none">Start At</div>
                    <div className="w-[15%] font-medium flex-none">End At</div>
                    <div className="w-[10%] font-medium flex-none">Salary</div>
                    <div className="w-[10%] font-medium flex-none">Status</div>
                    <div className="font-medium flex-none">Check</div>
                  </li>
                  {
                    uncheckedTimesheets && uncheckedTimesheets.length > 0 ?
                      uncheckedTimesheets.map(timesheet => (
                        <li
                          key={timesheet.registrationId}
                          className="min-w-full flex items-center space-x-5 w-max border-b rounded py-2 px-5 transition-all"
                        >
                          <div className="w-[15%] flex-none truncate">{timesheet.timeSheet.name}</div>
                          <div className="w-[15%] flex-none truncate">{moment(timesheet.startTime).format("DD/MM/yyyy HH:mm:ss")}</div>
                          <div className="w-[15%] flex-none truncate">{moment(timesheet.endTime).format("DD/MM/yyyy HH:mm:ss")}</div>
                          <div className="w-[10%] flex-none truncate">{formatCurrency(timesheet.salary)}</div>
                          {timesheet.isChecked ? (
                            <div className="w-[10%] flex-none truncate text-green-600 font-semibold">ATTENTED</div>
                          ) : (
                            <>
                              <div className="w-[10%] flex-none truncate text-gray-700 font-semibold">NOT YET</div>
                              <div className="flex-none truncate"><Button type={buttonTypes.PRIMARY} onClick={() => { checkAttendance(timesheet.registrationId) }}>Check Attendance</Button></div>
                            </>
                          )}
                        </li>
                      ))
                      : <div className="text-gray-500 font-semibold w-full flex justify-center">No data</div>
                  }
                </ul>
              </div>
            )
          }
        </div>
      </main>
      <main className="border rounded shadow bg-white p-2 mt-4">
        <div className="flex items-center justify-between">
          <div className="font-bold text-2xl p-2 text-gray-800 mb-3">Attendance History</div>
          <div className="font-semibold px-8 py-1 bg-blue-50 text-blue-700 rounded-md">Your current salary this month: {user?.salary ? formatCurrency(user?.salary) : 0}</div>
        </div>
        <div className="transition-all duration-500">
          {
            isTableCheckedLoading ? (
              <Loading size={32} />
            ) : (
              <div className="w-full overflow-auto max-h-[29rem]">
                <ul className="min-w-full text-gray-800 w-max">
                  <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                    <div className="w-[15%] font-medium flex-none">Timesheet Name</div>
                    <div className="w-[15%] font-medium flex-none">Start At</div>
                    <div className="w-[15%] font-medium flex-none">End At</div>
                    <div className="w-[10%] font-medium flex-none">Salary</div>
                    <div className="w-[10%] font-medium flex-none">Status</div>
                    <div className="w-[15%] font-medium flex-none">Check At</div>
                  </li>
                  {
                    checkedTimesheets && checkedTimesheets.length > 0 ?
                      checkedTimesheets.map(timesheet => (
                        <li
                          key={timesheet.registrationId}
                          className="min-w-full flex space-x-5 w-max border-b rounded py-2 px-5 transition-all"
                        >
                          <div className="w-[15%] flex-none truncate">{timesheet.timeSheet.name}</div>
                          <div className="w-[15%] flex-none truncate">{moment(timesheet.startTime).format("DD/MM/yyyy HH:mm:ss")}</div>
                          <div className="w-[15%] flex-none truncate">{moment(timesheet.endTime).format("DD/MM/yyyy HH:mm:ss")}</div>
                          <div className="w-[10%] flex-none truncate">{formatCurrency(timesheet.salary)}</div>
                          {timesheet.isChecked ? (
                            <div className="w-[10%] flex-none truncate text-green-600 font-semibold">ATTENTED</div>
                          ) : (
                            <div className="w-[10%] flex-none truncate text-red-700 font-semibold">{timesheet.checkStatus}</div>
                          )}
                          <div className="w-[15%] flex-none truncate">
                            {timesheet.checkData ? moment(timesheet.checkData?.checkAt).format("DD/MM/yyyy HH:mm:ss") : ''}
                          </div>
                        </li>
                      ))
                      : <div className="text-gray-500 font-semibold w-full flex justify-center">No data</div>
                  }
                </ul>
              </div>
            )
          }
        </div>
      </main>
    </div>
  )
}