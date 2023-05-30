export default function TableHeader(props) {
    const {extra} = props;
    return (
        <thead className={`text-primary sticky top-0 border-b-[1px] ${extra}`}>
            <tr>{props.children}</tr>
        </thead>
    )
}