import AdminLayout from '@/components/layouts/adminLayout'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import AppContextWrapper from '@/context/app-context'
import withAuth from '@/HOCs/withAuth';

export default function App({ Component, pageProps }) {
  const AuthComponent = withAuth(Component, pageProps)

  return (
    <>
      <AppContextWrapper>
          <AuthComponent />
      </AppContextWrapper>
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
