const host = process.env.NEXT_PUBLIC_API_HOST

const url = {
    user: {
        base: `${host}/users`,
        info: `${host}/users/info`
    },
    role: {
        base: `${host}/roles`
    },
    product: {
        base: `${host}/products`,
    },
    order: {
        base: `${host}/orders`,
    },
    category: {
        base: `${host}/categories`,
    },
    worksheet: {
        base: `${host}/timesheet`,
        getAll: `${host}/timesheet/all`,
        getByRole: `${host}/timesheet/timesheet-with-salary`,
        getForSchedule: `${host}/timesheet/timesheet-for-schedule`
    },
    timesheetRegister: {
        getRequestedTimesheets: `${host}/timesheet/register-reference`,
        register: `${host}/timesheet/register-reference`,
        deleteRange: `${host}/timesheet/register-reference/delete-range`
    },
    timesheetScheduler: {
        schedule: `${host}/timesheet/register`,
        getAllScheduled: `${host}/timesheet/register/all`,
    },
    auth: {
        login: `${host}/auth/login`,
        logout: `${host}/auth/logout`,
    },
    attendanceCheck: {
        base: `${host}/attendance-check`,
        checked: `${host}/attendance-check/checked`
    }
}

export default url