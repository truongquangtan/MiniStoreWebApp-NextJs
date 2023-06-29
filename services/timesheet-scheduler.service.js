import myAxios, { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"


class TimesheetSchedulerService {
    static async getScheduledTimesheets(startDate, endDate) {
        const serviceUrl = `${url.timesheetScheduler.getAllScheduled}?startDate=${startDate ? startDate : ''}&endDate=${endDate ? endDate: ''}`

        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async scheduler(payload) {
        const serviceUrl = url.timesheetScheduler.schedule

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
    static async delete(scheduleId) {
        const serviceUrl = `${url.timesheetScheduler.schedule}/${scheduleId}`
        return await wrapperCallApi(
            useMyAxios().delete(
                serviceUrl
            )
        )
    }

}

export default TimesheetSchedulerService