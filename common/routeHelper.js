import { getRole, getToken } from "./authStore"
import constants from "./constants"

const getRedirectPageDefault = () => {
    const role = getRole()
    const token = getToken()

    if(token && role && role == constants.roleIdConstant.SALES){
      return constants.defaultRoute.SALES
    }
    if(token && role && role == constants.roleIdConstant.MANAGER){
      return constants.defaultRoute.MANAGER
    }
    if(token && role && role == constants.roleIdConstant.GUARD){
      return constants.defaultRoute.GUARD
    }
    return constants.defaultRoute.UNAUTHENTICATED
}

export default { getRedirectPageDefault, }