
const decodeJwt = (token) => {
    try {
        const [header, payload] = token.split('.')
        return JSON.parse(atob(payload))
    } catch {
        return false
    }
}

const getToken = () => {
    return localStorage.getItem('accessToken') || false
}

export {
    decodeJwt,
    getToken
}

