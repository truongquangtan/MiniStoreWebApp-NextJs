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
    static async remove(id) {
        return await wrapperCallApi(
            useMyAxios().delete(url.category.base + "/" + id)
        )
    }
}

export default CategoryService