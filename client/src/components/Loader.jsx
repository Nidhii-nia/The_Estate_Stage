import { FaSpinner } from "react-icons/fa"

const Loader = () => {
  return (
    <div className="flex gap-2 justify-center items-center text-2xl text-cyan-600">
        <FaSpinner />
        <p>Loading</p>
    </div>
  )
}

export default Loader