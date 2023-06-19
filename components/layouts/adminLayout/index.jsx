import Sidebar from '@/components/sidebar'
import Breadcrumb from './breadcrumb'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/app-context'

const AdminLayout = (props) => {
  const [pageName, setPageName] = useContext(AppContext)

  const [open, setOpen] = useState(true)

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    )

    const url = window.location.href
    setPageName(url.split("/")[4])
  }, []);
  return (
    <>
      <Sidebar open={open} onClose={() => setOpen(false)}/>
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className={`mx-[12px] h-[100vh] p-2 overflow-auto flex-none transition-all xl:ml-[310px]`}>
          <Breadcrumb onOpenSidenav={() => setOpen(true)} brandText={pageName}/>
          <div>{props.children}</div>
        </main>
      </div>
    </>
  )
}

export default AdminLayout
