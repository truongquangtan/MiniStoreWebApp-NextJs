import axios from "axios"
import { getToken } from "@/common/authStore"

const myAxios = axios.create({
	headers: {
		"Content-Type": "application/json"
	}
})

export function useMyAxios() {
	const token = getToken()
	if(token){
		return axios.create({
			headers: {
				"Content-Type": "application/json",
				"Authorization": `bearer ${token}`
			}
		})
	}
	return axios.create({
		headers: {
			"Content-Type": "application/json"
		}
	})
}

export const wrapperCallApi = async (promise) => {
	try {
		const { data, status } = await promise
		return {
			error: false,
			data,
			status
		}
	} catch (error) {
		console.log(error);
		return {
			error: true,
			data: error.response
		}
	}
}

export default myAxios