import { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"

class NotificationService {
    static async getAll() {
        return await wrapperCallApi(
            useMyAxios().get(url.notification.base)
        )
    }
}

export default NotificationService