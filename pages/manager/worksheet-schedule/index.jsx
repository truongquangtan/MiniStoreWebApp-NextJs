import moment from "moment";
import { useEffect, useState } from "react";
import { MdOutlineAddTask, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowRight, MdFlag, MdPersonAdd } from "react-icons/md";
import WorksheetService from "@/services/worksheet.service";
import { toast } from "react-toastify";
import { Avatar, AvatarGroup, FormLabel, IconButton, Tooltip } from "@mui/material";
import Button from "@/components/button";
import { buttonTypes } from "@/common/type";
import TimesheetRegisterService from "@/services/timesheet-register.service";
import Loading from "@/components/loading";
import ModalComponent from "@/components/modal";
import MultiSelect from "@/components/multi-select";
import Label from "@/components/form/label";
import TextInput from "@/components/form/text_input";
import SelectBox from "@/components/form/select_box";
import RoleService from "@/services/role.service";
import UserService from "@/services/user.service";
import TimesheetSchedulerService from "@/services/timesheet-scheduler.service";

export default function Index(props) {
  const [isRequestTabOpen, setIsRequestTabOpen] = useState(true)
  const [isTableTabOpen, setIsTableTabOpen] = useState(false)
  const [isModalTabOpen, setIsModalTabOpen] = useState(false)
  const [isModalDeleteActive, setIsModalDeleteActive] = useState(false)
  const [timesheets, setTimesheets] = useState([])

  const [scheduledTimesheets, setScheduledTimesheets] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [curEndDate, setCurEndDate] = useState(moment(new Date()).add(7, 'days').format("yyyy-MM-DD"))

  // The state is a list with the shape: [{date, timesheetsWithSalaryOfDate}]
  const [salaryTimesheets, setSalaryTimesheets] = useState([])

  const [selectedTimesheet, setSelectedTimesheet] = useState(undefined)
  const [usersPicked, setUsersPicked] = useState([])
  const [isModalScheduleActive, setIsModalScheduleActive] = useState(false)

  const [curRole, setCurRole] = useState('')
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([])

  const [isInAddProcess, setIsInAddProcess] = useState(true)

  useEffect(() => {
    fetchRoles()
    curRole?.id && fetchTimesheetData(moment(new Date()).format("yyyy-MM-DD"), 7)
    setCurEndDate(moment(new Date()).add(7, 'days').format("yyyy-MM-DD"))
    fetchScheduledTimesheet(moment(new Date()).format("yyyy-MM-DD"), null)
  }, [])
  useEffect(() => {
    if(curRole?.id){
      fetchAllUsersOfRole()
      fetchTimesheetData(moment(new Date()).format("yyyy-MM-DD"), Math.ceil(moment(curEndDate, "yyyy-MM-DD").diff(moment(new Date()), "d")) + 1)
    }
  }, [curRole])

  const fetchTimesheetData = async (startDate, addIn) => {
    const { error, data } = await WorksheetService.getForSchedule(startDate, addIn, curRole.id)
    if (error) {
      toast.error("Fail to get data")
      return
    }
    setTimesheets(data.timeSheets)

    setSalaryTimesheets(data.timesheetsWithSalary)
  }

  const fetchScheduledTimesheet = async (startDate, endDate) => {
    const {error, data} = await TimesheetSchedulerService.getScheduledTimesheets(startDate, endDate)
    if(error){
      toast.error("Fail to get data")
      return
    }

    setScheduledTimesheets(data)
  }

  const fetchRoles = async () => {
    const { error, data } = await RoleService.getAllRoles()
    if (error) {
      toast.error("Fail to get data")
      return
    }
    setRoles(data)
    setCurRole(data[0])
  }
  const fetchAllUsersOfRole = async () => {
    const { error, data } = await UserService.getAllByRoleId(curRole.id)
    if (error) {
      toast.error("Fail to get data")
      return
    }
    setUsers(data.map(d => {return {
      id: d.id,
      label: d.fullname,
      image: d.avatar,
    }}))
  }

  const loadMore7Days = async () => {
    const { error, data } = await WorksheetService.getForSchedule(curEndDate, 7, curRole.id)
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

  const onCellClick = (row, cell) => {
    if(cell?.isScheduled === true){
      setIsInAddProcess(false)
    } else {
      setIsInAddProcess(true)
    }

    setIsModalScheduleActive(true)
    const cellData = { ...cell, date: row.date }
    setSelectedTimesheet(cellData)
    setUsersPicked(cellData.registerData ? cellData.registerData : [])
    if(cellData.scheduleData.length > 0){
      setSelectedUserIds(cellData.scheduleData.map(d => d.userId))
    } else {
      setSelectedUserIds([])
    }
  }

  const onAssignClick = (userId) => {
    if(selectedUserIds.indexOf(userId) === -1) {
      selectedUserIds.push(userId)
      setSelectedUserIds([...selectedUserIds])
    }
  }

  const onScheduleConfirm = async () => {
    // Validation
    if(selectedUserIds.length == 0){
      return
    }

    //Prepare Data
    const payload = []
    for(const userId of selectedUserIds){
      const data = {
        timesheetId: selectedTimesheet.timesheetId,
        userId: userId,
        salary: selectedTimesheet.salary,
        date: selectedTimesheet.date
      }
      payload.push(data)
    }

    //Call API
    if(isInAddProcess) {
      const {error} = await TimesheetSchedulerService.scheduler(payload)
      if(error){
        toast.error("Cannot register now, try again later")
      } else {
        toast.success("Schedule the worksheet successfully.")
      }
    } else {
      const updatePayload = {
        timesheetId: selectedTimesheet.timesheetId,
        userIds: selectedUserIds,
        salary: selectedTimesheet.salary,
        date: selectedTimesheet.date,
      }
      const {error} = await TimesheetSchedulerService.updateScheduler(updatePayload)
      if(error){
        toast.error("Cannot update now, try again later")
      } else {
        toast.success("Update the worksheet successfully.")
      }
    }
    

    //Wrap up, re-fetch the data
    setIsModalScheduleActive(false)
    setSelectedUserIds([])
    setSelectedTimesheet(undefined)

    fetchTimesheetData(moment(new Date()).format("yyyy-MM-DD"), Math.ceil(moment(curEndDate, "yyyy-MM-DD").diff(moment(new Date()), "d")) + 1)
    fetchScheduledTimesheet(moment(new Date()).format("yyyy-MM-DD"), null)
  }

  const onDeleteClick = (id) => {
    setIsModalDeleteActive(true)
    setDeleteId(id)
  }

  const onDeleteConfirm = async () => {
    setIsModalDeleteActive(false)
    const { error } = await TimesheetSchedulerService.delete(deleteId)
    if (error) {
      toast.error("Delete fail")
    }

    toast.success("Delete request successfully")
    fetchTimesheetData(moment(new Date()).format("yyyy-MM-DD"), Math.ceil(moment(curEndDate, "yyyy-MM-DD").diff(moment(new Date()), "d")) + 1)
    fetchScheduledTimesheet(moment(new Date()).format("yyyy-MM-DD"), null)
  }

  const getListOfNameRegistered = (timesheetCell) => {
    let stringRepresented = `Users register this timesheet ${timesheetCell.registerData.length > 1 ? 'are' : 'is'}: `
    for (let i = 0; i < timesheetCell.registerData.length; i++) {
      const data = timesheetCell.registerData[i].userName
      stringRepresented += data
      if (i != timesheetCell.registerData.length - 1) {
        stringRepresented += ", "
      }
    }
    return stringRepresented
  }
  const getListOfNameScheduled = (timesheetCell) => {
    let stringRepresented = "The timesheet is schedule for: "
    for (let i = 0; i < timesheetCell.scheduleData.length; i++) {
      const data = timesheetCell.scheduleData[i].userName
      stringRepresented += data
      if (i != timesheetCell.registerData.length - 1) {
        stringRepresented += ", "
      }
    }
    return stringRepresented
  }

  const schedulerModalJSXBody = () => {
    return (
      <div>
        {/* Schedule Section */}
        <div className="font-bold text-xl pb-4 text-gray-800">Schedule this timesheet for: </div>
        <MultiSelect labelText="Users" options={users} selectedIds={selectedUserIds} setSelectedIds={setSelectedUserIds}/>
        {/* -- Schedule Section -- */}
        {/* Information Section */}
        <div className="flex mt-3 items-center justify-between hover:cursor-pointer" onClick={() => setIsModalTabOpen(!isModalTabOpen)}>
          <div className="font-bold text-xl pb-4 text-gray-800">Timesheet Information</div>
          <div>
            {
              isModalTabOpen ? <MdKeyboardArrowDown className="h-8 w-8" /> : <MdKeyboardArrowRight className="h-8 w-8" />
            }
          </div>
        </div>
        <div className={`w-full rounded-md bg-gray-50 border-[1px] transition-all flex flex-col justify-between duration-500 ${isModalTabOpen ? 'h-[16rem] opacity-1 mb-3' : 'h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col overflow-hidden px-2 space-y-2 py-3 px-4">
            <div className="w-full space-y-2">
              <Label forField="Name">Name</Label>
              <TextInput
                id="Name"
                value={selectedTimesheet?.name}
                name="Name"
                readOnly
              />
            </div>
            <div className="w-full flex items-center justify-between gap-8">
              <div className="w-full space-y-2">
                <Label forField="Date">Date (dd/MM/yyyy)</Label>
                <TextInput
                  id="Date"
                  value={selectedTimesheet?.date ? moment(selectedTimesheet.date).format("DD/MM/yyyy") : '/'}
                  name="Date"
                  readOnly
                />
              </div>
              <div className="w-full space-y-2">
                <Label forField="TimeRange">Time Range</Label>
                <TextInput
                  id="TimeRange"
                  value={`${selectedTimesheet?.startTime} - ${selectedTimesheet?.endTime}`}
                  name="TimeRange"
                  readOnly
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-8">
              <div className="w-full space-y-2">
                <Label forField="Salary">Salary</Label>
                <TextInput
                  id="Salary"
                  value={selectedTimesheet?.salary}
                  name="Salary"
                  readOnly
                />
              </div>
              <div className="w-full space-y-2">
                <Label forField="Note">Note</Label>
                <TextInput
                  id="Note"
                  value={selectedTimesheet?.note}
                  name="Note"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        {/* -- Information Section -- */}

        {/* Table Section */}
        <div className={`font-bold text-xl pb-4 ${isModalTabOpen && 'border-t-[2px] pt-3'} text-gray-800`}>User Requested</div>
        <div className="w-full overflow-auto max-h-[15rem] bg-gray-50">
          <ul className="w-full text-gray-800">
            <li className="w-full flex space-x-5 border-b py-2 px-5">
              <div className="w-[10%] font-medium flex-none">Avatar</div>
              <div className="w-[50%] font-medium flex-none">Name</div>
              <div className="w-[20%] font-medium flex-none">Request Time</div>
              <div className="font-medium flex-none">Action</div>
            </li>
            {
              selectedTimesheet?.registerData && selectedTimesheet.registerData.map(data => (
                <li
                  key={data.id}
                  className="min-w-full flex space-x-5 w-max border-b rounded py-1 px-5 transition-all"
                >
                  <div className="w-[10%] flex items-center truncate"><Avatar alt="avt" src={data.avatar} /></div>
                  <div className="w-[50%] flex items-center truncate">{data.userName}</div>
                  <div className="w-[20%] flex items-center truncate">{moment(data.requestAt).format("DD/MM/yyyy hh:mm:ss")}</div>
                  <div className="w-[20%] flex items-center justify-center truncate p-1">
                    <IconButton disableFocusRipple={true} disableRipple={true} onClick={() => onAssignClick(data.userId)}>
                      <MdPersonAdd className="w-8 h-8 text-green-600" />
                    </IconButton>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
        {/* -- Table Section -- */}
      </div>
    )
  }

  return (
    <div>
      {/* Delete Modal */}
      <ModalComponent
        bodyTemplate={(<div>Do you want to delete this schedule?</div>)}
        headerName="Delete confirm"
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

      {/* Schedule Modal */}
      <ModalComponent
        isOpen={isModalScheduleActive}
        onClose={() => setIsModalDeleteActive(false)}
        width={`w-[60vw]`}
        absoluteTop="top-24"
        bodyTemplate={schedulerModalJSXBody()}
        headerName="Schedule Modal"
        buttonsTemplate={(
          <div className="flex items-center justify-end w-full">
            {isInAddProcess ? <Button type={buttonTypes.PRIMARY} onClick={() => onScheduleConfirm()}>Confirm</Button>
                            : <Button type={buttonTypes.PRIMARY} onClick={() => onScheduleConfirm()}>Update</Button>}
            <Button type={buttonTypes.DEFAULT} onClick={() => setIsModalScheduleActive(false)}>Cancel</Button>
          </div>
        )}
      />

      {/* Main Content | First TAB */}
      <main className="border rounded shadow bg-white p-2">
        <div className="flex items-center justify-between hover:cursor-pointer" onClick={() => setIsRequestTabOpen(!isRequestTabOpen)}>
          <div className="font-bold text-2xl p-2 text-gray-800">Schedule a timesheet</div>
          <div>
            {
              isRequestTabOpen ? <MdKeyboardArrowDown className="h-12 w-12" /> : <MdKeyboardArrowRight className="h-12 w-12" />
            }
          </div>
        </div>
        <div className={`transition-all flex flex-col justify-between duration-500 ${isRequestTabOpen ? 'h-[30rem] opacity-1 p-2' : 'h-0 opacity-0 overflow-hidden'}`}>
          {/* Content div */}
          <div className="w-full">
            {/* Header row */}
            <div className="flex items-center gap-1 mb-1">
              <div className="w-8 h-8 grow text-center"></div>
              {timesheets.map(timesheet => (
                <div className="w-12 min-h-8 pb-1 grow text-center" key={timesheet.id}>{timesheet.name}<br />(<span className="font-semibold">{timesheet.timeRange}</span>)</div>
              ))}
            </div>
            {/* -- Header row */}

            {/* Cell row */}
            {isTableLoading ? (<Loading size={32} />) : (<div className="w-full overflow-auto h-64">
              {
                salaryTimesheets.map(salaryTimesheet => (
                  <div className="flex items-center gap-1 mb-1" key={salaryTimesheet.date}>
                    <div className="w-8 h-8 grow text-right pr-1 flex items-center justify-end">{moment(salaryTimesheet.date).format("dddd, DD/MM/YYYY")}</div>
                    {salaryTimesheet.timesheetData.map(timesheetCell => (
                      <div
                        key={`${timesheetCell.timesheetId}${salaryTimesheet.date}`}
                        className={`${timesheetCell.isScheduled ? 'bg-green-300 hover:bg-green-500' : 'bg-gray-100 hover:bg-blue-200'} hover:cursor-pointer w-12 h-8 flex items-center relative justify-center font-sm font-semibold text-center grow`}
                        onClick={() => { onCellClick(salaryTimesheet, timesheetCell) }}
                      >
                        {<AvatarGroup max={5}>
                          {
                            timesheetCell.scheduleData && timesheetCell.scheduleData.length > 0 ?
                            timesheetCell.scheduleData?.map(d => <Avatar key={d.id} alt="avt" src={d.avatar} sx={{ width: 20, height: 20 }} />) :
                            timesheetCell.registerData?.map(d => <Avatar key={d.id} alt="avt" src={d.avatar} sx={{ width: 20, height: 20 }} />)
                          }
                        </AvatarGroup>}
                        {
                          timesheetCell.isScheduled === true ?
                          (<Tooltip title={getListOfNameScheduled(timesheetCell)} placement="top" arrow>
                            <div className="absolute right-1">
                              <IconButton disableFocusRipple={true} disableRipple={true}>
                                <MdOutlineAddTask className="h-4 w-4 text-green-700 " />
                              </IconButton>
                            </div>
                          </Tooltip>) :
                          timesheetCell.isPicked === true ?
                            (<Tooltip title={getListOfNameRegistered(timesheetCell)} placement="top" arrow>
                              <div className="absolute right-1">
                                <IconButton disableFocusRipple={true} disableRipple={true}>
                                  <MdFlag className="h-4 w-4 text-blue-700 " />
                                </IconButton>
                              </div>

                            </Tooltip>) : ''
                        }
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>)}
            {/* -- Cell row */}
          </div>
          {/* --Content div-- */}

          {/* Button div */}
          <div className="w-full flex items-center mt-2 gap-3">
            <SelectBox options={roles} selected={curRole} setSelected={setCurRole} width={20} onOptionClick={() => {}}/>
            <Button type={buttonTypes.DEFAULT} onClick={() => { loadMore7Days() }}>Load more 7 days</Button>
          </div>
          {/* --Button div-- */}
        </div>
      </main>
      {/* Main Content | First TAB */}

      {/* Main Content | Second TAB */}
      <main className="border rounded shadow bg-white p-2 mt-1">
        {/* Header */}
        <div className="flex items-center justify-between hover:cursor-pointer" onClick={() => setIsTableTabOpen(!isTableTabOpen)}>
          <div className="font-bold text-2xl p-2 text-gray-800 flex items-center">
          <p className="">Timesheets scheduled for</p>
            {/* Button div */}
          <div className="flex items-center mt-2 ml-3 gap-3">
            <SelectBox options={roles} selected={curRole} setSelected={setCurRole} width={20} onOptionClick={() => {}}/>
          </div>
          {/* --Button div-- */}
          </div>
          <div>
            {
              isTableTabOpen ? <MdKeyboardArrowDown className="h-12 w-12" /> : <MdKeyboardArrowRight className="h-12 w-12" />
            }
          </div>
        </div>
        {/* -- Header -- */}

        

        {/* Table */}
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
                    <div className="w-[20%] font-medium flex-none">Schedule for users</div>
                    <div className="w-[10%] font-medium flex-none">Salary</div>
                    <div className="w-[10%] font-medium flex-none">Created At</div>
                  </li>
                  {
                    curRole && scheduledTimesheets.find(d => d.roleId == curRole.id)?.registrations.map(schedule => (
                      <li
                        key={schedule.id}
                        className="min-w-full flex space-x-5 w-max border-b rounded py-2 px-5 transition-all"
                      >
                        <div className="w-[20%] flex-none truncate">{schedule.timeSheet.name}</div>
                        <div className="w-[10%] flex-none truncate">{schedule.timeSheet.timeRange}</div>
                        <div className="w-[15%] flex-none truncate">{moment(schedule.date).format("DD/MM/yyyy")}</div>
                        <div className="w-[20%] flex-none truncate">{schedule.user.fullname}</div>
                        <div className="w-[10%] flex-none truncate">{schedule.salary}</div>
                        <div className="w-[10%] flex-none truncate">{moment(schedule.createdAt).format("DD/MM/yyyy hh:mm:ss")}</div>
                        <div className="grow text-center">
                          <button className="text-red-600 hover:text-red-700" onClick={() => onDeleteClick(schedule.id)}>
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
        {/* -- Table -- */}
      </main>
      {/* Main Content | Second TAB */}
    </div>
  )
}