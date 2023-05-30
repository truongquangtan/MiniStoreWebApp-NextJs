import Layout from '@/components/layouts/defaultLayout'
import AdminLayout from '@/components/layouts/adminLayout'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  const router = useRouter()

  const isInAdminPage = () => {
    return !!(router.route.includes("/admin"));
  }

  if(isInAdminPage()){
    return (
      <>
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
        <ToastContainer
          position='top-right'
          autoClose={3000}
          pauseOnFocusLoss
          pauseOnHover
          theme='colored'
        />
      </>
    )
  }

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        pauseOnFocusLoss
        pauseOnHover
        theme='light'
      />
    </>
  )
}
