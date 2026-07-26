import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearchLocation } from "react-icons/fa";
import "./Navbar.css";


function Navbar(){

    const navigate = useNavigate();

    const [user,setUser] = useState(null);



    useEffect(()=>{

        const storedUser = localStorage.getItem("user");


        if(storedUser){

            setUser(
                JSON.parse(storedUser)
            );

        }


    },[]);




    const logout = ()=>{


        localStorage.removeItem("user");


        setUser(null);


        navigate("/login");


    };





    return(

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

            <div className="container">


                {/* LOGO */}

                <Link 
                className="navbar-brand logo"
                to="/"
                >

                    <FaSearchLocation 
                    className="logo-icon"
                    />


                    <span>
                        FindIt
                    </span>


                </Link>





                {/* Mobile Toggle */}

                <button

                className="navbar-toggler"

                type="button"

                data-bs-toggle="collapse"

                data-bs-target="#navbarMenu"

                >

                    <span className="navbar-toggler-icon"></span>


                </button>






                <div 
                className="collapse navbar-collapse"
                id="navbarMenu"
                >



                <ul className="navbar-nav ms-auto align-items-center gap-3">



                    <li className="nav-item">

                        <Link
                        className="nav-link"
                        to="/"
                        >

                            Home

                        </Link>

                    </li>





                    <li className="nav-item">

                        <Link
                        className="nav-link"
                        to="/search"
                        >

                            Search

                        </Link>

                    </li>






                    <li className="nav-item">

                        <Link
                        className="nav-link"
                        to="/report-lost"
                        >

                            Report Lost

                        </Link>

                    </li>






                    <li className="nav-item">

                        <Link
                        className="nav-link"
                        to="/report-found"
                        >

                            Report Found

                        </Link>

                    </li>







                    {

                    user ?


                    <>


                    <li>

                        <Link

                        className="btn btn-light profile-btn"

                        to="/profile"

                        >

                            Profile

                        </Link>


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


            </div>


        </nav>


    );

}


export default Navbar;