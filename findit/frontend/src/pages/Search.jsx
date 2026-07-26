import "./Search.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Search() {
  const navigate = useNavigate();

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [search, setSearch] = useState("");

  const API_URL = "https://findit-backend-lees.onrender.com";

  useEffect(() => {
    fetchLostItems();
    fetchFoundItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/lost-items`
      );

      const data = response.data.map((item) => ({
        ...item,
        status: "Lost",
      }));

      setLostItems(data);
    } catch (error) {
      console.error("Lost Items Error:", error);
    }
  };

  const fetchFoundItems = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/found-items`
      );

      const data = response.data.map((item) => ({
        ...item,
        status: "Found",
      }));

      setFoundItems(data);
    } catch (error) {
      console.error("Found Items Error:", error);
    }
  };

  const allItems = [...lostItems, ...foundItems];

  const filteredItems = allItems.filter((item) => {
    const name = item.itemName || "";
    const category = item.category || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="search-page">

      <h1>🔍 Search Lost & Found Items</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search by item name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="items-container">

        {filteredItems.length === 0 ? (

          <h2>No Items Found</h2>

        ) : (

          filteredItems.map((item) => (

            <div className="item-card" key={item._id}>

              {item.image ? (

                <img
                  src={`${API_URL}/uploads/${item.image}`}
                  alt={item.itemName}
                  className="item-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

              ) : (

                <div
                  className="item-image"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f1f1f1",
                    color: "#666",
                    fontWeight: "bold",
                  }}
                >
                  No Image
                </div>

              )}

              <div className="item-content">

                <h2>{item.itemName}</h2>

                <p>
                  <strong>Status:</strong>{" "}
                  {item.status === "Lost"
                    ? "🔴 Lost"
                    : "🟢 Found"}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {item.category}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {item.description}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {item.location}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {item.date
                    ? new Date(item.date).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  <strong>Contact:</strong>{" "}
                  {item.contact}
                </p>

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() =>
                    navigate(`/chat/${item._id}/${item.userId}`)
                  }
                >
                  💬 Chat with User
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Search;