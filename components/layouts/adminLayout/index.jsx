import Sidebar from '@/components/sidebar'
import Breadcrumb from './breadcrumb'
import { useEffect, useState } from 'react'

const AdminLayout = (props) => {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  return (
    <>
      <Sidebar open={open} onClose={() => setOpen(false)}/>
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className={`mx-[12px] h-[100vh] p-2 overflow-auto flex-none transition-all xl:ml-[310px]`}>
          <Breadcrumb onOpenSidenav={() => setOpen(true)} brandText={`Default page`}/>
          <div>{props.children}</div>
        </main>
      </div>
    </>
  )
}

export default AdminLayout
