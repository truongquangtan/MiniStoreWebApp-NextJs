import { buttonTypes } from "@/common/type";
import Button from "@/components/button";
import Card from "@/components/card";
import Label from "@/components/form/label";
import SwitchButton from "@/components/form/switch_button";
import TextArea from "@/components/form/text_area";
import TextInput from "@/components/form/text_input";
import Modal from "@/components/modal";
import TableHeader from "@/components/table/TableHeader";
import TableHeaderData from "@/components/table/TableHeaderData";
import TableLayout from "@/components/table/TableLayout";
import TableRow from "@/components/table/TableRow";
import TableRowData from "@/components/table/TableRowData";
import { useState } from "react";
import { MdAddBox, MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid'

export default function Create(props) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [source, setSource] = useState("")
  const [textDescription, setTextDescription] = useState("")
  const [hasVariant, setHasVariant] = useState(false)
  const [variantName, setVariantName] = useState("")

  const [variantValues, setVariantValues] = useState([])

  // Variant-Controll functions
  const onAddVariantClick = () => {
    setVariantValues(current => {
      const variantId = uuidv4()
      current.push({
        variantId: variantId,
        value: '',
        price: 0,
        quantity: 0,
        attributeName: '',
        attributes: [],
      })
      return [...current]
    })
  }
  const onDeleteVariantClick = variantId => {
    setVariantValues(current => {
      const variantValue = current.findIndex(v => v.variantId === variantId)
      current.splice(variantValue, 1)
      return [...current]
    })
  }

  // Variant Value
  const setVariantValue = (id, value) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === id)
      variantValue.value = value
      return [...current]
    })
  }
  const getVariantValue = id => {
    return variantValues.find(v => v.variantId === id).value
  }

  // Variant Price
  const setVariantPrice = (id, value) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === id)
      variantValue.price = value
      return [...current]
    })
  }
  const getVariantPrice = id => {
    return variantValues.find(v => v.variantId === id).price
  }

  // Variant Quantity
  const setVariantQuantity = (id, value) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === id)
      variantValue.quantity = value
      return [...current]
    })
  }
  const getVariantQuantity = id => {
    return variantValues.find(v => v.variantId === id).quantity
  }

  // Attribute Name of variant
  const setVariantAttributeName = (id, value) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === id)
      variantValue.attributeName = value
      return [...current]
    })
  }
  const getVariantAttributeName = id => {
    return variantValues.find(v => v.variantId === id).attributeName
  }

  // Attribute-Controll functions
  const onAddAttributeClick = (variantId) => {
    setVariantValues(current => {
      const attributeId = uuidv4()
      const currentVariant = current.find(v => v.variantId === variantId)
      currentVariant.attributes.push({
        attributeId: attributeId,
        value: '',
        price: 0,
        quantity: 0,
      })
      return [...current]
    })
  }
  const onDeleteAttributeClick = (variantId, attributeId) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === variantId)
      const attributeIndex = variantValue.attributes.findIndex(v => v.attributeId === attributeId)
      variantValue.attributes.splice(attributeIndex, 1)
      return [...current]
    })
  }

  // Attribute Value
  const setAttributeValue = (variantId, attributeId, value) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === variantId)
      const attributeValue = variantValue.attributes.find(v => v.attributeId === attributeId)
      attributeValue.value = value
      return [...current]
    })
  }
  const getAttributeValue = (variantId, attributeId) => {
    const variantValue = variantValues.find(v => v.variantId === variantId)
    const attributeValue = variantValue.attributes.find(v => v.attributeId === attributeId)
    return attributeValue.value
  }

  // Attribute Price
  const setAttributePrice = (variantId, attributeId, value) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === variantId)
      const attributeValue = variantValue.attributes.find(v => v.attributeId === attributeId)
      attributeValue.price = value
      return [...current]
    })
  }
  const getAttributePrice = (variantId, attributeId) => {
    const variantValue = variantValues.find(v => v.variantId === variantId)
    const attributeValue = variantValue.attributes.find(v => v.attributeId === attributeId)
    return attributeValue.price
  }

  // Attribute Quantity
  const setAttributeQuantity = (variantId, attributeId, value) => {
    setVariantValues(current => {
      const variantValue = current.find(v => v.variantId === variantId)
      const attributeValue = variantValue.attributes.find(v => v.attributeId === attributeId)
      attributeValue.quantity = value
      return [...current]
    })
  }
  const getAttributeQuantity = (variantId, attributeId) => {
    const variantValue = variantValues.find(v => v.variantId === variantId)
    const attributeValue = variantValue.attributes.find(v => v.attributeId === attributeId)
    return attributeValue.quantity
  }

  // Page-execution functions
  const showRequestModel = () => {
    const data = {
      name: name,
      source: source,
      description: textDescription,
      price: price,
      quantity: quantity,
      hasVariant: hasVariant,
    }
    if(hasVariant) {
      data.variantValues = variantValues
    }
    console.log(data)
  }

  return (
    <Card extra={"items-center w-full p-[16px] bg-cover"}>
      <div className="w-full">
        <div className="mb-2">
          <Label forField="Name">Name</Label>
          <TextInput id="Name" placeholder="Product name" value={name} setValue={setName} />
        </div>
        <div className="mb-2">
          <Label forField="Source">Source</Label>
          <TextInput id="Source" placeholder="Source" value={source} setValue={setSource} />
        </div>
        <div className="mb-2">
          <Label forField="Description">Description</Label>
          <TextArea id="Description" placeholder="Description" value={textDescription} setValue={setTextDescription} />
        </div>
        <div className="w-full flex gap-3 mb-2">
          <div className="w-1/2">
            <Label forField="Price">Price (VNĐ)</Label>
            <TextInput id="Price" placeholder="Price" value={price} setValue={setPrice} />
          </div>
          <div className="w-1/2">
            <Label forField="Quantity">Quantity</Label>
            <TextInput type="number" id="Quantity" placeholder="Quantity" value={quantity} setValue={setQuantity} />
          </div>
        </div>
        <div className="mb-2 mt-4 flex w-full gap-3 items-center">
          <Label forField="Variant">Product has variant?</Label>
          <SwitchButton enabled={hasVariant} setEnabled={setHasVariant} hint="Variant" />
        </div>
        {hasVariant && (
          <div className="w-full">
            <div className="mb-2">
              <Label forField="Variant Name">Variant Name</Label>
              <TextInput id="Variant Name" placeholder="Variant Name" value={variantName} setValue={setVariantName} />
            </div>
            {variantValues.length > 0 && (<div className="mb-2 border-[1px] rounded-md p-2">
              {
                variantValues.map((value, index) => {
                  return (
                    <div className={`relative w-full pt-1 pb-3 border-b-[1px] ${index === 0 ? "mt-1" : "mt-3"}`} key={value.variantId}>
                      <div className="absolute top-0 right-0 text-red-600">
                        <MdDelete className="w-5 h-5" onClick={() => onDeleteVariantClick(value.variantId)} />
                      </div>
                      <div className="flex items-center w-full gap-3">
                        <div className="w-1/3">
                          <Label forField={`${value.variantId}-value`}>Variant value</Label>
                          <input
                            value={getVariantValue(value.variantId)}
                            key={`${value.variantId}-value`}
                            type="text"
                            id={`${value.variantId}-value`}
                            className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
                            placeholder="Variant value"
                            onChange={(event) => setVariantValue(value.variantId, event.target.value)}
                          ></input>
                        </div>
                        <div className="w-1/3">
                          <Label forField={`${value.variantId}-price`}>Price</Label>
                          <input
                            value={getVariantPrice(value.variantId)}
                            key={`${value.variantId}-price`}
                            type="text"
                            id={`${value.variantId}-price`}
                            className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
                            placeholder="Variant value"
                            onChange={(event) => setVariantPrice(value.variantId, event.target.value)}
                          ></input>
                        </div>
                        <div className="w-1/3">
                          <Label forField={`${value.variantId}-quantity`}>Quantity</Label>
                          <input
                            key={`${value.variantId}-quantity`}
                            value={getVariantQuantity(value.variantId)}
                            type="text"
                            id={`${value.variantId}-quantity`}
                            className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
                            placeholder="Variant value"
                            onChange={(event) => setVariantQuantity(value.variantId, event.target.value)}
                          ></input>
                        </div>
                      </div>
                      <div>
                        {value.attributes.length > 0 && (<div className="mb-2 border-[1px] mt-3 rounded-md p-2">
                          <div className="mb-2">
                            <Label forField={`Attribute Name - ${value.variantId}`}>Attribute Name</Label>
                            <input
                              key={`${value.variantId}-attributeName`}
                              value={getVariantAttributeName(value.variantId)}
                              type="text"
                              id={`${value.variantId}-attributeName`}
                              className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
                              placeholder="Variant value"
                              onChange={(event) => setVariantAttributeName(value.variantId, event.target.value)}
                            ></input>
                          </div>
                          {value.attributes.map((attributeValue, index) => {
                            return (
                              <div key={attributeValue.attributeId} className={`relative w-full pt-1 pb-3 border-b-[1px] ${index === 0 ? "mt-1" : "mt-3"}`}>
                                <div className="absolute top-0 right-0 text-red-600">
                                  <MdDelete className="w-5 h-5" onClick={() => onDeleteAttributeClick(value.variantId, attributeValue.attributeId)} />
                                </div>
                                <div className="flex items-center w-full gap-3">
                                  <div className="w-1/3">
                                    <Label forField={`${attributeValue.attributeId}-value`}>Attribute value</Label>
                                    <input
                                      key={`${attributeValue.attributeId}-value`}
                                      value={getAttributeValue(value.variantId, attributeValue.attributeId)}
                                      type="text"
                                      id={`${attributeValue.attributeId}-value`}
                                      className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
                                      placeholder="Variant value"
                                      onChange={(event) => setAttributeValue(value.variantId, attributeValue.attributeId, event.target.value)}
                                    ></input>
                                  </div>
                                  <div className="w-1/3">
                                    <Label forField={`${value.variantId}-price`}>Price</Label>
                                    <input
                                      key={`${attributeValue.attributeId}-price`}
                                      value={getAttributePrice(value.variantId, attributeValue.attributeId)}
                                      type="text"
                                      id={`${attributeValue.attributeId}-price`}
                                      className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
                                      placeholder="Variant value"
                                      onChange={(event) => setAttributePrice(value.variantId, attributeValue.attributeId, event.target.value)}
                                    ></input>
                                  </div>
                                  <div className="w-1/3">
                                    <Label forField={`${attributeValue.attributeId}-quantity`}>Quantity</Label>
                                    <input
                                      key={`${attributeValue.attributeId}-quantity`}
                                      value={getAttributeQuantity(value.variantId, attributeValue.attributeId)}
                                      type="text"
                                      id={`${attributeValue.attributeId}-quantity`}
                                      className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
                                      placeholder="Variant value"
                                      onChange={(event) => setAttributeQuantity(value.variantId, attributeValue.attributeId, event.target.value)}
                                    ></input>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>)}
                        <button className="text-blue-500 hover:cursor-pointer mt-2" onClick={() => onAddAttributeClick(value.variantId)}>Add an attribute</button>
                      </div>
                    </div>
                  )
                })
              }
            </div>)}
            <button className="text-blue-500 hover:cursor-pointer ml-12" onClick={onAddVariantClick}>Add new variant...</button>
          </div>
        )}
        <div className="p-4 flex items-center justify-end">
          <Button type={buttonTypes.DEFAULT} onClick={() => showRequestModel()}>Back</Button>
          <Button type={buttonTypes.PRIMARY} onClick={() => showRequestModel()}>Create</Button>
        </div>
      </div>
    </Card>
  )
}