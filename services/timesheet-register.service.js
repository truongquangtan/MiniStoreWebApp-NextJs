import myAxios, { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"


class TimesheetRegisterService {
    static async getRequestedTimesheets(startDate, endDate) {
        const serviceUrl = `${url.timesheetRegister.getRequestedTimesheets}?startDate=${startDate ? startDate : ''}&endDate=${endDate?endDate:''}`

        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async register(payload) {
        const serviceUrl = url.timesheetRegister.register

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

    // accept list of string id
    static async deleteRange(listOfIdToDelete) {
        const payload = {
            items: listOfIdToDelete
        }
        const serviceUrl = `${url.timesheetRegister.deleteRange}`
        return await wrapperCallApi(
            useMyAxios().post(
                serviceUrl,
                payload
            )
        )
    }

}

export default TimesheetRegisterService