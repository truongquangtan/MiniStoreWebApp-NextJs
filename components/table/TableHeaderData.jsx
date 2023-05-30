export default function TableHeaderData(props) {
    const {extra} = props
    return (
        <th scope="col" className={`whitespace-nowrap text-sm py-1 ${extra}`}>
            {props.children}
        </th>
    )
}