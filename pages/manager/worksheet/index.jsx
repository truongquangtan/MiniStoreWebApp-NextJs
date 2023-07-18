import Loading from "@/components/loading"
import ModalComponent from "@/components/modal";
import { AppContext } from "@/context/app-context"
import useBoolean from "@/hooks/useBoolean"
import RoleService from "@/services/role.service"
import WorksheetService from "@/services/worksheet.service"
import { useFormik } from "formik"
import Head from "next/head"
import { useCallback, useContext, useEffect, useId, useState } from "react"
import { MdAddBox, MdDelete } from "react-icons/md"
import * as Yup from "yup";
import Label from "@/components/form/label";
import TextInput from "@/components/form/text_input";
import FormErrorText from "@/components/form/error_text";
import SelectBox from "@/components/form/select_box";
import { REGEX } from "@/validations/regex";
import { toast } from "react-toastify";
import Button from "@/components/button";
import { buttonTypes } from "@/common/type";
import constants from "@/common/constants";
import moment from "moment/moment";

export default function Index(props) {
  const [pageName, setPageName] = useContext(AppContext)

  const [saleWorksheets, setSaleWorksheets] = useState([])
  const [saleWorksheetsLoading, setSaleWorksheetsLoading] = useState(false)
  const [guardWorksheets, setGuardWorksheets] = useState([])
  const [guardWorksheetsLoading, setGuardWorksheetsLoading] = useState(false)

  const [displayCreate, setDisplayCreate] = useBoolean(false)

  const [isModalDeleteActive, setIsModalDeleteActive] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  const fetchWorksheets = async () => {
    setSaleWorksheetsLoading(true)
    setGuardWorksheetsLoading(true)
    const { error, data } = await WorksheetService.getAll()
    if (!error) {
      const saleData = data.filter(d => d.roleId === constants.roleIdConstant.SALES)
      const guardData = data.filter(d => d.roleId === constants.roleIdConstant.GUARD)
      setSaleWorksheets(saleData)
      setGuardWorksheets(guardData)
    }
    setGuardWorksheetsLoading(false)
    setSaleWorksheetsLoading(false)
  }

  const onDeleteClick = (worksheet) => {
    setDeleteId(worksheet.id)
    setIsModalDeleteActive(true)
  }
  const onDeleteConfirm = async () => {
    const { status } = await WorksheetService.delete(deleteId)

    setIsModalDeleteActive(false)

    if (status === 204) {
      toast.success("Delete worksheet successfully!")
      fetchWorksheets()
      return
    }
    toast.error("Delete worksheet failed!")
  }

  useEffect(() => {
    fetchWorksheets()
    setPageName("Worksheet Management")
  }, [])

  return (
    <div>
      <Head>
        <title>Worksheet Management</title>
      </Head>
      <ModalComponent
      bodyTemplate={(<div>Do you want to delete this worksheet</div>)}
      buttonsTemplate={(
        <div className="flex items-center justify-end w-full">
          <Button type={buttonTypes.DANGER} onClick={() => onDeleteConfirm()}>Confirm</Button>
          <Button type={buttonTypes.DEFAULT} onClick={() => setIsModalDeleteActive(false)}>Cancel</Button>
        </div>
      )}
      isOpen={isModalDeleteActive}
      onClose={() => setIsModalDeleteActive(false)}
      width={`w-[60vw]`}
      />
      <div className="border rounded shadow bg-white p-2">
        <div className="p-5 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800">Worksheet for Sale</div>
          <button onClick={setDisplayCreate.toggle}>
            <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600" />
          </button>
        </div>

        {
          saleWorksheetsLoading ? (
            <Loading size={32} />
          ) : (
            <div className="w-full overflow-auto max-h-[25vh]">
              <ul className="min-w-full text-gray-800 w-max">
                <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                  <div className="w-[20%] font-medium flex-none">Name</div>
                  <div className="w-[20%] font-medium flex-none">Time range</div>
                  <div className="w-[20%] font-medium flex-none">Status</div>
                  <div className="w-[20%] font-medium flex-none">Coefficient amount</div>
                  <div className="font-medium flex-none">Actions</div>
                </li>
                {
                  saleWorksheets.map(worksheet => (
                    <li
                      key={worksheet.id}
                      className="min-w-full flex space-x-5 w-max border-b rounded py-2 px-5 transition-all"
                    >
                      <div className="w-[20%] flex-none truncate">{worksheet.name}</div>
                      <div className="w-[20%] flex-none truncate">{worksheet.timeRange}</div>
                      <div className="w-[20%] flex-none truncate">
                        {worksheet.isActive ? "Active" : "Inactive"}
                      </div>
                      <div className="w-[10%] flex-none truncate">
                        {worksheet.coefficientAmount}
                      </div>
                      <div className="grow text-center">
                        <button className="text-red-600 hover:text-red-700" onClick={() => onDeleteClick(worksheet)}>
                          <MdDelete className="w-5 h-5"/>
                        </button>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>

      {/* Worksheet for guard ----------------------------------------------------------------- */}

      <div className="border rounded shadow bg-white p-2 mt-10">
        <div className="p-5 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800">Worksheet for Guard</div>
          <button onClick={setDisplayCreate.toggle}>
            <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600" />
          </button>
        </div>

        {
          guardWorksheetsLoading ? (
            <Loading size={32} />
          ) : (
            <div className="w-full overflow-auto max-h-[25vh]">
              <ul className="min-w-full text-gray-800 w-max">
                <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                  <div className="w-[20%] font-medium flex-none">Name</div>
                  <div className="w-[20%] font-medium flex-none">Time range</div>
                  <div className="w-[20%] font-medium flex-none">Status</div>
                  <div className="w-[20%] font-medium flex-none">Coefficient Amount</div>
                  <div className="font-medium flex-none">Actions</div>
                </li>
                {
                  guardWorksheets.map(worksheet => (
                    <li
                      key={worksheet.id}
                      className="min-w-full flex space-x-5 w-max border-b rounded py-2 px-5 transition-all"
                    >
                      <div className="w-[20%] flex-none truncate">{worksheet.name}</div>
                      <div className="w-[20%] flex-none truncate">{worksheet.timeRange}</div>
                      <div className="w-[20%] flex-none truncate">
                        {worksheet.isActive ? "Active" : "Inactive"}
                      </div>
                      <div className="w-[20%] flex-none truncate">
                        {worksheet.coefficientAmount}
                      </div>
                      <div className="grow text-center">
                        <button className="text-red-600 hover:text-red-700" onClick={() => onDeleteClick(worksheet)}>
                          <MdDelete className="w-5 h-5"/>
                        </button>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>
          )
        }
      </div>
      {
        displayCreate ? (
          <CreateWorksheet setFlag={setDisplayCreate} refetch={fetchWorksheets} />
        ) : null
      }
    </div>
  )
}

const CreateWorksheet = ({ setFlag, refetch }) => {

  const [roles, setRoles] = useState([])


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
        role: "",
        startTime: "",
        endTime: "",
        worksheetName: "",
        coefficientAmount: 1,
      },
      validationSchema: Yup.object().shape(
        {
          role: Yup.mixed().nonNullable("Role invalid. Please try again.").required("Role is required."),
          startTime: Yup.string().required(),
          endTime: Yup.string().required(),
          worksheetName: Yup.string().matches(REGEX.noBlank, "Full name invalid. Please try again.").required("Full name is required."),
          coefficientAmount: Yup.number().typeError("Coefficient amount invalid.").min(0, "Coefficient amount min is 0").required("Coefficient amount is required.")
        }
      ),
      onSubmit: async ({ role, startTime, endTime, worksheetName }) => {
        const payload = {
          roleId: role.id,
          timeRange: `${startTime}-${endTime}`,
          name: worksheetName,
          coefficientAmount: coefficientAmount,
        }

        const { status } = await WorksheetService.create(payload)

        if (status === 200) {
          toast.success("Create worksheet successfully!")
          setFlag.off()
          refetch()
          return
        }
        toast.error("Create worksheet failed!")
      }
    }
  )


  const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik

  const { role, startTime, endTime, worksheetName, coefficientAmount } = values

  return (
    <ModalComponent
      headerName={`Create worksheet`}
      onClose={() => setFlag.off}
      isOpen={true}
      width={`w-[30vw]`}
      bodyTemplate={(
        <form
          id={formId}
          onSubmit={handleSubmit}
          className="grow overflow-y-auto space-y-5 text-gray-800"
        >
          <div className="flex overflow-hidden space-x-5 px-2">
            <div className="grow space-y-5">
              <div className="space-y-1">
                <Label forField="Name">Name</Label>
                <TextInput
                  id="Name"
                  value={worksheetName}
                  name="Name"
                  onChange={(e) => setFieldValue("worksheetName", e.target.value, true)}
                  onBlur={handleBlur}
                  ariaInvalid={Boolean(errors.worksheetName && touched.worksheetName)}
                  placeholder="The name of worksheet"
                />
                {
                  errors.worksheetName && touched.worksheetName ? (
                    <FormErrorText>{errors.worksheetName}</FormErrorText>
                  ) : null
                }
              </div>
              <div className="space-y-1">
                <SelectBox 
                labelTemplate={(<Label forField="Role">Role</Label>)}
                onOptionClick={setFieldValue}
                fieldName="role"
                placeholder="Select a role"
                selected={role}
                options={roles}
                isError={Boolean(errors.role && touched.role)}
                />
                {
                  errors.role && touched.role ? (
                    <FormErrorText className="font-medium text-xs text-red-500">{errors.role}</FormErrorText>
                  ) : null
                }
              </div>
              <div className="space-y-1">
                <Label forField="startTime">Start time</Label>
                <TextInput
                  id="startTime"
                  type="time"
                  value={startTime}
                  name="startTime"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ariaInvalid={Boolean(errors.startTime && touched.startTime)}
                />
                {
                  errors.startTime && touched.startTime ? (
                    <FormErrorText className="font-medium text-xs text-red-500">{errors.startTime}</FormErrorText>
                  ) : null
                }
              </div>
              <div className="space-y-1">
                <Label forField="endTime">End time</Label>
                <TextInput
                  id="endTime"
                  type="time"
                  value={endTime}
                  name="endTime"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ariaInvalid={Boolean(errors.endTime && touched.endTime)}
                />
                {
                  errors.endTime && touched.endTime ? (
                    <FormErrorText className="font-medium text-xs text-red-500">{errors.endTime}</FormErrorText>
                  ) : null
                }
              </div>
              <div className="space-y-1">
                <Label forField="coefficient-amount">Coefficient amount</Label>
                <TextInput
                  id="coefficient-amount"
                  value={coefficientAmount}
                  name="coefficient-amount"
                  onChange={(e) => setFieldValue("coefficientAmount", e.target.value, true)}
                  onBlur={handleBlur}
                  ariaInvalid={Boolean(errors.coefficientAmount && touched.coefficientAmount)}
                />
                {
                  errors.coefficientAmount && touched.coefficientAmount ? (
                    <FormErrorText className="font-medium text-xs text-red-500">{errors.coefficientAmount}</FormErrorText>
                  ) : null
                }
              </div>
            </div>
          </div>
        </form>
      )}
      buttonsTemplate={(
        <div className="flex w-full justify-end px-5 py-2 space-x-2">
          <button
            type="submit"
            form={formId}
            disabled={Boolean(!isValid || isSubmitting)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Create
          </button>
          <button
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={setFlag.off}
            type="button"
          >
            Cancel
          </button>
        </div>
      )}
    />
  )
}