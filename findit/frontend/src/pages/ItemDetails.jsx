import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ItemDetails.css";


function ItemDetails(){

    const navigate = useNavigate();
    const {id}=useParams();

    const [item,setItem]=useState(null);


    useEffect(()=>{

        axios
        .get(`http://localhost:5000/api/items/${id}`)
        .then((res)=>{

            setItem(res.data);

        })
        .catch((err)=>{

            console.log(err);

        });


    },[id]);



    if(!item){

        return (

            <h2 className="loading">
                Loading Item...
            </h2>

        );

    }



    return(

        <div className="details-container">


            <div className="details-card">


                <img
                src={item.image}
                alt="item"
                className="details-image"
                />



                <h1>
                    {item.title}
                </h1>



                <span
                className={
                    item.type==="lost"
                    ?
                    "badge lost"
                    :
                    "badge found"
                }
                >

                    {item.type}

                </span>



                <div className="details-info">


                    <p>
                        <b>Category:</b>
                        {item.category}
                    </p>



                    <p>
                        <b>Description:</b>
                        {item.description}
                    </p>



                    <p>
                        <b>Location:</b>
                        {item.location}
                    </p>



                    <p>
                        <b>Date:</b>
                        {item.date}
                    </p>


                </div>



               <button
className="chat-btn"
onClick={() =>
navigate(`/chat/${item._id}/${item.userId}`)
}
>
    Chat With User 💬
</button>


            </div>


        </div>

    );


}


export default ItemDetails;