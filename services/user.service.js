import url from "@/common/url"
import myAxios from "@/common/myAxios"

const getAll = async () => {
    const serviceUrl = url.user.base
    const response = await myAxios.get(serviceUrl)
    return response ? response.data : response
}

const post = async (payload) => {
    const serviceUrl = url.user.base
    const response = await myAxios.post(serviceUrl, payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response ? response.data : response
}

const put = async (id, payload) => {
    const serviceUrl = `${url.user.base}/${id}`
    const response = await myAxios.put(serviceUrl, payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response ? response.data : response
}

export default {
    getAll, post, put
}