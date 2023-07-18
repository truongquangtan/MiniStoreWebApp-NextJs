import { getUserId } from "@/common/authStore";
import url from "@/common/url";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export default function AppContextWrapper({ children }) {
  const [pageName, setPageName] = useState("")
  const [connection, setConnection] = useState(null)
  const [connectionId, setConnectionId] = useState('')

  useEffect(() => {
    // SignalR init
    const connect = new HubConnectionBuilder()
                      .withUrl(url.notification.signalR)
                      .withAutomaticReconnect()
                      .build()
    
    setConnection(connect)
  }, [])

  useEffect(() => {
    if(connection) {
      connection.start()
      .then(() => {
        connection.on("OnConnected", (data) => {
          setConnectionId(data)
        })
        connection.on("OnReceivedNotification", (message) => {
          toast.info(message, {
            autoClose: false,
          })
        })
      })
      .catch((error) => {console.log(error)})
    }
  }, [connection])

  useEffect(() => {
    if(connection && connectionId && getUserId()){
      connection.send("RegisterConnection", getUserId(), connectionId)
    }
  }, [connection, connectionId])

  return (
    <AppContext.Provider value={[pageName, setPageName, connection, setConnection, connectionId, setConnectionId]}>
      {children}
    </AppContext.Provider>
  )
}