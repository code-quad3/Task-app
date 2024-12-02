import Task from "../components/Task"
import Header from "../components/Header"

function UpdtTskPage({fetchapiUrl,postapiUrl}){

    return(
        <Header>
            <Task fetchapiUrl={fetchapiUrl} postapiUrl={postapiUrl} />
            </Header>
    )
}


export default UpdtTskPage;