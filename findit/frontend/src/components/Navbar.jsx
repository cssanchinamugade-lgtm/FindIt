import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


function Navbar(){

    const navigate = useNavigate();


    const [user,setUser] = useState(null);



    useEffect(()=>{

        const loggedUser =
        JSON.parse(localStorage.getItem("user"));


        setUser(loggedUser);


    },[]);



    const logout = ()=>{


        localStorage.removeItem("user");


        setUser(null);


        navigate("/login");


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
                    <Link
                    className="nav-link text-white"
                    to="/"
                    >
                        Home
                    </Link>
                    </li>



                    <li>
                    <Link
                    className="nav-link text-white"
                    to="/search"
                    >
                        Search
                    </Link>
                    </li>



                    <li>
                    <Link
                    className="nav-link text-white"
                    to="/report-lost"
                    >
                        Report Lost
                    </Link>
                    </li>



                    <li>
                    <Link
                    className="nav-link text-white"
                    to="/report-found"
                    >
                        Report Found
                    </Link>
                    </li>





                    {
                        user ?

                        <>


                        <li>

                        <span className="text-white fw-bold">

                            👤 {user.name}

                        </span>

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