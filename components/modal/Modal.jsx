
const Modal = ({ setFlag, children }) => {
    return (
        <div className="relative !z-[1000]">
            <div className="fixed inset-0 bg-[#000000] bg-opacity-50" aria-hidden="true" />
            <div
                className="fixed left-0 right-0 top-16 flex items-center justify-center p-4"
                onClick={setFlag.off}
            >
                <div
                    onClick={e => e.stopPropagation()}
                    className="h-screen w-screen p-5 grid place-items-center overflow-hidden"
                >
                    {children}
                </div >
            </div>
        </div>
    )
}

export default Modal