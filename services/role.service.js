import myAxios from "@/common/myAxios"
import url from "@/common/url"

const getAllRoles = async () => {
    const serviceUrl = url.role.base
    const response = await myAxios.get(serviceUrl)
    return response ? response.data : response
}

export default {
    getAllRoles, 
}