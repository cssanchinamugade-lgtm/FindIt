
import "./ReportLost.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [contact, setContact] = useState("");

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const BACKEND_URL = "https://findit-backend-lees.onrender.com";

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/lost-items`
      );

      const report = response.data.find((item) => item._id === id);

      if (report) {
        setItemName(report.itemName);
        setCategory(report.category);
        setDescription(report.description);
        setLocation(report.location);
        setDate(report.date.split("T")[0]);
        setContact(report.contact);
        setExistingImage(report.image || "");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load report.");
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("itemName", itemName);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("date", date);
      formData.append("contact", contact);

      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        `${BACKEND_URL}/api/lost-items/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Report Updated Successfully");

      navigate("/my-reports");
    } catch (error) {
      console.log("UPDATE REPORT ERROR:", error.response?.data || error);
      alert("Failed to update report.");
    }
  };

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>Edit Report</h1>
      </div>

      <form onSubmit={handleUpdate} className="report-form">

        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Current Photo</label>

          {existingImage ? (
            <img
              src={`${BACKEND_URL}/uploads/${existingImage}`}
              alt="Current item"
              style={{
                width: "200px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
          ) : (
            <p>No photo uploaded.</p>
          )}
        </div>

        <div className="form-group">
          <label>Choose New Photo</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {image && (
          <div className="form-group">
            <label>New Photo Preview</label>

            <img
              src={URL.createObjectURL(image)}
              alt="New item preview"
              style={{
                width: "200px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          </div>
        )}

        <button className="submit-btn" type="submit">
          Update Report
        </button>

      </form>
    </div>
  );
}

export default EditReport;
