import Sidebar from '@/components/sidebar'
import Breadcrumb from './breadcrumb'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/app-context'
import { useRouter } from 'next/router'
import { getRole, getUserId } from '@/common/authStore'
import constants from '@/common/constants'
import routes from '@/routes'
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import url from '@/common/url'
import { toast } from 'react-toastify'
import NotificationService from '@/services/notification.service'

const AdminLayout = (props) => {
  const router = useRouter()
  const [pageName, setPageName] = useContext(AppContext)
  const [notifications, setNotifications] = useState([])

  const [open, setOpen] = useState(true)

  const fetchNotifications = async () => {
    const {error, data} = await NotificationService.getAll()
    if(error) {
      toast.error("Fail to fetch data")
      return
    }
    setNotifications(data)
  }
  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    )

    const path = router.pathname
    const role = getRole()
    const routesValue = role == constants.roleIdConstant.GUARD ? routes.guard : role == constants.roleIdConstant.MANAGER ? routes.manager : routes.sales
    routesValue.forEach(v => {
      const fullPath = `${v.layout}/${v.path}`
      if(fullPath === path){
        setPageName(v.name)
      }
    })
  }, [router.route]);
  return (
    <>
      <Sidebar open={open} onClose={() => setOpen(false)}/>
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 relative !z-[1]">
        <main className={`mx-[12px] h-[100vh] p-2 overflow-auto flex-none transition-all xl:ml-[310px]`}>
          <Breadcrumb onOpenSidenav={() => setOpen(true)} brandText={pageName} notificationData={notifications} />
          <div className="relative z-[0]">{props.children}</div>
        </main>
      </div>
    </>
  )
}

export default AdminLayout
