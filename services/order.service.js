import myAxios, { wrapperCallApi } from "@/common/myAxios"
import url from "@/common/url"


class OrderService {
    static async getAll() {
        const serviceUrl = url.order.base
        return await wrapperCallApi(
            myAxios.get(serviceUrl)
        )
    }

    static async create(payload) {
        const serviceUrl = url.order.base

        return await wrapperCallApi(
            myAxios.post(
                serviceUrl,
                payload
            )
        )
    }

    static async update(id, payload) {
        const serviceUrl = `${url.user.base}/${id}`
        return await wrapperCallApi(
            myAxios.put(
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