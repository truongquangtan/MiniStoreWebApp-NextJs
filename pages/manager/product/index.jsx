import Loading from "@/components/loading";
import Modal from "@/components/modal/Modal";
import { AppContext } from "@/context/app-context";
import useBoolean from "@/hooks/useBoolean";
import CategoryService from "@/services/category.service";
import ProductService from "@/services/product.service";
import { formatCurrencyVND } from "@/utils/currency";
import { base64Image } from "@/utils/file";
import { REGEX } from "@/validations/regex";
import { useFormik } from "formik";
import Head from "next/head";
import { useCallback, useContext, useEffect, useId, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { toast } from "react-toastify";
import * as Yup from "yup";


const CreateProduct = ({ setFlag, refetch, categories }) => {
    const [imageSrc, setImageSrc] = useState(undefined)

    const formId = useId()
    const formik = useFormik(
        {
            initialValues: {
                name: "",
                price: 0,
                quantity: 0,
                image: undefined,
                source: "",
                category: "",
                description: "",
            },
            validationSchema: Yup.object().shape(
                {
                    name: Yup.string().matches(REGEX.noBlank, "Product name invalid. Please try again.").required("Product name is required."),
                    price: Yup.number().typeError("Price invalid.").min(0, "Price minimize is 0").required("Price is required."),
                    quantity: Yup.number().typeError("Quantity invalid.").min(0, "Quantity minimize is 0").required("Quantity is required."),
                    source: Yup.string().matches(REGEX.noBlank, "Source invalid. Please try again.").required("Source is required."),
                    description: Yup.string().matches(REGEX.noBlank, "Description invalid. Please try again.").required("Description is required."),
                    image: Yup.mixed(),
                    category: Yup.mixed().nonNullable("Category invalid. Please try again.").required("Category is required.")
                }
            ),
            onSubmit: async ({ category, image, ...restValues }) => {
                const values = {
                    ...restValues,
                    categoryId: category.id
                }

                if (image) {
                    values.image = image
                }

                const formData = new FormData()

                for (const [key, val] of Object.entries(values)) {
                    formData.append(key, val)
                }

                const { status } = await ProductService.create(formData)

                if (status === 200) {
                    toast.success("Create product successfully!")
                    setFlag.off()
                    refetch()
                    return
                }
                toast.error("Create product failed!")
            }
        }
    )


    const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik

    const { name, price, quantity, category, source, description, image } = values

    useEffect(() => {
        (
            async () => {
                if (image) {
                    const imageBase64 = await base64Image(image)
                    setImageSrc(imageBase64)
                }
            }
        )()
    }, [image])

    return (
        <Modal setFlag={setFlag}>
            <div className="h-full w-md flex flex-col overflow-y-auto bg-white rounded shadow border space-y-5">
                <div className="flex justify-between shadow p-5">
                    <h2 className="text-indigo-500 font-medium text-lg">Create product</h2>
                    <button
                        onClick={setFlag.off}
                        className="text-gray-400 h-6 w-6 p-0.5 rounded-full hover:text-white hover:bg-red-500 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                </div>
                <form
                    id={formId}
                    onSubmit={handleSubmit}
                    className="grow overflow-y-auto p-5 space-y-5 text-gray-800"
                >
                    <div className="flex overflow-hidden space-x-5">
                        <div className="grow space-y-5">
                            <div className="space-y-1">
                                <label className="text-gray-700">Name</label>
                                <input
                                    value={name}
                                    name="name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={Boolean(errors.name && touched.name)}
                                    placeholder="Enter name..."
                                    className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                />
                                {
                                    errors.name && touched.name ? (
                                        <p className="font-medium text-xs text-red-500">{errors.name}</p>
                                    ) : null
                                }
                            </div>

                            <div className="space-y-1">
                                <label className="text-gray-700">Source</label>
                                <input
                                    value={source}
                                    name="source"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={Boolean(errors.source && touched.source)}
                                    placeholder="Enter source..."
                                    className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                />
                                {
                                    errors.source && touched.source ? (
                                        <p className="font-medium text-xs text-red-500">{errors.source}</p>
                                    ) : null
                                }
                            </div>


                        </div>

                        <label className="space-y-1">

                            <p className="text-gray-700 text-center">Image</p>

                            <div className="h-36 w-36 rounded border overflow-hidden cursor-pointer">
                                <input
                                    value={''}
                                    name="image"
                                    type="file"
                                    className="hidden"
                                    onChange={e => setFieldValue("image", e.target.files[0])}
                                    onBlur={handleBlur}
                                />
                                {
                                    errors.image && touched.image ? (
                                        <p className="text-center py-2 font-medium text-xs text-red-500">{errors.image}</p>
                                    ) : null
                                }
                                {
                                    imageSrc ? (
                                        <img className="block h-full w-full object-cover" src={imageSrc} />
                                    ) : null
                                }
                            </div>
                        </label>
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-700">Category</label>
                        <div
                            aria-invalid={Boolean(errors.category && touched.category)}
                            className="relative rounded border-2 focus-within:border-blue-700 aria-invalid:focus-within:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                        >
                            <button
                                type="button"
                                className="peer outline-none w-full px-3 py-1.5"
                            >
                                {
                                    category ? (
                                        <div className="flex">
                                            <span className="flex-none w-fit font-medium text-indigo-700">#{category.id}</span>
                                            <span className="px-2 grow text-left">{category.name}</span>
                                        </div>
                                    ) : (
                                        <p>Select Category</p>
                                    )
                                }
                            </button>
                            <ul className="invisible peer-focus:visible absolute mt-2 border shadow w-full bg-white transition-all duration-300">
                                {
                                    categories.map(
                                        category => (
                                            <li
                                                key={category.id}
                                                onClick={() => setFieldValue("category", category, true)}
                                                className="flex border-t py-1 hover:bg-zinc-200 cursor-pointer"
                                            >
                                                <span className="px-2 flex-none w-10 font-medium text-indigo-700">#{category.id}</span>
                                                <span className="px-2 flex-none w-80">{category.name}</span>
                                            </li>
                                        )
                                    )
                                }
                            </ul>

                        </div>
                        {
                            errors.category && touched.category ? (
                                <p className="font-medium text-xs text-red-500">{errors.category}</p>
                            ) : null
                        }
                    </div>


                    <div className="space-y-1">
                        <label className="text-gray-700">Price</label>
                        <input
                            value={price}
                            name="price"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.price && touched.price)}
                            placeholder="Enter price..."
                            className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                        />
                        {
                            errors.price && touched.price ? (
                                <p className="font-medium text-xs text-red-500">{errors.price}</p>
                            ) : null
                        }
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-700">Quantity</label>
                        <input
                            value={quantity}
                            name="quantity"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.quantity && touched.quantity)}
                            placeholder="Enter quantity..."
                            className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                        />
                        {
                            errors.quantity && touched.quantity ? (
                                <p className="font-medium text-xs text-red-500">{errors.quantity}</p>
                            ) : null
                        }
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-700">Description</label>
                        <textarea
                            value={description}
                            name="description"
                            type="description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.description && touched.description)}
                            placeholder="Enter description..."
                            className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                        />
                        {
                            errors.description && touched.description ? (
                                <p className="font-medium text-xs text-red-500">{errors.description}</p>
                            ) : null
                        }
                    </div>

                </form>
                <div className="flex justify-end px-5 py-2 space-x-5 border-t">
                    <button
                        type="submit"
                        form={formId}
                        disabled={Boolean(!isValid || isSubmitting)}
                        className="px-5 py-1 bg-indigo-500 disabled:opacity-50 text-white rounded hover:opacity-95 transition-opacity"
                    >
                        Create
                    </button>
                    <button
                        className="px-5 py-1 text-indigo-500 rounded hover:bg-zinc-200 transition-colors"
                        onClick={setFlag.off}
                        type="button"
                    >
                        Cancel
                    </button>
                </div>
            </div>

        </Modal>
    )
}

