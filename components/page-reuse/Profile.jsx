import { REGEX } from "@/validations/regex"
import { useFormik } from "formik"
import { useId } from "react"
import * as Yup from "yup"
import Label from "../form/label"
import TextInput from "../form/text_input"
import FormErrorText from "../form/error_text"

export default function Profile(props) {
  const formId = useId()

  const formik = useFormik(
    {
      initialValues: {
        fullName: '',
        phone: '',
        address: '',
        dob: '',
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
        //submit here
      }
    }
  )



  const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik

  const { fullName, phone, address, dob } = values


  return (
    <main className="border rounded shadow bg-white p-2 h-96">
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="grow overflow-y-auto p-5 space-y-5 text-gray-800"
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
      </form>
    </main>
  )
}