import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


function Login() {


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

        "https://findit-backend-lees.onrender.com/api/auth/login",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json",

          },


          body:JSON.stringify({

            email,

            password,

          }),

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






      // Save token

      if(data.token){


        localStorage.setItem(

          "token",

          data.token

        );


      }






      // Save user details

      if(data.user){


        localStorage.setItem(

          "user",

          JSON.stringify(data.user)

        );


      }

      else{


        localStorage.setItem(

          "user",

          JSON.stringify({

            name:data.name,

            email:email

          })

        );


      }






      alert("Login Successful 🎉");



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









  return (


    <div className="login-page">


      <div className="login-overlay">



        <div className="login-card">





          <div className="login-header">



            <div className="login-logo">

              🔍

            </div>



            <h1>

              Welcome Back

            </h1>




            <p>

              Sign in to continue using 
              <strong> FindIt</strong>

            </p>



          </div>








          {
          error &&

          (

            <div className="error-box">

              {error}

            </div>

          )

          }








          <form onSubmit={handleLogin}>





            <div className="input-group">


              <label>

                Email Address

              </label>



              <input


                type="email"


                placeholder="Enter your email"


                value={email}


                autoComplete="email"


                onChange={(e)=>
                  setEmail(e.target.value)
                }


                required


              />


            </div>








            <div className="input-group">


              <label>

                Password

              </label>




              <input


                type="password"


                placeholder="Enter your password"


                value={password}


                autoComplete="current-password"


                onChange={(e)=>
                  setPassword(e.target.value)
                }


                required


              />



            </div>








            <button


              className="login-btn"


              type="submit"


              disabled={loading}



            >


              {
                loading
                ?
                "Signing In..."
                :
                "Login"
              }



            </button>






          </form>








          <div className="divider">

            <span>
              OR
            </span>


          </div>








          <p className="register-text">


            Don't have an account?



          </p>








          <button


            className="register-btn"


            onClick={()=>
              navigate("/register")
            }



          >

            Create Account


          </button>






        </div>





      </div>





    </div>



  );


}


export default Login;