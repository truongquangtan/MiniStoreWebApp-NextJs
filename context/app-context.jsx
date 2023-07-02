import { createContext, useMemo, useState } from "react";

export const AppContext = createContext()

export default function AppContextWrapper({ children }) {
  const [pageName, setPageName] = useState("")
  const [token, setToken] = useState("")
  //const data = useMemo(() => ([pageName, setPageName]), [])
  return (
    <AppContext.Provider value={[pageName, setPageName, token, setToken]}>
      {children}
    </AppContext.Provider>
  )
}