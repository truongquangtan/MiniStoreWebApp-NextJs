export default function TextInput({type, name, id, placeholder, value, onChange, onBlur, ariaInvalid, readOnly, extra, ...props}) {
    return (
        <input
            type={type || "text"}
            id={id}
            name={name}
            className={`border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 ${extra}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={ariaInvalid}
            readOnly={readOnly}
        ></input>
    )
}