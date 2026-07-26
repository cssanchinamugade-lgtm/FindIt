import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


function Login(){

    const navigate = useNavigate();


    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [error,setError] = useState("");

    const [loading,setLoading] = useState(false);




    const handleLogin = async(e)=>{


        e.preventDefault();


        setError("");

        setLoading(true);



        try{


            const response = await fetch(
                "http://https://findit-backend-lees.onrender.com/api/auth/login",
                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json"

                    },


                    body:JSON.stringify({

                        email,

                        password

                    })

                }
            );




            const data = await response.json();




            if(!response.ok){

                setError(
                    data.message || "Login failed"
                );

                setLoading(false);

                return;

            }





            // SAVE USER DATA FOR CHAT

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );





            alert(
                "Login Successful"
            );



            navigate("/");




        }

        catch(error){


            console.log(error);


            setError(
                "Server error. Try again."
            );


        }


        setLoading(false);


    };






    return(

        <div className="login-container">


            <form
            className="login-card"
            onSubmit={handleLogin}
            >


                <h2>
                    Login to FindIt
                </h2>



                {
                    error &&
                    <p className="error">
                        {error}
                    </p>
                }




                <input

                type="email"

                placeholder="Enter Email"

                value={email}

                onChange={
                    (e)=>
                    setEmail(e.target.value)
                }

                required

                />





                <input

                type="password"

                placeholder="Enter Password"

                value={password}

                onChange={
                    (e)=>
                    setPassword(e.target.value)
                }

                required

                />





                <button
                type="submit"
                disabled={loading}
                >

                {
                    loading
                    ?
                    "Logging in..."
                    :
                    "Login"
                }

                </button>




            </form>


        </div>

    );

}


export default Login;