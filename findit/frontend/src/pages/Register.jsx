import axios from "axios";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


 const handleRegister = async (e) => {
  e.preventDefault();

  if (!name || !email || !phone || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(
      "https://findit-backend-lees.onrender.com/api/auth/register",
      {
        name,
        email,
        phone,
        password,
      }
    );

    alert(response.data.message);

    navigate("/login");
  } catch (error) {
    alert(error.response?.data?.message || "Registration failed");
  }
};




  return (

    <div className="register-page">

      <div className="register-card">

        <h1>Create Account</h1>

        <p>
          Join FindIt today
        </p>



        <form 
          className="register-form"
          onSubmit={handleRegister}
        >


          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />



          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />



          <label>Phone Number</label>

          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />



          <label>Password</label>

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />



          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />



          <button>
            Register
          </button>


        </form>



        <p className="login-text">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>


      </div>

    </div>

  );

}

export default Register;

