import { useParams } from "react-router-dom"
const Places = () => {
    const {pid} = useParams?.pid
    return (<div>Places ${pid}</div>)
}

export default Places