export default function Label({forField, extra,...props}) {
    return (
        <label htmlFor={forField} className={`${extra} block mb-1 text-sm font-medium text-gray-900 dark:text-white`}>{props.children}</label>
    )
}