import Card from "@/components/card";
import Label from "@/components/form/label";
import RawInput from "@/components/form/raw_input";
import SelectBox from "@/components/form/select_box";
import TextInput from "@/components/form/text_input";
import Modal from "@/components/modal";
import TableHeader from "@/components/table/TableHeader";
import TableHeaderData from "@/components/table/TableHeaderData";
import TableLayout from "@/components/table/TableLayout";
import TableRow from "@/components/table/TableRow";
import TableRowData from "@/components/table/TableRowData";
import Head from "next/head";
import { useEffect, useState } from "react";
import { MdAddBox, MdCreate } from "react-icons/md";

import userService from "@/services/user.service";
import roleService from "@/services/role.service";
import FormErrorText from "@/components/form/error_text";
import Loading from "@/components/loading";
import {toast} from "react-toastify";
import Button from "@/components/button";
import { buttonTypes } from "@/common/type";
import moment from "moment/moment";

export default function Index() {
  const [roles, setRoles] = useState([])
  const [users, setUsers] = useState([])

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [avatar, setAvatar] = useState('')
  const [dob, setDob] = useState('')
  const [role, setRole] = useState('')
  const [address, setAddress] = useState('')
  const [formError, setFormError] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatar: '',
    dob: '',
    role: '',
    address: '',
    error: '',
  })
  const [updateUserId, setUpdateUserId] = useState('')

  useEffect(() => {
    async function fetchRoles() {
      let rolesFetched = []
      rolesFetched = await roleService.getAllRoles().catch(e => console.log(e))
      setRoles(rolesFetched)
    }
    fetchRoles()
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setIsLoading(true)
    setUsers(await userService.getAll())
    setIsLoading(false)
  }

  const defaultErrorState = () => {
    setFormError({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      avatar: '',
      dob: '',
      role: '',
      address: '',
      error: '',
    })
  }
  const defaultFormState = () => {
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setPhone('')
    setAvatar('')
    setDob('')
    setRole(undefined)
    setAddress('')
  }
  const formValidate = (isInCreate = true) => {
    defaultErrorState()
    let isError = false
    if(!role){
      isError = true
      setFormErrorProps("role", "Please choose a role")
    }
    if(fullName.trim().length == 0) {
      isError = true
      setFormErrorProps("fullName", "Fullname cannot be empty")
    }
    if(isInCreate && email.trim().length == 0) {
      isError = true
      setFormErrorProps("email", "Email cannot be empty")
    }
    if(isInCreate && password.length < 6) {
      isError = true
      setFormErrorProps("password", "Password must be at least 6 characters")
    }
    if(isInCreate && confirmPassword !== password) {
      isError = true
      setFormErrorProps("confirmPassword", "Confirm password is not match the password")
    }
    if(!dob) {
      isError = true
      setFormErrorProps("dob", "Date of birth cannot be empty")
    }
    return !isError
  }
  const setFormErrorProps = (prop, val) => {
    setFormError(current => {
      current[prop] = val
      return {... current}
    })
  }

  const onCreateModalConfirm = async () => {
    if(!formValidate()){
      return
    }
    const payload = {
      fullName: fullName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      phone: phone,
      avatar: avatar,
      dob: dob,
      roleId: role.id,
      address: address
    }
    const formData = new FormData()
    for (const [key, val] of Object.entries(payload)) {
      formData.append(key, val)
    }

    let isError = false
    await userService.post(formData).catch(res => {
      if(res.response.status === 400){
        setFormErrorProps("error", res.response.data.message)
        isError = true
      }
    })
    fetchUsers()
    if(!isError) {
      closeCreateModal()
      toast.success("Create account successfully.")
    }
  }
  const closeCreateModal = () => {
    defaultFormState()
    defaultErrorState()
    setIsCreateUserModalOpen(false)
  }

  const onUpdateModalConfirm = async () => {
    if(!formValidate(false)){
      return
    }
    const payload = {
      fullName: fullName,
      phone: phone,
      dob: dob,
      roleId: role.id,
      address: address
    }
    if(avatar){
      payload.avatar = avatar
    }

    const formData = new FormData()
    for (const [key, val] of Object.entries(payload)) {
      formData.append(key, val)
    }

    let isError = false
    await userService.put(updateUserId, formData).catch(res => {
      setFormErrorProps("error", res.response.data.message)
      isError = true
    })
    fetchUsers()
    if(!isError) {
      closeUpdateModal()
      toast.success("Update account successfully.")
    }
  }
  const closeUpdateModal = () => {
    defaultFormState()
    defaultErrorState()
    setIsUpdateUserModalOpen(false)
  }
  const onUpdateUserClick = (user) => {
    setUpdateUserId(user.id)
    defaultFormState()
    defaultErrorState()
    setFullName(user.fullname)
    setPhone(user.phone)
    setDob(moment(user.dob).format("yyyy-MM-DD"))
    const role = roles.filter(v => v.id === user.roleId)[0]
    setRole(role)
    setAddress(user.address)
    setIsUpdateUserModalOpen(true)
  }

  return (
    <div>
      <Head>
        <title>Users Management</title>
      </Head>
      <main>
        <Modal
          isOpen={isCreateUserModalOpen}
          headerName={`Create New Account`}
          width={`w-3/5 lg:w-2/5`}
          onConfirm={() => onCreateModalConfirm()}
          onClose={() => closeCreateModal()}
          error={formError.error}
          bodyTemplate={(
            <div>
              <SelectBox
                options={roles}
                selected={role}
                setSelected={setRole}
                error={formError.role}
                labelTemplate={<Label>Role*</Label>}
                placeholder="Select a role"
              />
              <div className="mb-2">
                <Label forField="Name">Name*</Label>
                <TextInput id="Name" placeholder="Full Name" value={fullName} setValue={setFullName} />
                <FormErrorText>{formError.fullName}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Email">Email*</Label>
                <TextInput id="Email" type="email" placeholder="Email" value={email} setValue={setEmail} />
                <FormErrorText>{formError.email}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Password">Password*</Label>
                <TextInput id="Password" type="password" placeholder="Password" value={password} setValue={setPassword} />
                <FormErrorText>{formError.password}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Confirm Password">Password*</Label>
                <TextInput id="Confirm Password" type="password" placeholder="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} />
                <FormErrorText>{formError.confirmPassword}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Avatar">Avatar</Label>
                <RawInput id="Avatar" type="file" onChange={(event) => setAvatar(event.target.files[0])} />
                <FormErrorText>{formError.avatar}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="DOB">Date of birth*</Label>
                <TextInput id="DOB" type="Date" value={dob} setValue={setDob} />
                <FormErrorText>{formError.dob}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Phone">Phone</Label>
                <TextInput id="Phone" value={phone} placeholder="Phone" setValue={setPhone} />
                <FormErrorText>{formError.phone}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Address">Address</Label>
                <TextInput id="Address" value={address} placeholder="Address" setValue={setAddress} />
                <FormErrorText>{formError.address}</FormErrorText>
              </div>
            </div>
          )}
        />
        <Modal
          isOpen={isUpdateUserModalOpen}
          headerName={`Update user information`}
          width={`w-3/5 lg:w-2/5`}
          onConfirm={() => onUpdateModalConfirm()}
          onClose={() => closeUpdateModal()}
          error={formError.error}
          confirmText={`Update`}
          bodyTemplate={(
            <div>
              <SelectBox
                options={roles}
                selected={role}
                setSelected={setRole}
                error={formError.role}
                labelTemplate={<Label>Role*</Label>}
                placeholder="Select a role"
              />
              <div className="mb-2">
                <Label forField="Name">Name*</Label>
                <TextInput id="Name" placeholder="Full Name" value={fullName} setValue={setFullName} />
                <FormErrorText>{formError.fullName}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Avatar">Avatar</Label>
                <RawInput id="Avatar" type="file" onChange={(event) => setAvatar(event.target.files[0])} />
                <FormErrorText>{formError.avatar}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="DOB">Date of birth (mm/dd/yyyy)*</Label>
                <TextInput id="DOB" type="Date" value={dob} setValue={setDob} />
                <FormErrorText>{formError.dob}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Phone">Phone</Label>
                <TextInput id="Phone" value={phone} placeholder="Phone" setValue={setPhone} />
                <FormErrorText>{formError.phone}</FormErrorText>
              </div>
              <div className="mb-2">
                <Label forField="Address">Address</Label>
                <TextInput id="Address" value={address} placeholder="Address" setValue={setAddress} />
                <FormErrorText>{formError.address}</FormErrorText>
              </div>
            </div>
          )}
        />
        <Card extra={"items-center w-full h-[82vh] p-[16px] bg-cover"}>
          <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-bold text-xl text-gray-800">Users</div>
              <div>
                <button onClick={() => setIsCreateUserModalOpen(true)}>
                  <MdAddBox className="h-8 w-8 text-blue-500 hover:text-blue-600" />
                </button>
              </div>
            </div>
            {
              isLoading ? <Loading /> : <TableLayout
              tableHeader={(
                <TableHeader>
                  <TableHeaderData>Avatar</TableHeaderData>
                  <TableHeaderData>Fullname</TableHeaderData>
                  <TableHeaderData>Email</TableHeaderData>
                  <TableHeaderData>Phone</TableHeaderData>
                  <TableHeaderData>Address</TableHeaderData>
                  <TableHeaderData></TableHeaderData>
                </TableHeader>
              )}
              tableBody={(
                <>
                  {users.map(user =>
                  (
                      <TableRow key={user.id}>
                        <TableRowData>
                          <img className="h-16 w-12 object-contain" src={user.avatar}></img>
                        </TableRowData>
                        <TableRowData>{user.fullname}</TableRowData>
                        <TableRowData>{user.email}</TableRowData>
                        <TableRowData>{user.phone}</TableRowData>
                        <TableRowData>{user.address}</TableRowData>
                        <TableRowData>
                          <div className="flex items-center gap-3">
                          <button onClick={() => onUpdateUserClick(user)}>
                            <MdCreate className="h-6 w-6 text-blue-500 hover:text-blue-600" />
                          </button>
                          </div>
                        </TableRowData>
                      </TableRow>
                  )
                  )}
                </>
              )}
            />
            }
          </div>
        </Card>
      </main>
    </div>
  )
}