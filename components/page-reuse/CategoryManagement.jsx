import CategoryService from "@/services/category.service"
import ModalComponent from "@/components/modal";
import { useFormik } from "formik"
import Head from "next/head";
import { useEffect, useId, useState } from "react"
import { toast } from "react-toastify"
import * as Yup from "yup";
import Button from "@/components/button";
import { buttonTypes } from "@/common/type";
import { MdAddBox, MdDelete } from "react-icons/md";
import Loading from "@/components/loading";
import Label from "@/components/form/label";
import TextInput from "@/components/form/text_input";
import FormErrorText from "@/components/form/error_text";

export default function CategoryManagement(props) {
  const [isModalDeleteActive, setIsModalDeleteActive] = useState(false)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [displayCreate, setDisplayCreate] = useState(false)
  const [categories, setCategories] = useState([])
  const [idDelete, setIdDelete] = useState('')

  const onDeleteConfirm = () => {
    const {error} = CategoryService.remove(idDelete)
    if(error){
      toast.error("Error when delete")
      return
    }
    toast.success("Delete successfully")
    fetchCategories()
    setIsModalDeleteActive(false)
  }
  const onDeleteClick = (id) => {
    setIsModalDeleteActive(true)
    setIdDelete(id)
  }
  const fetchCategories = async () => {
    setCategoryLoading(true)
    const { error, data } = await CategoryService.getAll()
    if (error) {
      toast.error("Error when fetch data")
      return
    }

    setCategories(data)
    setCategoryLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div>
      <Head>
        <title>Categories Management</title>
      </Head>
      <ModalComponent
        bodyTemplate={(<div>Do you want to delete this category</div>)}
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
          <div className="font-bold text-xl text-gray-800">Categories</div>
          <button onClick={() => setDisplayCreate(true)}>
            <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600" />
          </button>
        </div>

        {
          categoryLoading ? (
            <Loading size={32} />
          ) : (
            <div className="w-full overflow-auto">
              <ul className="min-w-full text-gray-800 w-max">
                <li className="min-w-full flex space-x-5 w-max border-b py-2 px-5">
                  <div className="w-[30%] font-medium flex-none">Id</div>
                  <div className="w-[50%] font-medium flex-none">Name</div>
                  <div className="font-medium flex-none">Actions</div>
                </li>
                {
                  categories.map(category => (
                    <li
                      key={category.id}
                      className="min-w-full flex space-x-5 w-max border-b rounded py-2 px-5 transition-all"
                    >
                      <div className="w-[30%] flex-none truncate">{category.id}</div>
                      <div className="w-[50%] flex-none truncate">{category.name}</div>
                      <div className="grow text-left">
                        <button className="text-red-600 hover:text-red-700" onClick={() => onDeleteClick(category.id)}>
                          <MdDelete className="w-5 h-5" />
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
          <CreateCategory setFlag={setDisplayCreate} refetch={fetchCategories} />
        ) : null
      }
    </div>
  )
}

const CreateCategory = ({ setFlag, refetch }) => {

  const formId = useId()
  const formik = useFormik(
    {
      initialValues: {
        name: ""
      },
      validationSchema: Yup.object().shape(
        {
          name: Yup.string().required(),
        }
      ),
      onSubmit: async ({ name }) => {
        const { status } = await CategoryService.add(name)

        if (status === 200) {
          toast.success("Create category successfully!")
          setFlag(false)
          refetch()
          return
        }
        toast.error("Create category failed!")
      }
    }
  )


  const { handleSubmit, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = formik

  const { name } = values

  return (
    <ModalComponent
      headerName={`Create category`}
      onClose={() => setFlag(false)}
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
                  value={name}
                  name="Name"
                  onChange={(e) => setFieldValue("name", e.target.value, true)}
                  onBlur={handleBlur}
                  ariaInvalid={Boolean(errors.name && touched.name)}
                  placeholder="The name of worksheet"
                />
                {
                  errors.name && touched.name ? (
                    <FormErrorText>{errors.name}</FormErrorText>
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
            onClick={() => setFlag(false)}
            type="button"
          >
            Cancel
          </button>
        </div>
      )}
    />
  )
}