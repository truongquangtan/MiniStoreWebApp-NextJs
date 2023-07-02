import { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"

class ProductService {
    static async getAll() {
        return await wrapperCallApi(
            useMyAxios().get(url.product.base)
        )
    }


    static async create(payload) {
        const serviceUrl = url.product.base

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
        const serviceUrl = `${url.product.base}/${id}`

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
    static async delete(id) {
        const serviceUrl = `${url.product.base}/${id}`

        return await wrapperCallApi(
            useMyAxios().delete(serviceUrl)
        )
    }
}

export default ProductService