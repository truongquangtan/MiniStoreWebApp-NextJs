import moment from "moment";
import { useEffect, useState } from "react";
import { MdDelete, MdKeyboardArrowDown, MdKeyboardArrowRight, MdOutlineDataExploration, MdScheduleSend } from "react-icons/md";
import WorksheetService from "@/services/worksheet.service";
import { toast } from "react-toastify";
import { IconButton, Tooltip } from "@mui/material";
import Button from "@/components/button";
import { buttonTypes } from "@/common/type";
import TimesheetRegisterService from "@/services/timesheet-register.service";
import Loading from "@/components/loading";
import ModalComponent from "@/components/modal";

// Bug: Sau send request -> load more -> pick chỗ load more không được
// Not implemented: Admin

export default function Index(props) {
  const [isRequestTabOpen, setIsRequestTabOpen] = useState(false)
  const [isTableTabOpen, setIsTableTabOpen] = useState(true)
  const [isModalDeleteActive, setIsModalDeleteActive] = useState(false)
  const [timesheets, setTimesheets] = useState([])

  const [requestedTimesheets, setRequestedTimesheets] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [curEndDate, setCurEndDate] = useState('')

  // The state is a list with the shape: [{date, timesheetsWithSalaryOfDate}]
  const [salaryTimesheets, setSalaryTimesheets] = useState([])

  const fetchTimesheetData = async (startDate, addIn) => {
    const { error, data } = await WorksheetService.getByRole(startDate, addIn)
    if (error) {
      toast.error("Fail to get data")
      return
    }
    setTimesheets(data.timeSheets)

    // Append isSelected field to each data in inner list
    const salaryTimesheetsData = data.timesheetsWithSalary.map(t => {
      t.timesheetData = t.timesheetData.map(v => { return { ...v, isSelected: false } })
      return t
    })
    setSalaryTimesheets([... salaryTimesheetsData])
  }
  const fetchRequestedTimesheet = async () => {
    setIsTableLoading(true)
    const { error, data } = await TimesheetRegisterService.getRequestedTimesheets(moment(new Date()).format("yyyy-MM-DD"), null)
    if (error) {
      toast.error("Fail to get data")
      return
    }
    setRequestedTimesheets([...data])
    setIsTableLoading(false)
  }

  const loadMore7Days = async () => {
    const { error, data } = await WorksheetService.getByRole(curEndDate, 7)
    if (error) {
      toast.error("Fail to get data")
      return
    }

    setCurEndDate(moment(curEndDate).add(7, 'days').format("yyyy-MM-DD"))

    // Append isSelected field to each data in inner list
    const salaryTimesheetsData = data.timesheetsWithSalary.map(t => {
      t.timesheetData = t.timesheetData.map(v => { return { ...v, isSelected: false } })
      return t
    })
    setSalaryTimesheets((current) => {
      const newArr = current.concat(salaryTimesheetsData)
      return [...newArr]
    })
  }
  const clearChoice = () => {
    setSalaryTimesheets(current => {
      const newArr = current.map(row => {
        row.timesheetData.map(cell => {
          cell.isSelected = false
          return cell
        })
        return row
      })
      return [...newArr]
    })
  }
  const sendRequest = async () => {
    const request = []
    for (const row of salaryTimesheets) {
      for (const cell of row.timesheetData) {
        if (cell.isSelected) {
          request.push({
            date: row.date,
            timesheetId: cell.timesheetId
          })
        }
      }
    }
    if (request.length > 0) {
      const { error } = await TimesheetRegisterService.register(request)
      if (error) {
        toast.error("Create request failed")
      }
      toast.success("Create request successfully.")
      fetchTimesheetData(moment(new Date()).format("yyyy-MM-DD"), Math.ceil(moment(curEndDate, "yyyy-MM-DD").diff(moment(new Date()), "d")) + 1)
      fetchRequestedTimesheet()
    }
  }

  const onCellClick = (row, cell) => {
    setSalaryTimesheets(current => {
      const rowData = current.find(v => v.date === row.date)
      const cellData = rowData.timesheetData.find(v => v.timesheetId === cell.timesheetId)
      cellData.isSelected = !cellData.isSelected
      return [...current]
    })
  }

  const onDeleteClick = (id) => {
    setIsModalDeleteActive(true)
    setDeleteId(id)
  }

  const onDeleteConfirm = async () => {
    setIsModalDeleteActive(false)
    const payload = [deleteId]
    const { error } = await TimesheetRegisterService.deleteRange(payload)
    if (error) {
      toast.error("Delete fail")
    }

    toast.success("Delete request successfully")
    fetchTimesheetData(moment(new Date()).format("yyyy-MM-DD"), Math.ceil(moment(curEndDate, "yyyy-MM-DD").diff(moment(new Date()), "d")) + 1)
    fetchRequestedTimesheet()
  }

  useEffect(() => {
    fetchTimesheetData(moment(new Date()).format("yyyy-MM-DD"), 7)
    setCurEndDate(moment(new Date()).add(7, 'days').format("yyyy-MM-DD"))
    fetchRequestedTimesheet()
  }, [])

  return (
    <div>
      {/* Delete Modal */}
      <ModalComponent
        bodyTemplate={(<div>Do you want to delete this request?</div>)}
        buttonsTemplate={(
          <div className="flex items-center justify-end w-full">
            <Button type={buttonTypes.DANGER} onClick={() => onDeleteConfirm()}>Confirm</Button>
            <Button type={buttonTypes.DEFAULT} onClick={() => setIsModalDeleteActive(false)}>Cancel</Button>
          </div>
        )}
        isOpen={isModalDeleteActive}
        onClose={() => setIsModalDeleteActive(false)}
        width={`w-[60vw]`}
        absoluteTop="top-24"
      />
      
      {/* Main contain */}
      <main className="border rounded shadow bg-white p-2">
        <div className="flex items-center justify-between hover:cursor-pointer" onClick={() => setIsRequestTabOpen(!isRequestTabOpen)}>
          <div className="font-bold text-2xl p-2 text-gray-800">Request a timesheet</div>
          <div>
            {
              isRequestTabOpen ? <MdKeyboardArrowDown className="h-12 w-12" /> : <MdKeyboardArrowRight className="h-12 w-12" />
            }
          </div>
        </div>
        <div className={`transition-all duration-500 ${isRequestTabOpen ? 'h-[23rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-8 h-8 grow text-center"></div>
            {timesheets.map(timesheet => (
              <div className="w-12 min-h-8 pb-1 grow text-center" key={timesheet.id}>{timesheet.name}<br />(<span className="font-semibold">{timesheet.timeRange}</span>)</div>
            ))}
          </div>
          <div className="w-full overflow-auto h-64">
            {
              salaryTimesheets.map(salaryTimesheet => (
                <div className="flex items-center gap-1 mb-1" key={salaryTimesheet.date}>
                  <div className="w-8 h-8 grow text-right pr-1 flex items-center justify-end">{moment(salaryTimesheet.date).format("dddd, DD/MM/YYYY")}</div>
                  {salaryTimesheet.timesheetData.map(timesheetCell => (
                    <div
                      key={`${timesheetCell.timesheetId}${salaryTimesheet.date}`}
                      className={`${timesheetCell.isSelected === true ? 'bg-blue-200 hover:bg-red-400' : 'bg-gray-100 hover:bg-blue-200'} ${timesheetCell.isPicked === true ? '!bg-gray-300' : 'hover:cursor-pointer'} w-12 h-8 flex items-center relative justify-center font-sm font-semibold text-center grow`}
                      onClick={() => { if (!timesheetCell.isPicked) { onCellClick(salaryTimesheet, timesheetCell) } }}
                    >
                      {timesheetCell.salary}
                      {timesheetCell.note ?
                        (<Tooltip title={timesheetCell.note} placement="top" arrow>
                          <div className="absolute right-1">
                            <IconButton disableFocusRipple={true} disableRipple={true}>
                              <MdOutlineDataExploration className="h-6 w-6 text-green-700 " />
                            </IconButton>
                          </div>

                        </Tooltip>) : ''}
                      {timesheetCell.isPicked ?
                        (<Tooltip title="You picked it, click to unset" placement="top" arrow>
                          <div className="absolute left-1">
                            <IconButton disableFocusRipple={true} disableRipple={true} onClick={() => onDeleteClick(timesheetCell.registerId)}>
                              <MdScheduleSend className="h-5 w-5 text-blue-700" />
                            </IconButton>
                          </div>

                        </Tooltip>) : ''}
                    </div>
                  ))}
                </div>
              ))
            }
          </div>
          <div className="w-full flex items-center mt-2 justify-between">
            <Button type={buttonTypes.DEFAULT} onClick={() => { loadMore7Days() }}>Load more 7 days</Button>
            <div className="flex items-center gap-2">
              <Button type={buttonTypes.DEFAULT} onClick={() => { clearChoice() }}>Clear</Button>
              <Button type={buttonTypes.PRIMARY} onClick={() => { sendRequest() }}>Send request</Button>
            </div>
          </div>
        </div>
      </main>
      <main className="border rounded shadow bg-white p-2 mt-1">
        <div className="flex items-center justify-between hover:cursor-pointer" onClick={() => setIsTableTabOpen(!isTableTabOpen)}>
          <div className="font-bold text-2xl p-2 text-gray-800">Your requested timesheets</div>
          <div>
            {
              isTableTabOpen ? <MdKeyboardArrowDown className="h-12 w-12" /> : <MdKeyboardArrowRight className="h-12 w-12" />
            }
          </div>
        </div>
        <div className={`transition-all duration-500 ${isTableTabOpen ? 'h-[30rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'}`}>
          {
            isTableLoading ? (
              <Loading size={32} />
            ) : (
              <div className="w-full overflow-auto max-h-[29rem]">
                <ul className="min-w-full text-gray-800 w-max">
                  <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                    <div className="w-[20%] font-medium flex-none">Timesheet Name</div>
                    <div className="w-[10%] font-medium flex-none">Time</div>
                    <div className="w-[15%] font-medium flex-none">Date (dd/MM/yyyy)</div>
                    <div className="w-[10%] font-medium flex-none">Salary</div>
                    <div className="w-[10%] font-medium flex-none">Note</div>
                    <div className="w-[15%] font-medium flex-none">Created At</div>
                  </li>
                  {
                    requestedTimesheets.map(request => (
                      <li
                        key={request.id}
                        className="min-w-full flex space-x-5 w-max border-b rounded py-2 px-5 transition-all"
                      >
                        <div className="w-[20%] flex-none truncate">{request.timeSheet.name}</div>
                        <div className="w-[10%] flex-none truncate">{request.timeSheet.timeRange}</div>
                        <div className="w-[15%] flex-none truncate">{moment(request.date).format("DD/MM/yyyy")}</div>
                        <div className="w-[10%] flex-none truncate">{request.salary}</div>
                        <div className="w-[10%] flex-none truncate">{request.note}</div>
                        <div className="w-[15%] flex-none truncate">{moment(request.createdAt).format("DD/MM/yyyy hh:mm:ss")}</div>
                        <div className="grow text-center">
                          <button className="text-red-600 hover:text-red-700" onClick={() => onDeleteClick(request.id)}>
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    ))
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