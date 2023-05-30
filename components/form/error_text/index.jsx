export default function FormErrorText(props) {
  return props.children && (
    <div className="text-red-500 font-semibold ml-3">[{props.children}]</div>
  )
}