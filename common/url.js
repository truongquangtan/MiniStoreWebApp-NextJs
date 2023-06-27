const host = process.env.NEXT_PUBLIC_API_HOST

const url = {
    user: {
        base: `${host}/users`
    },
    role: {
        base: `${host}/roles`
    },
    product: {
        base: `${host}/products`,
    },
    category: {
        base: `${host}/categories`,
    },
    worksheet: {
        base: `${host}/timesheet`,
        getAll: `${host}/timesheet/all`,
        getByRole: `${host}/timesheet/timesheet-with-salary`
    },
    timesheetRegister: {
        getRequestedTimesheets: `${host}/timesheet/register-reference`,
        register: `${host}/timesheet/register-reference`,
        deleteRange: `${host}/timesheet/register-reference/delete-range`
    },
    auth: {
        login: `${host}/auth/login`,
        logout: `${host}/auth/logout`,
    }
}

export default url