import { AppContext } from "@/context/app-context"
import { useContext, useEffect } from "react"

export default function Index(props) {
    const [pageName, setPageName] = useContext(AppContext)

    useEffect(() => {
        setPageName("Worksheet Management")
    }, [])

    return (
        <div>
            Worksheet {pageName}
        </div>
    )
}