import classes from './index.module.css'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => {
  return (
    <>
      <Header />
      <main>
        <div>{props.children}</div>
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
