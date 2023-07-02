import myAxios, { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"

class CategoryService {
    static async getAll() {
        return await wrapperCallApi(
            useMyAxios().get(url.category.base)
        )
    }
}

export default CategoryService