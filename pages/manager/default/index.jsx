import { Scheduler } from "@aldabil/react-scheduler";
export default function Index() {
    const event = [
        {
          event_id: 1,
          title: "Event 1",
          start: new Date(new Date(new Date().setHours(9)).setMinutes(0)),
          end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
          disabled: false,
          draggable: false,
          admin_id: [1, 2, 3, 4]
        },
        {
          event_id: 2,
          title: "Event 2",
          start: new Date(2023, 5, 15, 23, 0, 0),
          end: new Date(2023, 5, 15, 24, 0, 0),
          admin_id: 2,
          draggable: false,
          color: "#50b500"
        },
        {
          event_id: 5,
          title: "Event 2",
          start: new Date(2023, 5, 15, 18, 0, 0),
          end: new Date(2023, 5, 15, 24, 0, 0),
          admin_id: 2,
          draggable: false,
          color: "#50b500"
        },
        {
          event_id: 6,
          title: "Event 2",
          start: new Date(2023, 5, 16, 0, 0, 0),
          end: new Date(2023, 5, 16, 6, 0, 0),
          admin_id: 2,
          draggable: false,
          color: "#50b500"
        },
        {
          event_id: 3,
          title: "Event 3",
          start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
          end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
          admin_id: 2,
          draggable: false,
          
        },
    ]

    const weekConfig = {
      startHour: 0, 
      endHour: 24,
      step: 180,
    }

    return (
        <div className="h-[100vh] relative z-[1]">
            <Scheduler events={event} week={weekConfig} day={null} month={null} editable={false} deletable={false} hourFormat="24" />
        </div>
    )
}