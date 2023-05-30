export default function TextArea({id, placeholder, value, setValue, extra, ...props}) {
    return (
        <textarea
            id={id}
            className={`border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 ${extra}`}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
        ></textarea>
    )
}