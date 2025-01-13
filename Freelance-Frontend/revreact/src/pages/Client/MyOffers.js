import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../myoffers.css';

axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const Offers = () => {
  const { projectId } = useParams();
  const [offers, setOffers] = useState([]);
  const [portfolio, setPortfolio] = useState(null); // State to hold portfolio data
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/offers/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch offers');
        setLoading(false);
      }
    };
    fetchOffers();
  }, [projectId]);

  const handleStatusChange = async (offerId, status) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `/offers/${offerId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer._id === offerId ? { ...offer, status: response.data.offer.status } : offer
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update offer status');
    }
  };

  const handleCheckPortfolio = async (freelancerId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/portfolio/user/${freelancerId}/portfolios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch portfolio');
    }
  };

  return (
    <div className="offers">
      <h1>Offers for Project</h1>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <ul className="list-group">
          {offers.map((offer) => (
            <li key={offer._id} className="list-group-item">
              <div className="offer-details">
                <div className="offer-info">
                  <p><strong>Freelancer:</strong> {offer.freelancerId ? offer.freelancerId.name : 'No freelancer assigned'}</p>
                  <p><strong>Offer Amount:</strong> ${offer.bidAmount}</p>
                  <p><strong>Message:</strong> {offer.message}</p>
                  <p><strong>Status:</strong> {offer.status}</p>
                </div>
                <div className="button-group">
                  <button
                    className="check-portfolio-btn"
                    onClick={() => handleCheckPortfolio(offer.freelancerId._id)}
                  >
                    Check Portfolio
                  </button>
                  {offer.status === 'pending' && (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleStatusChange(offer._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusChange(offer._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

{portfolio && (
        <div className="">
          <h2>Portfolio</h2>
          <div className="portfolio-grid">
            {portfolio.map((item, index) => (
              <div key={index} className="portfolio-card">
                <div className="portfolio-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><strong>Skills:</strong> {item.skills.join(', ')}</p>
                </div>
                <div className="portfolio-images">
                  {item.media.map((file, idx) => (
                    <img
                      key={idx}
                      src={`http://127.0.0.1:3000/${file}`}
                      alt={`Media ${idx + 1}`}
                      className="portfolio-image img-fluid w-50"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3" onClick={() => setPortfolio(null)}>Close Portfolio</button>
        </div>
        
      )}
    </div>
    
  );
};

export default Offers;
