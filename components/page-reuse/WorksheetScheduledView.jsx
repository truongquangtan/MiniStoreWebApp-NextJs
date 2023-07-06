import TimesheetSchedulerService from "@/services/timesheet-scheduler.service";
import { Scheduler } from "@aldabil/react-scheduler";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function WorksheetScheduledView(props) {
    const [schedulerData, setSchedulerData] = useState([])

    const fetchSchedulerData = async () => {
        const {error, data} = await TimesheetSchedulerService.getScheduledTimesheetsOfUser(moment(new Date()).format("yyyy-MM-DD"), null)
        if(error) {
            toast.error("Error when fetch data")
            return
        }

        const reshapedData = data.map(d => {
            return {
                event_id: d.intId,
                title: d.timesheetName,
                start: new Date(d.start),
                end: new Date(d.end),
                draggable: false,
            }
        })
        setSchedulerData(reshapedData)
    }

    useEffect(() => {
        fetchSchedulerData()
    }, [])

    return (
        schedulerData && schedulerData.length > 0 ? <WorksheetTableView schedulerData={schedulerData}/> : <div>No scheduled timesheet</div>
    )
}

const WorksheetTableView = ({schedulerData}) => {
    const weekConfig = {
      startHour: 0, 
      endHour: 24,
      step: 180,
    }

    return (
        <Scheduler
            events={schedulerData}
            week={weekConfig}
            day={null}
            month={null}
            editable={false}
            deletable={false}
            hourFormat="24"
            onEventClick={null}
            customEditor={(scheduler) => scheduler.close()}
        />
    )
}