import { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"

class AuthService {
    static async login(email, password) {
        const serviceUrl = url.auth.login
        const payload = {
            email: email,
            password: password
        }
        return await wrapperCallApi(useMyAxios().post(serviceUrl, payload))
    }
}

export default AuthService