import CryptoJS from "crypto-js"

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY

const encryptData = data => {
    return CryptoJS.AES.encrypt(data, encryptionKey).toString()
}
const decryptData = encryptedData => {
    return CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(CryptoJS.enc.Utf8)
}

const saveToLocalStorage = (key, rawValue) => {
    const encryptedData = encryptData(rawValue)
    localStorage.removeItem(key)
    localStorage.setItem(key, encryptedData)
}
const getFromLocalStorage = (key) => {
    const encryptedData = localStorage.getItem(key)
    if(encryptedData) {
        const decryptedData = decryptData(encryptedData)
        return decryptedData
    }
    return ''
}

export default {
    saveToLocalStorage, getFromLocalStorage
}