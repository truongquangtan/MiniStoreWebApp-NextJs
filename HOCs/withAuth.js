import { getRole } from "@/common/authStore"
import constants from "@/common/constants"
import AdminLayout from "@/components/layouts/adminLayout"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function withAuth(Component, pageProps) {
    const AuthenticatedComponent = () => {
        const router = useRouter()
        const [isAuthorization, setIsAuthorization] = useState(false)
        const [isAuthenticated, setIsAuthenticated] = useState(false)
        useEffect(() => {
            // Authorization Pages
            const role = getRole()
            const route = router.route
            if(!role) {
                if(route !== '/auth/login'){
                    router.push(constants.defaultRoute.UNAUTHENTICATED)
                    return
                }
                setIsAuthorization(true)
                return
            }
            setIsAuthenticated(true)
            if(role == constants.roleIdConstant.MANAGER && !route.includes('/manager')){
                router.push(constants.defaultRoute.MANAGER)
                return
            }
            if(role == constants.roleIdConstant.SALES && !route.includes('/sales')){
                router.push(constants.defaultRoute.SALES)
                return
            }
            if(role == constants.roleIdConstant.GUARD && !route.includes('/guard')){
                router.push(constants.defaultRoute.GUARD)
                return
            }

            setIsAuthorization(true)
        }, [])

        return (isAuthorization && (isAuthenticated === true ? <AdminLayout><Component {...pageProps} /></AdminLayout> : <Component {...pageProps} />))
    }
    return AuthenticatedComponent
}