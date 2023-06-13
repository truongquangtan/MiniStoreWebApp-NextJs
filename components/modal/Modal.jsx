
const Modal = ({ setFlag, children }) => {
    return (
        <div
            className="fixed top-0 left-0 bg-navy-900/10"
            onClick={setFlag.off}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="h-screen w-screen p-5 grid place-items-center overflow-hidden"
            >
                {children}
            </div >
        </div >

    )
}

export default Modal