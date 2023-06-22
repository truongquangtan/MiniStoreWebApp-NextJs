import myAxios, { wrapperCallApi } from "@/common/myAxios"
import url from "@/common/url"

class CategoryService {
    static async getAll() {
        return await wrapperCallApi(
            myAxios.get(url.category.base)
        )
    }
}

export default CategoryService