import { buttonTypes } from "@/common/type"
import { Dialog } from "@headlessui/react"
import { useState } from "react"
import Button from "../button"
import Card from "../card"
import FormErrorText from "../form/error_text"
export default function Modal({ isOpen, onConfirm, confirmText, onClose, width, headerName, bodyTemplate, buttonsTemplate, absoluteTop, error }) {
  return (
    <Dialog className={`relative !z-1000`} open={isOpen} onClose={() => onClose()}>
      <div className="fixed inset-0 bg-[#000000] bg-opacity-50" aria-hidden="true" />
      <div className={`fixed left-0 right-0 ${absoluteTop || 'top-20'} flex items-center justify-center p-4`}>
        <Card extra={`${width}`}>
          <Dialog.Panel>
            {/* Header */}
            <div className="border-b-[1px] p-4 text-xl font-semibold">{headerName || "Modal"}</div>
            {/* Body */}
            <div className="p-4 max-h-[60vh] overflow-auto">
              {bodyTemplate || "This is body of modal"}
            </div>
            {/* Button */}
            
              {error ? <FormErrorText>{error}</FormErrorText> : <div> </div>}
              {buttonsTemplate || (
                <div className="flex items-center justify-end">
                  <Button type={buttonTypes.PRIMARY} onClick={() => onConfirm()}>{confirmText ? confirmText : `Create`}</Button>
                  <Button type={buttonTypes.DEFAULT} onClick={() => onClose()}>Cancel</Button>
                </div>
              )}
          </Dialog.Panel>
        </Card>
      </div>
    </Dialog>
  )
}