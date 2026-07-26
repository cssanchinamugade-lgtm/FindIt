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

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        "http://https://findit-backend-lees.onrender.com/api/lost-items"
      );

      const report = response.data.find((item) => item._id === id);

      if (report) {
        setItemName(report.itemName);
        setCategory(report.category);
        setDescription(report.description);
        setLocation(report.location);
        setDate(report.date.split("T")[0]);
        setContact(report.contact);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://https://findit-backend-lees.onrender.com/api/lost-items/${id}`,
        {
          itemName,
          category,
          description,
          location,
          date,
          contact,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Report Updated Successfully");

      navigate("/my-reports");
    } catch (error) {
      console.log(error);
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

        <button className="submit-btn" type="submit">
          Update Report
        </button>
      </form>
    </div>
  );
}

export default EditReport;