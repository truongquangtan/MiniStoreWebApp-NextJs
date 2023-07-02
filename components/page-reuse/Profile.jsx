import { REGEX } from "@/validations/regex"
import { useFormik } from "formik"
import { useEffect, useId, useState } from "react"
import * as Yup from "yup"
import Label from "../form/label"
import TextInput from "../form/text_input"
import FormErrorText from "../form/error_text"
import UserService from "@/services/user.service"
import { toast } from "react-toastify"
import moment from "moment"

export default function Profile(props) {
  const [user, setUser] = useState(undefined)

  const fetchUser = async () => {
    const { error, data } = await UserService.getInfo();
    if (error) {
      toast.error("Cannot fetch data")
    }

    setUser(data)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    user && <FormProfile userData={user} refetch={fetchUser} />
  )
}

const FormProfile = ({ userData, refetch }) => {

  const formId = useId()

  const formik = useFormik(
    {
      initialValues: {
        fullName: userData?.fullname,
        phone: userData?.phone,
        address: userData?.address,
        dob: moment(userData?.dob).format("yyyy-MM-DD"),
      },
      validationSchema: Yup.object().shape(
        {
          fullName: Yup.string().matches(REGEX.noBlank, "Full name invalid. Please try again.").required("Full name is required."),
          phone: Yup.string().matches(REGEX.phone, "Phone invalid. Please try again.").required("Phone is required."),
          address: Yup.string().matches(REGEX.noBlank, "Address invalid. Please try again.").required("Address is required."),
          dob: Yup.date().max(new Date(), "Date invalid").required("Date is required."),
        }
      ),
      onSubmit: async ({ fullName, phone, address, dob }) => {
        const payload = {
          fullname: fullName,
          phone: phone,
          address: address,
          dob: dob,
          roleId: userData.roleId
        }

        const {error} = await UserService.update(userData.id, payload)
        if(error){
          toast.error("Cannot update user information")
          return
        }

        toast.success("Update information successfully")
        refetch()
      }
    }
  )



  const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting } = formik

  const { fullName, phone, address, dob } = values


  return (
    <main className="border rounded shadow bg-white p-2">
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="grow overflow-y-auto p-2 space-y-5 text-gray-800"
      >
        <div className="flex overflow-hidden space-x-5">
          <div className="grow space-y-5">
            <div className="space-y-1">
              <Label forField="fullName">Full Name</Label>
              <TextInput
                id="fullname"
                value={fullName}
                name="fullName"
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors.fullName && touched.fullName)}
                placeholder="Enter full name"
              />
              {
                errors.fullName && touched.fullName ? (
                  <FormErrorText>{errors.fullName}</FormErrorText>
                ) : null
              }
            </div>
            <div className="space-y-1">
              <Label forField="dob">Birth Day</Label>
              <TextInput
                id="dob"
                value={dob}
                name="dob"
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors.dob && touched.dob)}
                type="date"
              />
              {
                errors.dob && touched.dob ? (
                  <FormErrorText>{errors.dob}</FormErrorText>
                ) : null
              }
            </div>


          </div>
        </div>
        <div className="space-y-1">
          <Label forField="address">Address</Label>
          <TextInput
            id="address"
            value={address}
            name="address"
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.address && touched.address)}
            placeholder="Enter address"
          />
          {
            errors.address && touched.address ? (
              <FormErrorText>{errors.address}</FormErrorText>
            ) : null
          }
        </div>
        <div className="space-y-1">
          <Label forField="phone">Phone</Label>
          <TextInput
            id="phone"
            value={phone}
            name="phone"
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.phone && touched.phone)}
            placeholder="Enter phone"
          />
          {
            errors.phone && touched.phone ? (
              <FormErrorText>{errors.phone}</FormErrorText>
            ) : null
          }
        </div>
        <div className="flex w-full justify-end px-5 space-x-2">
          <button
            type="submit"
            form={formId}
            disabled={Boolean(!isValid || isSubmitting)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Update
          </button>
        </div>
      </form>
    </main>
  )
}