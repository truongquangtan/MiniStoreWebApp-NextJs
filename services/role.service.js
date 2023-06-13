import myAxios, { wrapperCallApi } from "@/common/myAxios"
import url from "@/common/url"


class RoleService {

    static async getAllRoles() {
        const serviceUrl = url.role.base

        return await wrapperCallApi(
            myAxios.get(serviceUrl)
        )
    }
}


export default RoleService