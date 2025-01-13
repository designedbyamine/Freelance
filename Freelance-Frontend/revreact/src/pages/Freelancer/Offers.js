import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../offers.css'; // Import the CSS file
axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);
  

  // Function to fetch offers
  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Get the token from localStorage

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      // Fetch offers
      const response = await axios.get("/offers/freelancer", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the header
        },
      });

      setOffers(response.data); // Set fetched offers
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Not authorized. Please log in again.");
      } else {
        setError("Error fetching offers.");
      }
    }
  };

  // Fetch offers when the component mounts
  useEffect(() => {
    fetchOffers();
  }, []);

  // Render the list of offers
  return (
    <div className="offers-container">
      <h2>Your Offers</h2>
      {error && <p className="error">{error}</p>}
      <ul className="offers-list">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <li key={offer._id} className="offer-item">
              <h3>Project: {offer.projectId ? offer.projectId.title : "Unknown"}</h3>
              <p>Description: {offer.projectId ? offer.projectId.description : "No description"}</p>
              
              {/* Display the message */}
              <div className="offer-message">
                <p><strong>Message:</strong> {offer.message || "No message available."}</p>
              </div>

              <div className="offer-details">
                <p>Bid Amount: ${offer.bidAmount}</p>
                <p>Estimated Time: {offer.estimatedTime}</p>
              </div>
              <div>
                <span className={`status-badge status-${offer.status.toLowerCase()}`}>
                  {offer.status}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p>No offers available.</p>
        )}
      </ul>
    </div>
  );
};

export default Offers;
