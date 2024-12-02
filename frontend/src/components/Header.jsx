import Sidebar from "./Sidebar";


function Header({children}){
return(<>
    <Sidebar />

        <div>
            {children}
        </div>
</>

)
}




export default Header;