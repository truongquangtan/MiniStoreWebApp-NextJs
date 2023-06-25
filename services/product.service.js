import myAxios, { wrapperCallApi } from "@/common/myAxios"
import url from "@/common/url"

class ProductService {
    static async getAll() {
        return await wrapperCallApi(
            myAxios.get(url.product.base)
        )
    }


    static async create(payload) {
        const serviceUrl = url.product.base

        return await wrapperCallApi(
            myAxios.post(
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
    static async delete(id) {
        const serviceUrl = `${url.product.base}/${id}`

        return await wrapperCallApi(
            myAxios.delete(serviceUrl)
        )
    }
}

export default ProductService