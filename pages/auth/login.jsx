import FormErrorText from "@/components/form/error_text";
import Label from "@/components/form/label";
import TextInput from "@/components/form/text_input";
import AuthService from "@/services/auth.service";
import { useFormik } from "formik";
import Image from "next/image";
import { useId, useState } from "react";
import * as Yup from "yup";
import {setAvatar, setName, setRole, setToken} from "@/common/authStore"
import { useRouter } from "next/router";
import constants from "@/common/constants";

export default function Login(props) {
  const [loginError, setLoginError] = useState("")

  const router = useRouter()

  const formId = useId()
  const formik = useFormik(
    {
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object().shape(
        {
          email: Yup.string().required(),
          password: Yup.string().required()
        }
      ),
      onSubmit: async ({email, password}) => {
        setLoginError("")
        const {error, data} = await AuthService.login(email, password)
        if(error){
          setLoginError(data.data.message)
          return
        }

        setToken(data.data.token)
        setRole(data.data.role)
        setAvatar(data.data.avatar)
        setName(data.data.fullname)

        router.push("/")
      }
    }
  )
  const { handleSubmit, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik
  const { email, password } = values

  return (
    <div className="px-[5vw] h-[100vh] flex flex-row items-center justify-between gap-4">
      <div className="w-[40%] min-w-[400px] max-w-full flex-col items-center shadow-md rounded-xl p-8">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <div className="mb-6">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* Email */}
          <div>
            <Label forField="email">Email*</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="Enter your email here"
              value={email}
              onChange={ e => setFieldValue("email", e.target.value, true)}
              onBlur={handleBlur}
              ariaInvalid={Boolean(errors.email && touched.email)}
            />
            {
              errors.email && touched.email ? (<FormErrorText>{errors.email}</FormErrorText>) : null
            }
          </div>

          {/* Password */}
          <div>
            <Label forField="password">Password*</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="Enter your password here"
              type="password"
              value={password}
              onChange={ e => setFieldValue("password", e.target.value, true)}
              onBlur={handleBlur}
              ariaInvalid={Boolean(errors.password && touched.password)}
            />
            {
              errors.password && touched.password ? (<FormErrorText>{errors.password}</FormErrorText>) : null
            }
          </div>
          {loginError ? (<FormErrorText>{loginError}</FormErrorText>) : null}
        </form>

        <button
          className="linear mt-3 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          type="submit"
          form={formId}
          disabled={Boolean(!isValid || isSubmitting)}
        >
          Sign In
        </button>
      </div>
      <div className="">
        <Image src="/img/auth/welcome-images.jpg" alt="welcome" width="704" height="396" />
      </div>
    </div>
  )
}