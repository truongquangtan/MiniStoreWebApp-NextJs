export default function TableRowData(props) {
    const {extra} = props
    return (
        <td className={`font-medium text-md py-1 text-gray-700 whitespace-nowrap ${extra}`}>
            {props.children}
        </td>
    )
}