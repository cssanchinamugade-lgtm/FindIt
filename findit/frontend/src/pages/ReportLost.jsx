import { useState } from "react";
import "./ReportLost.css";


function ReportLost() {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        date: "",
        contact: ""
    });


    const [image, setImage] = useState(null);

    const [message, setMessage] = useState("");


    // Automatically select backend
    const API_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://findit-backend-lees.onrender.com";


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

            // =========================
            // GET USER
            // =========================

            const user = JSON.parse(
                localStorage.getItem("user")
            );


            // =========================
            // GET TOKEN
            // =========================

            const token =
                localStorage.getItem("token");


            // =========================
            // CHECK LOGIN
            // =========================

            if (!user || !token) {

                setMessage(
                    "Please login first"
                );

                return;
            }


            // =========================
            // GET USER ID
            // =========================

            const userId =
                user._id ||
                user.id ||
                user.userId;


            console.log(
                "Logged in user:",
                user
            );


            console.log(
                "User ID:",
                userId
            );


            // =========================
            // CHECK USER ID
            // =========================

            if (!userId) {

                setMessage(
                    "User ID not found. Please logout and login again."
                );

                return;
            }


            // =========================
            // CREATE FORMDATA
            // =========================

            const data = new FormData();


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


            data.append(
                "contact",
                formData.contact
            );


            data.append(
                "userId",
                userId
            );


            // =========================
            // IMAGE
            // =========================

            if (image) {

                data.append(
                    "image",
                    image
                );

            }


            // =========================
            // SEND REQUEST
            // =========================

            const response = await fetch(
                `${API_URL}/api/lost-items`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: data
                }
            );


            // =========================
            // RESPONSE
            // =========================

            const result =
                await response.json();


            console.log(
                "Lost Item Response:",
                result
            );


            // =========================
            // SUCCESS
            // =========================

            if (response.ok) {

                setMessage(
                    "Lost item reported successfully! 🎉"
                );


                // Clear form

                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    location: "",
                    date: "",
                    contact: ""
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
                "Server error. Please check the backend."
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


                    {/* ITEM NAME */}

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter item name (Phone, Wallet, Bag...)"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />


                    {/* DESCRIPTION */}

                    <textarea
                        name="description"
                        placeholder="Describe the item, color, brand, unique marks..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />


                    {/* CATEGORY */}

                    <input
                        type="text"
                        name="category"
                        placeholder="Category (Wallet, Phone, Bag)"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />


                    {/* LOCATION */}

                    <input
                        type="text"
                        name="location"
                        placeholder="Lost Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />


                    {/* DATE */}

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />


                    {/* CONTACT */}

                    <input
                        type="text"
                        name="contact"
                        placeholder="Contact Number"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />


                    {/* IMAGE */}

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


                    {/* SUBMIT */}

                    <button type="submit">

                        Submit Lost Report

                    </button>


                </form>

            </div>

        </div>

    );
}


export default ReportLost;