import authHelper from "./authHelper";
import constants from "./constants";

let jwtToken = '';
let role = '';
let avatar = '';
let name = '';

// Token
export const setToken = token => {
    jwtToken = token
    authHelper.saveToLocalStorage(constants.localStorageKey.token, token)
}
export const getToken = () => {
    if(jwtToken){
        return jwtToken
    }

    jwtToken = authHelper.getFromLocalStorage(constants.localStorageKey.token)
    return jwtToken
}
export const removeToken = () => {
    jwtToken = ''
    localStorage.removeItem(constants.localStorageKey.token)
}

// Role
export const setRole = data => {
    role = data
    authHelper.saveToLocalStorage(constants.localStorageKey.role, data + "-" + new Date().toString())
}
export const getRole = () => {
    if(role) {
        return role
    }

    const data = authHelper.getFromLocalStorage(constants.localStorageKey.role)
    role = data.split("-")[0]
    return role
}
export const removeRole = () => {
    role = ''
    localStorage.removeItem(constants.localStorageKey.role)
}

// Avatar
export const setAvatar = data => {
    avatar = data
    authHelper.saveToLocalStorage(constants.localStorageKey.avatar, data)
}
export const getAvatar = () => {
    if(avatar) {
        return avatar
    }

    avatar = authHelper.getFromLocalStorage(constants.localStorageKey.avatar)
    return avatar
}
export const removeAvatar = () => {
    avatar = ''
    localStorage.removeItem(constants.localStorageKey.avatar)
}

//Name
export const setName = data => {
    name = data
    localStorage.setItem(constants.localStorageKey.name, data)
}
export const getName = () => {
    if(name) {
        return name
    }

    name = localStorage.getItem(constants.localStorageKey.name) ? localStorage.getItem(constants.localStorageKey.name) : ''
    return name
}
export const removeName = () => {
    name = ''
    localStorage.removeItem(constants.localStorageKey.name)
}

export const removeAllData = () => {
    jwtToken = ''
    avatar = ''
    role = ''
    name = ''
    removeAvatar()
    removeRole()
    removeToken()
    removeName()
}