const Product = ({ product, categories, refetch }) => {
    const { id } = product
    const [displayUpdate, setDisplayUpdate] = useBoolean(false)
    const [imageSrc, setImageSrc] = useState(undefined)

    const formId = useId()
    const formik = useFormik(
        {
            initialValues: {
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                image: product?.productImages?.at(0)?.image || undefined,
                source: product.source,
                category: product.category,
                description: product.description,
            },
            validationSchema: Yup.object().shape(
                {
                    name: Yup.string().matches(REGEX.noBlank, "Product name invalid. Please try again.").required("Product name is required."),
                    price: Yup.number().typeError("Price invalid.").min(0, "Price minimize is 0").required("Price is required."),
                    quantity: Yup.number().typeError("Quantity invalid.").min(0, "Quantity minimize is 0").required("Quantity is required."),
                    source: Yup.string().matches(REGEX.noBlank, "Source invalid. Please try again.").required("Source is required."),
                    description: Yup.string().matches(REGEX.noBlank, "Description invalid. Please try again.").required("Description is required."),
                    image: Yup.mixed(),
                    category: Yup.mixed().nonNullable("Category invalid. Please try again.").required("Category is required.")
                }
            ),
            onSubmit: async ({ category, image, ...restValues }) => {
                const values = {
                    ...restValues,
                    categoryId: category.id
                }

                if (image && typeof image !== "string") {
                    values.image = image
                }

                const formData = new FormData()

                for (const [key, val] of Object.entries(values)) {
                    formData.append(key, val)
                }

                const { status } = await ProductService.update(id, formData)

                if (status === 200) {
                    toast.success("Update product successfully!")
                    setDisplayUpdate.off()
                    refetch()
                    return
                }
                toast.error("Update product failed!")
            }
        }
    )


    const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik

    const { name, price, quantity, category, source, description, image } = values

    const deleteProduct = useCallback(async () => {
        formik.setSubmitting(true)
        const { status } = await ProductService.delete(id)
        formik.setSubmitting(false)

        if (status === 200) {
            toast.success("Delete product successfully!")
            setDisplayUpdate.off()
            refetch()
            return
        }
        toast.error("Delete product failed!")
    }, [formik, id])

    useEffect(() => {
        (
            async () => {
                if (typeof image === "string") {
                    setImageSrc(image)
                    return
                }
                if (image) {
                    const imageBase64 = await base64Image(image)
                    setImageSrc(imageBase64)
                }
            }
        )()
    }, [image])

    return (
        <>
            <li
                className="min-w-full flex items-center space-x-5 w-max border-b rounded py-2 px-5 cursor-pointer hover:bg-gray-300 transition-all"
                onClick={setDisplayUpdate.on}
            >
                <div className="w-56 flex-none flex items-center space-x-2">

                    <img className="block w-10 h-10 object-cover rounded-full" src={product?.productImages?.at(0)?.image} />
                    <p>{product.name}</p>
                </div>
                <div className="w-56 flex-none">{product.category.name}</div>
                <div className="w-56 flex-none">{formatCurrencyVND(product.price)}</div>
                <div className="w-20 flex-none">{product.quantity}</div>
                <div className="grow">{product.description}</div>
            </li>
            {
                displayUpdate ? (

                    <Modal setFlag={setDisplayUpdate}>
                        <div className="h-full w-md flex flex-col overflow-y-auto bg-white rounded shadow border space-y-5">
                            <div className="flex justify-between shadow p-5">
                                <h2 className="text-indigo-500 font-medium text-lg">Product</h2>
                                <button
                                    onClick={setDisplayUpdate.off}
                                    className="text-gray-400 h-6 w-6 p-0.5 rounded-full hover:text-white hover:bg-red-500 transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>
                            <form
                                id={formId}
                                onSubmit={handleSubmit}
                                className="grow overflow-y-auto p-5 space-y-5 text-gray-800"
                            >
                                <div className="flex overflow-hidden space-x-5">
                                    <div className="grow space-y-5">
                                        <div className="space-y-1">
                                            <label className="text-gray-700">Name</label>
                                            <input
                                                value={name}
                                                name="name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={Boolean(errors.name && touched.name)}
                                                placeholder="Enter name..."
                                                className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                            />
                                            {
                                                errors.name && touched.name ? (
                                                    <p className="font-medium text-xs text-red-500">{errors.name}</p>
                                                ) : null
                                            }
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-gray-700">Source</label>
                                            <input
                                                value={source}
                                                name="source"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={Boolean(errors.source && touched.source)}
                                                placeholder="Enter source..."
                                                className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                            />
                                            {
                                                errors.source && touched.source ? (
                                                    <p className="font-medium text-xs text-red-500">{errors.source}</p>
                                                ) : null
                                            }
                                        </div>


                                    </div>

                                    <label className="space-y-1">

                                        <p className="text-gray-700 text-center">Image</p>

                                        <div className="h-36 w-36 rounded border overflow-hidden cursor-pointer">
                                            <input
                                                value={''}
                                                name="image"
                                                type="file"
                                                className="hidden"
                                                onChange={e => setFieldValue("image", e.target.files[0])}
                                                onBlur={handleBlur}
                                            />
                                            {
                                                errors.image && touched.image ? (
                                                    <p className="text-center py-2 font-medium text-xs text-red-500">{errors.image}</p>
                                                ) : null
                                            }
                                            {
                                                imageSrc ? (
                                                    <img className="block h-full w-full object-cover" src={imageSrc} />
                                                ) : null
                                            }
                                        </div>
                                    </label>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-gray-700">Category</label>
                                    <div
                                        aria-invalid={Boolean(errors.category && touched.category)}
                                        className="relative rounded border-2 focus-within:border-blue-700 aria-invalid:focus-within:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                                    >
                                        <button
                                            type="button"
                                            className="peer outline-none w-full px-3 py-1.5"
                                        >
                                            {
                                                category ? (
                                                    <div className="flex">
                                                        <span className="flex-none w-fit font-medium text-indigo-700">#{category.id}</span>
                                                        <span className="px-2 grow text-left">{category.name}</span>
                                                    </div>
                                                ) : (
                                                    <p>Select Category</p>
                                                )
                                            }
                                        </button>
                                        <ul className="invisible peer-focus:visible absolute mt-2 border shadow w-full bg-white transition-all duration-300">
                                            {
                                                categories.map(
                                                    category => (
                                                        <li
                                                            key={category.id}
                                                            onClick={() => setFieldValue("category", category, true)}
                                                            className="flex border-t py-1 hover:bg-zinc-200 cursor-pointer"
                                                        >
                                                            <span className="px-2 flex-none w-10 font-medium text-indigo-700">#{category.id}</span>
                                                            <span className="px-2 flex-none w-80">{category.name}</span>
                                                        </li>
                                                    )
                                                )
                                            }
                                        </ul>

                                    </div>
                                    {
                                        errors.category && touched.category ? (
                                            <p className="font-medium text-xs text-red-500">{errors.category}</p>
                                        ) : null
                                    }
                                </div>


                                <div className="space-y-1">
                                    <label className="text-gray-700">Price</label>
                                    <input
                                        value={price}
                                        name="price"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={Boolean(errors.price && touched.price)}
                                        placeholder="Enter price..."
                                        className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                    />
                                    {
                                        errors.price && touched.price ? (
                                            <p className="font-medium text-xs text-red-500">{errors.price}</p>
                                        ) : null
                                    }
                                </div>

                                <div className="space-y-1">
                                    <label className="text-gray-700">Quantity</label>
                                    <input
                                        value={quantity}
                                        name="quantity"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={Boolean(errors.quantity && touched.quantity)}
                                        placeholder="Enter quantity..."
                                        className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                    />
                                    {
                                        errors.quantity && touched.quantity ? (
                                            <p className="font-medium text-xs text-red-500">{errors.quantity}</p>
                                        ) : null
                                    }
                                </div>

                                <div className="space-y-1">
                                    <label className="text-gray-700">Description</label>
                                    <textarea
                                        value={description}
                                        name="description"
                                        type="description"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={Boolean(errors.description && touched.description)}
                                        placeholder="Enter description..."
                                        className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                                    />
                                    {
                                        errors.description && touched.description ? (
                                            <p className="font-medium text-xs text-red-500">{errors.description}</p>
                                        ) : null
                                    }
                                </div>

                            </form>
                            <div className="flex justify-end px-5 py-2 space-x-5 border-t">
                                <button
                                    type="submit"
                                    form={formId}
                                    disabled={Boolean(!isValid || isSubmitting)}
                                    className="px-5 py-1 bg-indigo-500 disabled:opacity-50 text-white rounded hover:opacity-95 transition-opacity"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={deleteProduct}
                                    disabled={Boolean(isSubmitting)}
                                    className="px-5 py-1 bg-red-500 disabled:opacity-50 text-white rounded hover:opacity-95 transition-opacity"
                                >
                                    Delete
                                </button>
                                <button
                                    className="px-5 py-1 text-indigo-500 rounded hover:bg-zinc-200 transition-colors"
                                    onClick={setDisplayUpdate.off}
                                    type="button"
                                >
                                    Cancel
                                </button>

                            </div>
                        </div>

                    </Modal>
                ) : null
            }
        </>

    )
}

export default function Index() {
    const [pageName, setPageName] = useContext(AppContext)

    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [displayCreate, setDisplayCreate] = useBoolean(false)


    const fetchProduct = useCallback(async () => {
        setLoading(true)
        const { error, data } = await ProductService.getAll()
        if (!error) {
            setProducts(data)
        }
        setLoading(false)
    }, [])
    const fetchCategories = async () => {
        const { error, data } = await CategoryService.getAll()
        if (!error) {
            setCategories(data)
        }
    }

    useEffect(() => {
        fetchCategories()
        fetchProduct()
        setPageName("User Management")
    }, [])


    return (
        <>
            <Head>
                <title>Users Management</title>
            </Head>
            <div className="border rounded shadow bg-white p-2">
                <div className="p-5 flex items-center justify-between">
                    <div className="font-bold text-xl text-gray-800">Products</div>
                    <button onClick={setDisplayCreate.toggle}>
                        <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600" />
                    </button>
                </div>

                {
                    loading ? (
                        <Loading size={32} />
                    ) : (
                        <div className="w-full overflow-auto">
                            <ul className="min-w-full text-gray-800 w-max">
                                <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                                    <div className="w-56 font-medium flex-none">Name</div>
                                    <div className="w-56 font-medium flex-none">Category</div>
                                    <div className="w-56 font-medium flex-none">Price</div>
                                    <div className="w-20 font-medium flex-none">Quantity</div>
                                    <div className="grow font-medium">Description</div>
                                </li>
                                {
                                    products.map(product => <Product key={product.id} product={product} categories={categories} refetch={fetchProduct} />)
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
            {
                displayCreate ? (
                    <CreateProduct setFlag={setDisplayCreate} refetch={fetchProduct} categories={categories} />
                ) : null
            }
        </>
    )
}