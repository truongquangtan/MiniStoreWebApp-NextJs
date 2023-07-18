export const host = process.env.NEXT_PUBLIC_API_HOST
const apiHost = `${host}/api`

const url = {
    user: {
        base: `${apiHost}/users`,
        info: `${apiHost}/users/info`
    },
    role: {
        base: `${apiHost}/roles`
    },
    product: {
        base: `${apiHost}/products`,
    },
    order: {
        base: `${apiHost}/orders`,
    },
    category: {
        base: `${apiHost}/categories`,
    },
    worksheet: {
        base: `${apiHost}/timesheet`,
        getAll: `${apiHost}/timesheet/all`,
        getByRole: `${apiHost}/timesheet/timesheet-with-salary`,
        getForSchedule: `${apiHost}/timesheet/timesheet-for-schedule`
    },
    timesheetRegister: {
        getRequestedTimesheets: `${apiHost}/timesheet/register-reference`,
        register: `${apiHost}/timesheet/register-reference`,
        deleteRange: `${apiHost}/timesheet/register-reference/delete-range`
    },
    timesheetScheduler: {
        schedule: `${apiHost}/timesheet/register`,
        getAllScheduled: `${apiHost}/timesheet/register/all`,
    },
    auth: {
        login: `${apiHost}/auth/login`,
        logout: `${apiHost}/auth/logout`,
    },
    attendanceCheck: {
        base: `${apiHost}/attendance-check`,
        checked: `${apiHost}/attendance-check/checked`
    },
    notification: {
        base: `${apiHost}/notifications`,
        signalR: `${host}/signalR/notification`
    },
}

export default url