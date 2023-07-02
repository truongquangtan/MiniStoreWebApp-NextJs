import Head from "next/head"
import { MdAddBox } from "react-icons/md"

const Index = () => {
    return (
        <>
            <Head>
                <title>Salary Management</title>
            </Head>
            <div className="border rounded shadow bg-white p-2">
                <div className="p-5 flex items-center justify-between">
                    <div className="font-bold text-xl text-gray-800">Salary</div>
                    <button
                    >
                        <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Index