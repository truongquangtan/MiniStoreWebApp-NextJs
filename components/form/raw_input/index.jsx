export default function RawInput({type, id, placeholder, value, onChange, ...props}) {
    return (
        <input
            type={type || "text"}
            id={id}
            className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
            placeholder={placeholder}
            onChange={(event) => onChange(event)}
        ></input>
    )
}