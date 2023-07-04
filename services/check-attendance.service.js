import { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"


class CheckAttendanceService {
    static async getScheduledTime() {
        const serviceUrl = `${url.attendanceCheck.base}`

        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }
    static async getAllCheckedAttendance() {
        const serviceUrl = `${url.attendanceCheck.checked}`

        return await wrapperCallApi(
            useMyAxios().get(serviceUrl)
        )
    }

    static async checkAttendance(registrationId) {
        const serviceUrl = url.attendanceCheck.base

        return await wrapperCallApi(
            useMyAxios().post(
                serviceUrl,
                {registrationId: registrationId},
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        )
    }
}

export default CheckAttendanceService