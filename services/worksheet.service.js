import myAxios, { wrapperCallApi } from "@/common/myAxios"
import url from "@/common/url"


class WorksheetService {
    static async getAll() {
        const serviceUrl = url.worksheet.getAll
        return await wrapperCallApi(
            myAxios.get(serviceUrl)
        )
    }

    static async create(payload) {
        const serviceUrl = url.worksheet.base

        return await wrapperCallApi(
            myAxios.post(
                serviceUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        )
    }

    static async delete(id) {
        const serviceUrl = `${url.worksheet.base}/${id}`
        return await wrapperCallApi(
            myAxios.delete(
                serviceUrl,
            )
        )
    }

}

export default WorksheetService