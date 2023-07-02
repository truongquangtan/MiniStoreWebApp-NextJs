import { useMyAxios, wrapperCallApi } from "@/common/myAxios"
import url from "@/common/url"


class OrderService {
    static async getAll() {
        const serviceUrl = url.order.base
        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async create(payload) {
        const serviceUrl = url.order.base

        return await wrapperCallApi(
            useMyAxios().post(
                serviceUrl,
                payload
            )
        )
    }

    static async delete(id) {
        const serviceUrl = `${url.order.base}/${id}`

        return await wrapperCallApi(
            useMyAxios().delete(serviceUrl)
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

export default OrderService