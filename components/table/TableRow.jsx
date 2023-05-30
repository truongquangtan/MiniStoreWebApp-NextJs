export default function TableRow({extra, onRowClicked, ...props}) {
    return (
        <tr className={`border-b ${extra}`} onClick={onRowClicked}>{props.children}</tr>
    )
}