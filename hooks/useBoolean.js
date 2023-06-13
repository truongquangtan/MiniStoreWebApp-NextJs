import { useCallback, useState } from "react"

const useBoolean = (init = false) => {
    const [flag, setFlag] = useState(init)

    const on = useCallback(() => {
        setFlag(true)
    }, [])
    const off = useCallback(() => {
        setFlag(false)
    }, [])
    const toggle = useCallback(() => {
        setFlag(flag => !flag)
    }, [])

    return [flag, { on, off, toggle }]
}

export default useBoolean