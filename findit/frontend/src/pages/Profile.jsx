import { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import "./Profile.css";


function Profile(){


const user = JSON.parse(
    localStorage.getItem("user")
);



const [stats,setStats]=useState({

    lostReports:0,

    foundReports:0

});





useEffect(()=>{


    const getStats = async()=>{


        const response = await fetch(

        `http://localhost:5000/api/dashboard/${user._id}`

        );


        const data = await response.json();


        setStats(data);


    };


    if(user){

        getStats();

    }


},[]);






return(


<div className="profile-page">


<div className="profile-card">



<div className="profile-top">


<FaUserCircle className="profile-image"/>


<h2>
{user?.name}
</h2>


<span className="user-badge">
FindIt Member
</span>


</div>





<div className="profile-info">


<div className="info-box">


<FaEnvelope/>


<div>

<small>
Email
</small>


<p>
{user?.email}
</p>


</div>


</div>


</div>







<div className="stats">


<div>

<h3>
{stats.lostReports}
</h3>

<p>
Lost Reports
</p>

</div>




<div>

<h3>
{stats.foundReports}
</h3>

<p>
Found Reports
</p>

</div>



</div>




</div>


</div>


);


}


export default Profile;