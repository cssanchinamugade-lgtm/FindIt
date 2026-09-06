
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(
    "https://findit-backend-lees.onrender.com"
);

function Navbar(){

    const navigate = useNavigate();

    const [user,setUser] = useState(null);

    const [messageNotification,setMessageNotification] =
        useState(0);


    useEffect(()=>{

        const checkUser = ()=>{

            const loggedUser =
            JSON.parse(
                localStorage.getItem("user")
            );

            setUser(loggedUser);

        };


        checkUser();


        window.addEventListener(
            "storage",
            checkUser
        );


        return()=>{

            window.removeEventListener(
                "storage",
                checkUser
            );

        };

    },[]);


    useEffect(()=>{

        if(!user?.id){
            return;
        }


        // Join personal user room
        socket.emit(
            "joinUser",
            user.id
        );


        const receiveNotification = (data)=>{

            console.log(
                "NEW MESSAGE NOTIFICATION:",
                data
            );


            if(
                data.receiverId === user.id
            ){
                setMessageNotification(
                    previous => previous + 1
                );
            }

        };


        socket.on(
            "newMessageNotification",
            receiveNotification
        );


        return()=>{

            socket.off(
                "newMessageNotification",
                receiveNotification
            );

        };

    },[user]);


    const logout=()=>{

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        setUser(null);

        navigate("/login");

    };


    const openMessages=()=>{

        setMessageNotification(0);

        navigate("/messages");

    };


    return(

<nav className="navbar navbar-expand-lg bg-primary">

<div className="container">


<Link
className="navbar-brand text-white fw-bold fs-2"
to="/"
>
🔍 FindIt
</Link>


<ul className="navbar-nav ms-auto d-flex flex-row gap-4 align-items-center">


<li>
<Link className="nav-link text-white" to="/">
Home
</Link>
</li>


<li>
<Link className="nav-link text-white" to="/search">
Search
</Link>
</li>


<li>
<Link className="nav-link text-white" to="/report-lost">
Report Lost
</Link>
</li>


<li>
<Link className="nav-link text-white" to="/report-found">
Report Found
</Link>
</li>


{
user ?

<>

<li>

<div className="profile-dropdown">

<button className="profile-btn">

👤 {user.name} ▼

{
messageNotification > 0 &&

<span
style={{
    background:"red",
    color:"white",
    borderRadius:"50%",
    padding:"2px 7px",
    fontSize:"12px",
    marginLeft:"5px"
}}
>
{messageNotification}
</span>

}

</button>


<div className="dropdown-menu">


<Link to="/profile">
My Profile
</Link>


<Link to="/my-reports">
My Reports
</Link>


<button
onClick={openMessages}
style={{
    border:"none",
    background:"none",
    width:"100%",
    textAlign:"left",
    padding:"10px 15px",
    cursor:"pointer"
}}
>
Messages 💬

{
messageNotification > 0 &&

<span
style={{
    background:"red",
    color:"white",
    borderRadius:"50%",
    padding:"2px 7px",
    fontSize:"12px",
    marginLeft:"5px"
}}
>
{messageNotification}
</span>

}

</button>


<button onClick={logout}>
Logout
</button>


</div>


</div>

</li>


<li>

<button
className="btn btn-danger"
onClick={logout}
>

Logout

</button>

</li>

</>


:


<>

<li>

<Link
className="btn btn-light"
to="/login"
>
Login
</Link>

</li>


<li>

<Link
className="btn btn-warning"
to="/register"
>
Register
</Link>

</li>

</>

}


</ul>


</div>

</nav>

);

}


export default Navbar;

