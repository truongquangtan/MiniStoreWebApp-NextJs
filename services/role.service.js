import { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"


class RoleService {

    static async getAllRoles() {
        const serviceUrl = url.role.base

        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }
}


export default RoleService