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
}

const defaultRoute = {
    MANAGER: '/manager/users',
    SALES: '/sales/worksheet',
    GUARD: '/guard/worksheet',
    UNAUTHENTICATED: '/auth/login',
}

export default {
    roleIdConstant, localStorageKey, defaultRoute
}