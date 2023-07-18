const roleIdConstant = {
    MANAGER: 1,
    SALES: 2,
    GUARD: 3,
}

const localStorageKey = {
    role: 'role',
    token: 'token',
    avatar: 'avatar',
    name: 'name',
    userId: 'userId',
}

const defaultRoute = {
    MANAGER: '/manager/users',
    SALES: '/sales/attendance',
    GUARD: '/guard/attendance',
    UNAUTHENTICATED: '/auth/login',
}

export default {
    roleIdConstant, localStorageKey, defaultRoute
}