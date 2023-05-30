import ClipLoader from "react-spinners/ClipLoader";

export default function Loading({size=70, ...props}) {
    return (
        <div className="w-full flex justify-center pt-3">
            <ClipLoader size={size}/>
        </div>
    )
}