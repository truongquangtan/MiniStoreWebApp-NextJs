import axios from "axios"

const myAxios = axios.create({
	headers: {
		"Content-Type": "application/json"
	}
})

export default myAxios