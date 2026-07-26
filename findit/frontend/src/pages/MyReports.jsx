import "./MyReports.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "http://https://findit-backend-lees.onrender.com/api/lost-items/my-reports",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReports(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load reports.");
    }
  };

  const deleteReport = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://https://findit-backend-lees.onrender.com/api/lost-items/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Report deleted successfully!");

      fetchReports();
    } catch (error) {
      console.error(error);
      alert("Failed to delete report.");
    }
  };

  return (
    <div className="myreports-page">
      <h1>My Lost Item Reports</h1>

      {reports.length === 0 ? (
        <h3 className="text-center mt-5">
          You haven't reported any lost items yet.
        </h3>
      ) : (
        <div className="reports-grid">
          {reports.map((item) => (
            <div className="report-card" key={item._id}>
              {item.image ? (
                <img
                  src={`http://https://findit-backend-lees.onrender.com/uploads/${item.image}`}
                  alt={item.itemName}
                  className="report-image"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/400x250?text=No+Image"
                  alt="No Image"
                  className="report-image"
                />
              )}

              <div className="report-content">
                <h2>{item.itemName}</h2>

                <p>
                  <strong>Category:</strong> {item.category}
                </p>

                <p>
                  <strong>Description:</strong> {item.description}
                </p>

                <p>
                  <strong>Location:</strong> {item.location}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(item.date).toLocaleDateString()}
                </p>

                <p>
                  <strong>Contact:</strong> {item.contact}
                </p>

                <div className="report-buttons">
                  <Link
                    to={`/edit-report/${item._id}`}
                    className="btn btn-primary"
                  >
                    Edit
                  </Link>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteReport(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReports;