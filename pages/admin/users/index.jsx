import Loading from "@/components/loading";
import Modal from "@/components/modal/Modal";
import useBoolean from "@/hooks/useBoolean";
import RoleService from "@/services/role.service";
import UserService from "@/services/user.service";
import { base64Image } from "@/utils/file";
import { REGEX } from "@/validations/regex";
import { useFormik } from "formik";
import Head from "next/head";
import { useCallback, useEffect, useId, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { toast } from "react-toastify";
import * as Yup from "yup";


const CreateUser = ({ setFlag, refetch }) => {

    const [roles, setRoles] = useState([])
    const [avatarImage, setAvatarImage] = useState(undefined)


    useEffect(() => {
        (
            async () => {
                const { error, data } = await RoleService.getAllRoles()
                if (error) {
                    return
                }

                setRoles(data)
            }
        )()
    }, [])

    const formId = useId()
    const formik = useFormik(
        {
            initialValues: {
                fullName: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                avatar: undefined,
                dob: undefined,
                role: undefined
            },
            validationSchema: Yup.object().shape(
                {
                    fullName: Yup.string().matches(REGEX.noBlank, "Full name invalid. Please try again.").required("Full name is required."),
                    email: Yup.string().email("Email invalid. Please try again.").required("Email is required."),
                    password: Yup.string().matches(REGEX.noBlank, "Password invalid. Please try again.").required("Password is required."),
                    phone: Yup.string().matches(REGEX.phone, "Phone invalid. Please try again.").required("Phone is required."),
                    address: Yup.string().matches(REGEX.noBlank, "Address invalid. Please try again.").required("Address is required."),
                    avatar: Yup.mixed().nonNullable("Avatar invalid").required("Avatar is required."),
                    dob: Yup.date().max(new Date(), "Date invalid").required("Date is required."),
                    role: Yup.mixed().nonNullable("Role invalid. Please try again.").required("Role is required.")
                }
            ),
            onSubmit: async ({ fullName, email, password, phone, address, avatar, dob, role }) => {
                const values = {
                    fullName,
                    email,
                    password,
                    phone,
                    address,
                    dob,
                    roleId: role.id
                }

                if (avatar) {
                    values.avatar = avatar
                }

                const formData = new FormData()

                for (const [key, val] of Object.entries(values)) {
                    formData.append(key, val)
                }

                const { status } = await UserService.create(formData)

                if (status === 200) {
                    toast.success("Create account successfully!")
                    setFlag.off()
                    refetch()
                    return
                }
                toast.error("Create account failed!")
            }
        }
    )


    const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik

    const { fullName, email, password, phone, address, avatar, dob, role } = values

    useEffect(() => {
        (
            async () => {
                if (avatar) {
                    const image = await base64Image(avatar)
                    setAvatarImage(image)
                }
            }
        )()
        setAvatarImage()
    }, [avatar])

    return (
        <Modal setFlag={setFlag}>
            <div className="h-full w-md flex flex-col overflow-y-auto bg-white rounded shadow border space-y-5">
                <div className="flex justify-between shadow p-5">
                    <h2 className="text-indigo-500 font-medium text-lg">Create user</h2>
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
                                <label className="text-gray-700">Full Name</label>
                                <input
                                    value={fullName}
                                    name="fullName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={Boolean(errors.fullName && touched.fullName)}
                                    placeholder="Enter fullName..."
                                    className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                />
                                {
                                    errors.fullName && touched.fullName ? (
                                        <p className="font-medium text-xs text-red-500">{errors.fullName}</p>
                                    ) : null
                                }
                            </div>
                            <div className="space-y-1">
                                <label className="text-gray-700">Birth Day</label>
                                <input
                                    value={dob}
                                    name="dob"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={Boolean(errors.dob && touched.dob)}
                                    type="date"
                                    className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                />
                                {
                                    errors.dob && touched.dob ? (
                                        <p className="font-medium text-xs text-red-500">{errors.dob}</p>
                                    ) : null
                                }
                            </div>


                        </div>

                        <label className="space-y-1">

                            <p className="text-gray-700 text-center">Avatar</p>

                            <div className="h-36 w-36 rounded border overflow-hidden cursor-pointer">
                                <input
                                    value={''}
                                    name="avatar"
                                    type="file"
                                    className="hidden"
                                    onChange={e => setFieldValue("avatar", e.target.files[0])}
                                    onBlur={handleBlur}
                                />
                                {
                                    errors.avatar && touched.avatar ? (
                                        <p className="text-center py-2 font-medium text-xs text-red-500">{errors.avatar}</p>
                                    ) : null
                                }
                                {
                                    avatarImage ? (
                                        <img className="block h-full w-full object-cover" src={avatarImage} />
                                    ) : null
                                }
                            </div>
                        </label>
                    </div>
                    <div className="space-y-1">
                        <label className="text-gray-700">Role</label>
                        <div
                            aria-invalid={Boolean(errors.role && touched.role)}
                            className="relative rounded border-2 focus-within:border-blue-700 aria-invalid:focus-within:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                        >
                            <button
                                type="button"
                                className="peer outline-none w-full px-3 py-1.5"
                            >
                                {
                                    role ? (
                                        <div className="flex">
                                            <span className="flex-none w-fit font-medium text-indigo-700">#{role.id}</span>
                                            <span className="px-2 grow text-left">{role.name}</span>
                                        </div>
                                    ) : (
                                        <p>Select Role</p>
                                    )
                                }
                            </button>
                            <ul className="invisible peer-focus:visible absolute mt-2 border shadow w-full bg-white transition-all duration-300">
                                {
                                    roles.map(
                                        role => (
                                            <li
                                                key={role.id}
                                                onClick={() => setFieldValue("role", role, true)}
                                                className="flex border-t py-1 hover:bg-zinc-200 cursor-pointer"
                                            >
                                                <span className="px-2 flex-none w-10 font-medium text-indigo-700">#{role.id}</span>
                                                <span className="px-2 flex-none w-80">{role.name}</span>
                                            </li>
                                        )
                                    )
                                }
                            </ul>

                        </div>
                        {
                            errors.role && touched.role ? (
                                <p className="font-medium text-xs text-red-500">{errors.role}</p>
                            ) : null
                        }
                    </div>
                    <div className="space-y-1">
                        <label className="text-gray-700">Address</label>
                        <input
                            value={address}
                            name="address"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.address && touched.address)}
                            placeholder="Enter address..."
                            className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                        />
                        {
                            errors.address && touched.address ? (
                                <p className="font-medium text-xs text-red-500">{errors.address}</p>
                            ) : null
                        }
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-700">Email</label>
                        <input
                            value={email}
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.email && touched.email)}
                            placeholder="Enter email..."
                            className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                        />
                        {
                            errors.email && touched.email ? (
                                <p className="font-medium text-xs text-red-500">{errors.email}</p>
                            ) : null
                        }
                    </div>
                    <div className="space-y-1">
                        <label className="text-gray-700">Phone</label>
                        <input
                            value={phone}
                            name="phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.phone && touched.phone)}
                            placeholder="Enter phone..."
                            className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                        />
                        {
                            errors.phone && touched.phone ? (
                                <p className="font-medium text-xs text-red-500">{errors.phone}</p>
                            ) : null
                        }
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-700">Password</label>
                        <input
                            value={password}
                            name="password"
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(errors.password && touched.password)}
                            placeholder="Enter password..."
                            className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                        />
                        {
                            errors.password && touched.password ? (
                                <p className="font-medium text-xs text-red-500">{errors.password}</p>
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

const User = ({ user, refetch }) => {
    const [displayUpdate, setDisplayUpdate] = useBoolean(false)
    const [roles, setRoles] = useState([])
    const [avatarImage, setAvatarImage] = useState()


    const toDateString = useCallback((dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }, [])

    useEffect(() => {
        (
            async () => {
                const { error, data } = await RoleService.getAllRoles()
                if (error) {
                    return
                }

                setRoles(data)
            }
        )()
    }, [])

    const formId = useId()
    const formik = useFormik(
        {
            initialValues: {
                fullName: user.fullname,
                email: user.email,
                password: user.password,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                dob: toDateString(user.dob),
                role: user.role
            },
            validationSchema: Yup.object().shape(
                {
                    fullName: Yup.string().matches(REGEX.noBlank, "Full name invalid. Please try again.").required("Full name is required."),
                    email: Yup.string().email("Email invalid. Please try again.").required("Email is required."),
                    password: Yup.string().matches(REGEX.noBlank, "Password invalid. Please try again.").required("Password is required."),
                    phone: Yup.string().matches(REGEX.phone, "Phone invalid. Please try again.").required("Phone is required."),
                    address: Yup.string().matches(REGEX.noBlank, "Address invalid. Please try again.").required("Address is required."),
                    avatar: Yup.mixed().nonNullable("Avatar invalid").required("Avatar is required."),
                    dob: Yup.date().max(new Date(), "Date invalid").required("Date is required."),
                    role: Yup.mixed().nonNullable("Role invalid. Please try again.").required("Role is required.")
                }
            ),
            onSubmit: async ({ fullName, email, password, phone, address, avatar, dob, role }) => {
                const values = {
                    fullName,
                    email,
                    password,
                    phone,
                    address,
                    dob,
                    roleId: role.id
                }

                if (avatar) {
                    values.avatar = avatar
                }

                const formData = new FormData()

                for (const [key, val] of Object.entries(values)) {
                    formData.append(key, val)
                }

                const { status } = await UserService.update(user.id, formData)

                if (status === 200) {
                    toast.success("Update account successfully!")
                    refetch()
                    setDisplayUpdate.off()
                    return
                }
                toast.error("Update account failed!")
            }
        }
    )



    const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik

    const { fullName, email, password, phone, address, avatar, dob, role } = values

    useEffect(() => {
        (
            async () => {
                if (typeof avatar === "string") {
                    setAvatarImage(avatar)
                    return
                }
                if (avatar) {
                    const image = await base64Image(avatar)
                    setAvatarImage(image)
                }
            }
        )()
    }, [avatar])



    return (
        <>
            <li
                className="min-w-full flex space-x-5 w-max border-b rounded py-2 px-5 cursor-pointer hover:bg-gray-300 transition-all"
                onClick={setDisplayUpdate.on}
            >
                <div className="w-56 flex-none flex space-x-3 overflow-x-hidden">
                    <img className="block w-10 h-10 object-cover rounded-full" src={user.avatar} />
                    <div className="grow overflow-x-hidden">
                        <p className="font-medium">{user.fullname}</p>
                        {
                            user.isActive ? (
                                <p className="h-fit text-xs font-medium text-white w-fit px-1 rounded bg-green-500">Active</p>
                            ) : null
                        }
                        {
                            user.isDeleted ? (
                                <p className="h-fit text-xs font-medium text-white w-fit px-1 rounded bg-red-500">Delete</p>
                            ) : null
                        }
                    </div>
                </div>
                <div className="w-56 flex-none truncate">{user.phone}</div>
                <div className="w-56 flex-none truncate">{user.email}</div>
                <div className="w-20 flex-none truncate">{user.role.name}</div>
                <div className="grow">{user.address}</div>
            </li>
            {
                displayUpdate ? (
                    <Modal setFlag={setDisplayUpdate}>
                        <div className="h-full w-md flex flex-col overflow-y-auto bg-white rounded shadow border space-y-5">
                            <div className="flex justify-between shadow p-5">
                                <h2 className="text-indigo-500 font-medium text-lg">User</h2>
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
                                            <label className="text-gray-700">Full Name</label>
                                            <input
                                                value={fullName}
                                                name="fullName"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={Boolean(errors.fullName && touched.fullName)}
                                                placeholder="Enter fullName..."
                                                className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                                            />
                                            {
                                                errors.fullName && touched.fullName ? (
                                                    <p className="font-medium text-xs text-red-500">{errors.fullName}</p>
                                                ) : null
                                            }
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-gray-700">Birth Day</label>
                                            <input
                                                value={dob}
                                                name="dob"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={Boolean(errors.dob && touched.dob)}
                                                type="date"
                                                className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                            />
                                            {
                                                errors.dob && touched.dob ? (
                                                    <p className="font-medium text-xs text-red-500">{errors.dob}</p>
                                                ) : null
                                            }
                                        </div>


                                    </div>

                                    <label className="space-y-1">

                                        <p className="text-gray-700 text-center">Avatar</p>

                                        <div className="h-36 w-36 rounded border overflow-hidden cursor-pointer">
                                            <input
                                                value={''}
                                                name="avatar"
                                                type="file"
                                                className="hidden"
                                                onChange={e => setFieldValue("avatar", e.target.files[0])}
                                                onBlur={handleBlur}
                                            />
                                            {
                                                errors.avatar && touched.avatar ? (
                                                    <p className="text-center py-2 font-medium text-xs text-red-500">{errors.avatar}</p>
                                                ) : null
                                            }
                                            {
                                                avatarImage ? (
                                                    <img className="block h-full w-full object-cover" src={avatarImage} />
                                                ) : null
                                            }
                                        </div>
                                    </label>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-gray-700">Role</label>
                                    <div
                                        aria-invalid={Boolean(errors.role && touched.role)}
                                        className="relative rounded border-2 focus-within:border-blue-700 aria-invalid:focus-within:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                                    >
                                        <button
                                            type="button"
                                            className="peer outline-none w-full px-3 py-1.5"
                                        >
                                            {
                                                role ? (
                                                    <div className="flex">
                                                        <span className="flex-none w-fit font-medium text-indigo-700">#{role.id}</span>
                                                        <span className="px-2 grow text-left">{role.name}</span>
                                                    </div>
                                                ) : (
                                                    <p>Select Role</p>
                                                )
                                            }
                                        </button>
                                        <ul className="invisible peer-focus:visible absolute mt-2 border shadow w-full bg-white transition-all duration-300">
                                            {
                                                roles.map(
                                                    role => (
                                                        <li
                                                            key={role.id}
                                                            onClick={() => setFieldValue("role", role, true)}
                                                            className="flex border-t py-1 hover:bg-zinc-200 cursor-pointer"
                                                        >
                                                            <span className="px-2 flex-none w-10 font-medium text-indigo-700">#{role.id}</span>
                                                            <span className="px-2 flex-none w-80">{role.name}</span>
                                                        </li>
                                                    )
                                                )
                                            }
                                        </ul>

                                    </div>
                                    {
                                        errors.role && touched.role ? (
                                            <p className="font-medium text-xs text-red-500">{errors.role}</p>
                                        ) : null
                                    }
                                </div>
                                <div className="space-y-1">
                                    <label className="text-gray-700">Address</label>
                                    <input
                                        value={address}
                                        name="address"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={Boolean(errors.address && touched.address)}
                                        placeholder="Enter address..."
                                        className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                    />
                                    {
                                        errors.address && touched.address ? (
                                            <p className="font-medium text-xs text-red-500">{errors.address}</p>
                                        ) : null
                                    }
                                </div>

                                <div className="space-y-1">
                                    <label className="text-gray-700">Email</label>
                                    <input
                                        value={email}
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={Boolean(errors.email && touched.email)}
                                        placeholder="Enter email..."
                                        className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"

                                    />
                                    {
                                        errors.email && touched.email ? (
                                            <p className="font-medium text-xs text-red-500">{errors.email}</p>
                                        ) : null
                                    }
                                </div>
                                <div className="space-y-1">
                                    <label className="text-gray-700">Phone</label>
                                    <input
                                        value={phone}
                                        name="phone"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={Boolean(errors.phone && touched.phone)}
                                        placeholder="Enter phone..."
                                        className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                                    />
                                    {
                                        errors.phone && touched.phone ? (
                                            <p className="font-medium text-xs text-red-500">{errors.phone}</p>
                                        ) : null
                                    }
                                </div>

                                <div className="space-y-1">
                                    <label className="text-gray-700">Password</label>
                                    <input
                                        value={password}
                                        name="password"
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={Boolean(errors.password && touched.password)}
                                        placeholder="Enter password..."
                                        className="outline-none w-full px-3 py-1.5 rounded border-2 focus:border-blue-700 aria-invalid:focus:border-blue-700 aria-invalid:border-red-500 transition-all duration-300"
                                    />
                                    {
                                        errors.password && touched.password ? (
                                            <p className="font-medium text-xs text-red-500">{errors.password}</p>
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
                                    Save
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

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [displayCreate, setDisplayCreate] = useBoolean(false)


    const fetchUser = useCallback(async () => {
        setLoading(true)
        const { error, data } = await UserService.getAll()
        if (!error) {
            setUsers(data)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchUser()
    }, [])

    console.log(users);


    return (
        <>
            <Head>
                <title>Users Management</title>
            </Head>
            <div className="space-y-10 border rounded shadow">
                <div className="p-5 flex items-center justify-between">
                    <div className="font-bold text-xl text-gray-800">Users</div>
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
                                    <div className="w-56 font-medium flex-none">Full Name</div>
                                    <div className="w-56 font-medium flex-none">Phone</div>
                                    <div className="w-56 font-medium flex-none">Email</div>
                                    <div className="w-20 font-medium flex-none">Role</div>
                                    <div className="grow font-medium">Address</div>
                                </li>
                                {
                                    users.map(user => <User key={user.id} user={user} refetch={fetchUser} />)
                                }
                            </ul>
                        </div>
                    )
                }
            </div>
            {
                displayCreate ? (
                    <CreateUser setFlag={setDisplayCreate} refetch={fetchUser} />
                ) : null
            }
        </>
    )
}