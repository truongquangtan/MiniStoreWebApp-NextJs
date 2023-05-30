export default function TableLayout(props) {
    const {tableHeader, tableBody, extra} = props
    return (
        <table className={`text-left table-auto text-gray-700 w-full max-w-full ${extra}`}>
            {tableHeader}
            <tbody>
                {tableBody}
            </tbody>
        </table>
    )
}