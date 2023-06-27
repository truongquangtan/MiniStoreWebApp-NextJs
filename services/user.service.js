import myAxios, { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"


class UserService {
    static async getAll() {
        const serviceUrl = url.user.base
        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async create(payload) {
        const serviceUrl = url.user.base

        return await wrapperCallApi(
            useMyAxios().post(
                serviceUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
        )
    }

    static async update(id, payload) {
        const serviceUrl = `${url.user.base}/${id}`
        return await wrapperCallApi(
            useMyAxios().put(
                serviceUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
        )
    }

}

export default UserService