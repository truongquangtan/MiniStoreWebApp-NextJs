import { wrapperCallApi, useMyAxios } from "@/common/myAxios"
import url from "@/common/url"

class CategoryService {
    static async getAll() {
        return await wrapperCallApi(
            useMyAxios().get(url.category.base)
        )
    }
    static async add(categoryName) {
        return await wrapperCallApi(
            useMyAxios().post(url.category.base, {name: categoryName})
        )
    }
}

export default CategoryService