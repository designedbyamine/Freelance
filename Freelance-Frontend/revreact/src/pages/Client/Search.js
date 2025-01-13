import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../../search.css'; // Importing the CSS for styling

axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const Search = () => {
  const [filters, setFilters] = useState({
    skills: '',
    rating: '',
    experienceLevel: '',
    location: '',
    hourlyRate: '',
    category: '',
  });
  const [freelancers, setFreelancers] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      setFreelancers([]); // Reset freelancer list before new search
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/freelancer/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setFreelancers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch freelancers');
      setLoading(false);
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
    <div className="container">
      <h1 className="text-center mb-4">Search Freelancers</h1>

      {error && <p className="alert alert-danger">{error}</p>}

      <div className="row">
        <div className="col-md-2 mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            name="skills"
            placeholder="Skills"
            value={filters.skills}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <input
            type="number"
            className="form-control form-control-sm"
            name="rating"
            placeholder="Rating"
            value={filters.rating}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            name="experienceLevel"
            placeholder="Experience"
            value={filters.experienceLevel}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <input
            type="number"
            className="form-control form-control-sm"
            name="hourlyRate"
            placeholder="Hourly Rate"
            value={filters.hourlyRate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <span className="spinner-border spinner-border-sm" /> : 'Search'}
        </button>
      </div>

      {freelancers.length > 0 && (
        <div className="row">
          {freelancers.map((freelancer) => (
            <div key={freelancer._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{freelancer.name}</h5>
                  <p><strong>Skills:</strong> {freelancer.profile.skills.join(', ')}</p>
                  <p><strong>Rating:</strong> {freelancer.profile.rating}</p>
                  <p><strong>Experience Level:</strong> {freelancer.profile.experienceLevel}</p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleCheckPortfolio(freelancer._id)}
                  >
                    View Portfolio
                  </button>
                
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {portfolio && (
        <div className="portfolio mt-4">
          <h2>Portfolio</h2>
          <ul className="port-items">
            {portfolio.map((item, index) => (
              <li key={index} className="mb-3">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p><strong>Skills:</strong> {item.skills.join(', ')}</p>
                <div className="portfolio-media d-flex">
                  {item.media.map((file, idx) => (
                    <img
                      key={idx}
                      src={`http://127.0.0.1:3000/${file}`}
                      alt={`Media ${idx + 1}`}
                      className="img-fluid portfolio-image"
                      style={{ width: '100px', marginRight: '10px' }} // Adjusted for smaller images
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-secondary" onClick={() => setPortfolio(null)}>Close Portfolio</button>
        </div>
      )}
    </div>
  );
};

export default Search;
