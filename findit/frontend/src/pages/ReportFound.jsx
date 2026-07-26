import { useState } from "react";
import "./ReportFound.css";


function ReportFound(){


    const [formData,setFormData] = useState({

        title:"",
        description:"",
        category:"",
        location:"",
        date:""

    });



    const [image,setImage] = useState(null);


    const [message,setMessage] = useState("");





    const handleChange = (e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };






    const handleSubmit = async(e)=>{


        e.preventDefault();



        try{


            // Get logged in user

            const user = JSON.parse(
                localStorage.getItem("user")
            );



            if(!user){

                setMessage(
                    "Please login first"
                );

                return;

            }







            const data = new FormData();




            data.append(
                "title",
                formData.title
            );



            data.append(
                "description",
                formData.description
            );



            data.append(
                "category",
                formData.category
            );



            data.append(
                "location",
                formData.location
            );



            data.append(
                "date",
                formData.date
            );




            // Important for profile/chat

            data.append(
                "userId",
                user._id
            );







            if(image){


                data.append(
                    "image",
                    image
                );


            }








            const response = await fetch(

                "http://localhost:5000/api/found-items",

                {

                    method:"POST",

                    body:data

                }

            );








            const result = await response.json();






            if(response.ok){


                setMessage(
                    "Found item reported successfully!"
                );




                setFormData({

                    title:"",
                    description:"",
                    category:"",
                    location:"",
                    date:""

                });



                setImage(null);



            }

            else{


                setMessage(

                    result.message ||
                    "Something went wrong"

                );


            }





        }



        catch(error){


            console.log(error);



            setMessage(
                "Server error"
            );


        }




    };









    return(


        <div className="report-container">


            <div className="report-card">



                <h2>

                    🔎 Report Found Item

                </h2>






                {
                    message &&

                    <p className="message">

                        {message}

                    </p>

                }








                <form onSubmit={handleSubmit}>


                    <input


                    type="text"


                    name="title"


                    placeholder="Enter item name (Phone, Wallet, Bag...)"


                    value={formData.title}


                    onChange={handleChange}


                    required


                    />









                    <textarea


                    name="description"


                    placeholder="Describe the item, color, brand, unique marks..."


                    value={formData.description}


                    onChange={handleChange}


                    required


                    />









                    <input


                    type="text"


                    name="category"


                    placeholder="Category (Wallet, Phone, Bag)"


                    value={formData.category}


                    onChange={handleChange}


                    required


                    />









                    <input


                    type="text"


                    name="location"


                    placeholder="Found Location"


                    value={formData.location}


                    onChange={handleChange}


                    required


                    />









                    <input


                    type="date"


                    name="date"


                    value={formData.date}


                    onChange={handleChange}


                    required


                    />









                    <label className="upload-label">


                        📷 Upload Item Image



                        <input


                        type="file"


                        accept="image/*"


                        onChange={
                            (e)=>setImage(e.target.files[0])
                        }


                        />


                    </label>








                    <button type="submit">


                        Submit Found Report


                    </button>






                </form>





            </div>




        </div>



    );


}



export default ReportFound;