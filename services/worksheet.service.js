import myAxios, { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"


class WorksheetService {
    static async getAll() {
        const serviceUrl = url.worksheet.getAll
        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async getByRole(startDate, dateAddInCount) {
        const serviceUrl = `${url.worksheet.getByRole}?startDate=${startDate}&addIn=${dateAddInCount}`
        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async getForSchedule(startDate, dateAddInCount, roleId) {
        const serviceUrl = `${url.worksheet.getForSchedule}?startDate=${startDate}&addIn=${dateAddInCount}&roleId=${roleId}`

        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async create(payload) {
        const serviceUrl = url.worksheet.base

        return await wrapperCallApi(
            useMyAxios().post(
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
            useMyAxios().delete(
                serviceUrl,
            )
        )
    }

}

export default WorksheetService