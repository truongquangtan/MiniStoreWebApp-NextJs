const host = process.env.NEXT_PUBLIC_API_HOST

const url = {
    user: {
        base: `${host}/users`
    },
    role: {
        base: `${host}/roles`
    },
    worksheet: {
        base: `${host}/timesheet`,
        getAll: `${host}/timesheet/all`,
    }
}

export default url