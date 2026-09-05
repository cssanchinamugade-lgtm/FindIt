import { useState } from "react";
import "./ReportLost.css";

function ReportLost() {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        date: ""
    });

    const [image, setImage] = useState(null);

    const [message, setMessage] = useState("");


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");


        try {

            // Get logged-in user
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            // Get login token
            const token = localStorage.getItem("token");


            // Check whether user is logged in
            if (!user || !token) {

                setMessage("Please login first");

                return;

            }


            // Create FormData
            const data = new FormData();


            // IMPORTANT:
            // Backend expects "itemName"
            // so we send title as itemName

            data.append(
                "itemName",
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


            // Send user ID
            data.append(
                "userId",
                user._id
            );


            // Add image if selected
            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            // Send request to Render backend
            const response = await fetch(
                "https://findit-backend-lees.onrender.com/api/lost-items",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: data
                }
            );


            // Get backend response
            const result = await response.json();


            if (response.ok) {

                setMessage(
                    "Lost item reported successfully!"
                );


                // Clear form
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    location: "",
                    date: ""
                });


                // Clear image
                setImage(null);


                // Clear file input
                const fileInput =
                    document.getElementById(
                        "lost-image"
                    );

                if (fileInput) {

                    fileInput.value = "";

                }

            }

            else {

                setMessage(
                    result.message ||
                    "Something went wrong"
                );

            }

        }

        catch (error) {

            console.error(
                "Report Lost Error:",
                error
            );

            setMessage(
                "Server error"
            );

        }

    };


    return (

        <div className="report-container">

            <div className="report-card">

                <h2>
                    🚨 Report Lost Item
                </h2>


                {message && (

                    <p className="message">
                        {message}
                    </p>

                )}


                <form onSubmit={handleSubmit}>

                    {/* Item Name */}

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter item name (Phone, Wallet, Bag...)"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />


                    {/* Description */}

                    <textarea
                        name="description"
                        placeholder="Describe the item, color, brand, unique marks..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />


                    {/* Category */}

                    <input
                        type="text"
                        name="category"
                        placeholder="Category (Wallet, Phone, Bag)"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />


                    {/* Location */}

                    <input
                        type="text"
                        name="location"
                        placeholder="Lost Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />


                    {/* Date */}

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />


                    {/* Image */}

                    <label className="upload-label">

                        📷 Upload Item Image

                        <input
                            id="lost-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {

                                setImage(
                                    e.target.files[0]
                                );

                            }}
                        />

                    </label>


                    {/* Submit */}

                    <button type="submit">

                        Submit Lost Report

                    </button>


                </form>

            </div>

        </div>

    );

}


export default ReportLost;