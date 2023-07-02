import routeHelper from '@/common/routeHelper'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Index(props) {
    const router = useRouter()
    useEffect(() => {
        const pageDefault = routeHelper.getRedirectPageDefault()
        router.push(pageDefault)
    }, [])

    return (
        <p></p>
    )
}