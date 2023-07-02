import Loading from "@/components/loading";
import Modal from "@/components/modal/Modal";

import { AppContext } from "@/context/app-context";
import useBoolean from "@/hooks/useBoolean";
import OrderService from "@/services/order.service";
import ProductService from "@/services/product.service";
import { formatCurrencyVND } from "@/utils/currency";
import Head from "next/head";
import { useCallback, useContext, useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";

const CreateOrder = ({ setFlag, refetch }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [disableSubmit, setDisableSubmit] = useState(false)

    const items = products.filter(product => !product.selected)
    const selectedItems = products.filter(product => product.selected)

    const totalAmount = selectedItems.reduce(
        (total, product) => {
            return total += product.itemQuantity * product.price
        },
        0
    )

    const onInput = useCallback((value, item) => {
        const quantity = Number(value)


        if (isNaN(quantity)) {
            return
        }

        setProducts(
            products => products.map(
                product => {
                    if (product.id !== item.id) {
                        return product
                    }

                    if (quantity === 0) {
                        return {
                            ...product,
                            itemQuantity: product.itemQuantity ? product.itemQuantity : 1,
                            selected: false
                        }
                    }

                    const value = Math.max(1, Math.min(quantity, product.quantity))

                    return {
                        ...product,
                        itemQuantity: value
                    }
                }
            )
        )
    }, [])

    const onDelete = useCallback((item) => {
        onInput(0, item)
    }, [])

    const changeQuantity = useCallback((action, item) => {

        if (!["+", "-"].includes(action)) {
            return
        }
        setProducts(
            products => products.map(
                product => {


                    if (product.id !== item.id) {
                        return product
                    }

                    const quantity = product.itemQuantity

                    if (action === "+") {
                        return {
                            ...product,
                            itemQuantity: Math.min(quantity + 1, product.quantity),
                        }
                    }

                    if (quantity === 1 && action === "-") {
                        return {
                            ...product,
                            itemQuantity: 1,
                            selected: false
                        }
                    }

                    return {
                        ...product,
                        itemQuantity: quantity - 1
                    }
                }
            )
        )
    }, [])


    const addItem = useCallback((item) => {
        setProducts(
            products => products.map(
                product => {
                    if (product.id === item.id) {
                        return {
                            ...product,
                            itemQuantity: product.itemQuantity ? product.itemQuantity : 1,
                            selected: true
                        }
                    }
                    return product
                }
            )
        )
    }, [])

    useEffect(() => {
        (
            async () => {
                setLoading(true)
                const { error, data } = await ProductService.getAll()
                if (!error && Array.isArray(data)) {
                    const products = data.filter(
                        product => product?.quantity > 0
                    ).map(
                        product => (
                            {
                                ...product,
                                itemQuantity: 0,
                                selected: false
                            }
                        )
                    )

                    setProducts(products)
                }
                setLoading(false)
            }
        )()
    }, [])

    const handleCreateOrder = async () => {
        const selectedItems = products.filter(product => product.selected)

        const totalAmount = selectedItems.reduce(
            (total, product) => {
                return total += product.itemQuantity * product.price
            },
            0
        )

        const payload = {
            amount: totalAmount,
            status: "SUCCESS",
            payment: "CASH",
            orderDetail: selectedItems.map(
                ({ id, itemQuantity, price }) => (
                    {
                        productId: id,
                        quantity: itemQuantity,
                        price: itemQuantity * price
                    }
                )
            )
        }

        console.log(await OrderService.create(payload));
    }

    useEffect(() => {
        if (selectedItems.length < 1) {
            setDisableSubmit(true)
        } else {
            setDisableSubmit(false)
        }
    }, [selectedItems])

    return (
        <Modal setFlag={setFlag}>
            <div className="h-full w-md flex flex-col overflow-y-auto bg-white rounded shadow border space-y-5">
                <div className="flex justify-between shadow p-5">
                    <h2 className="text-indigo-500 font-medium text-lg">Order</h2>
                    <button
                        onClick={setFlag.off}
                        className="text-gray-400 h-6 w-6 p-0.5 rounded-full hover:text-white hover:bg-red-500 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {
                    loading ? (
                        <div className="grow overflow-y-auto p-5 space-y-5 text-gray-800">
                            <Loading size={40} />
                            <h2 className="text-center">Loading ...</h2>
                        </div>
                    ) : (
                        <div className="grow overflow-y-auto p-5 space-y-5 text-gray-800">
                            <div className="space-y-2">
                                <h2>Items</h2>
                                {
                                    selectedItems.length > 0 ? (
                                        <ul
                                            className="border rounded"
                                        >
                                            <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                                                <div className="w-56 font-medium flex-none">Name</div>
                                                <div className="w-20 font-medium">Unit Price</div>
                                                <div className="w-40 font-medium flex-none">Quantity</div>
                                                <div className="grow font-medium">Price</div>
                                            </li>
                                            {
                                                products.filter(product => product.selected).map(
                                                    product => (
                                                        <li
                                                            key={product.id}
                                                            className="min-w-full flex items-center space-x-5 w-max border-b rounded py-2 px-5 cursor-pointer hover:bg-gray-300 transition-all"
                                                        >
                                                            <div className="w-56 flex-none flex items-center space-x-2">
                                                                <img className="block w-10 h-10 object-cover rounded-full" src={product?.productImages?.at(0)?.image} />
                                                                <p>{product.name}</p>
                                                            </div>
                                                            <div className="w-20 flex-none">{formatCurrencyVND(product.price)}</div>
                                                            <div className="w-40 flex overflow-hidden flex-none">
                                                                <button
                                                                    className="block flex-none w-6 h-6 p-0.5 hover:bg-red-500 hover:text-white transition-colors rounded-full"
                                                                    onClick={() => changeQuantity("-", product)}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-full w-full">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                                                    </svg>
                                                                </button>
                                                                <div className="grow flex px-1 space-x-2 overflow-hidden">
                                                                    <input
                                                                        max={product.quantity}
                                                                        className="w-full outline-none border rounded px-2"
                                                                        value={product.itemQuantity}
                                                                        onChange={(e) => onInput(e.target.value, product)}
                                                                    />
                                                                </div>
                                                                <button
                                                                    className="block flex-none w-6 h-6 p-0.5 hover:bg-green-500 hover:text-white transition-colors rounded-full"
                                                                    onClick={() => changeQuantity("+", product)}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-full w-full">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="grow">{formatCurrencyVND(product.price)}</div>
                                                            <button
                                                                className="block w-6 h-6 p-0.5 rounded-full flex-none text-red-500 hover:bg-red-500 hover:text-white"
                                                                onClick={() => onDelete(product)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </li>
                                                    )
                                                )
                                            }
                                            <li className="min-w-full py-2 px-5">
                                                <h2 className="text-center font-medium text-red-500">Amount: {formatCurrencyVND(totalAmount)}</h2>
                                            </li>
                                        </ul>
                                    ) : null
                                }
                            </div>

                            {
                                items.length > 0 ? (
                                    <div className="space-y-2">
                                        <button
                                            className="peer block w-full py-1 hover:bg-green-600 hover:text-white transition-colors border rounded font-medium"
                                        >
                                            Add Items
                                        </button>

                                        <ul
                                            className="min-w-full w-max overflow-auto opacity-0 invisible peer-focus:visible peer-focus:opacity-100 text-gray-800 transition-all duration-300 border rounded shadow"
                                        >
                                            <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                                                <div className="w-56 font-medium flex-none">Name</div>
                                                <div className="w-32 font-medium flex-none">Category</div>
                                                <div className="w-20 font-medium flex-none">Quantity</div>
                                                <div className="grow font-medium">Price</div>
                                            </li>
                                            {
                                                items.map(
                                                    product => (
                                                        <li
                                                            onClick={() => addItem(product)}
                                                            key={product.id}
                                                            className="min-w-full flex items-center space-x-5 w-max border-b rounded py-2 px-5 cursor-pointer hover:bg-gray-300 transition-all"
                                                        >
                                                            <div className="w-56 flex-none flex items-center space-x-2">
                                                                <img className="block w-10 h-10 object-cover rounded-full" src={product?.productImages?.at(0)?.image} />
                                                                <p>{product.name}</p>
                                                            </div>
                                                            <div className="w-32 flex-none">{product.category.name}</div>
                                                            <div className="w-20 flex-none">{product.quantity}</div>
                                                            <div className="grow">{formatCurrencyVND(product.price)}</div>
                                                        </li>
                                                    )
                                                )
                                            }

                                        </ul>
                                    </div>
                                ) : null
                            }

                        </div>
                    )
                }
                <div className="flex justify-end px-5 py-2 space-x-5 border-t">
                    <button
                        disabled={disableSubmit}
                        onClick={handleCreateOrder}
                        className="px-5 py-1 bg-indigo-500 disabled:opacity-50 text-white rounded hover:opacity-95 transition-opacity"
                    >
                        Create
                    </button>
                    <button
                        className="px-5 py-1 text-indigo-500 rounded hover:bg-zinc-200 transition-colors"
                        onClick={setFlag.off}
                    >
                        Cancel
                    </button>
                </div>

            </div>



        </Modal>
    )
}

const Index = () => {
    const [pageName, setPageName] = useContext(AppContext)

    const [displayCreate, setDisplayCreate] = useBoolean(false)

    return (
        <>
            <Head>
                <title>Order Management</title>
            </Head>
            <div className="border rounded shadow bg-white p-2">
                <div className="p-5 flex items-center justify-between">
                    <div className="font-bold text-xl text-gray-800">Order</div>
                    <button
                        onClick={setDisplayCreate.on}
                    >
                        <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600" />
                    </button>
                </div>
            </div>
            {
                displayCreate ? (
                    <CreateOrder setFlag={setDisplayCreate} />
                ) : null
            }
        </>
    )
}

export default Index