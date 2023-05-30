export default function TextInput({type, id, placeholder, value, setValue, ...props}) {
    return (
        <input
            type={type || "text"}
            id={id}
            className="border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5"
            placeholder={placeholder}
            value={value}
            onChange={(event) => setValue(event.target.value)}
        ></input>
    )
}