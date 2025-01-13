import React from 'react';
import { Link } from 'react-router-dom';
import '../../LandingPage.css'; // Import the CSS file

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero bg-light py-5">
        <div className="container text-center">
          <h1 className="display-4 text-light">Welcome to the Freelance Platform</h1>
          <p className="lead text-light">Connecting freelancers with clients for impactful projects</p>
          <div className="d-flex justify-content-center mt-4">
            <Link to="/register" className="btn btn-primary mx-2">Join Us</Link> {/* Join Us Button */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5 bg-white ">
        <div className="container text-center">
          <h2 className="mb-4">Why Choose Our Platform?</h2>
          <div className="row d-flex align-items-center "> {/* Add justify-content-center to center the columns */}
            <div className="col-md-4">
              <div className="feature-card p-4 border rounded">
                <h4>For Freelancers</h4>
                <p>Find clients, showcase your work, and get paid for your skills. Your freelancing journey starts here!</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 border rounded">
                <h4>For Clients</h4>
                <p>Access a wide pool of talented freelancers to bring your ideas to life. Quality work at competitive rates.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 border rounded">
                <h4>Secure Payments</h4>
                <p>We ensure secure and seamless payment options for both freelancers and clients, so you can focus on the work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works mb-5 py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">How It Works</h2>
          <div className="row justify-content-center d-flex align-items-center"> {/* Add justify-content-center to center the columns */}
            <div className="col-md-4">
              <h4>Step 1</h4>
              <p>Create your account as a freelancer or client.</p>
            </div>
            <div className="col-md-4">
              <h4>Step 2</h4>
              <p>Find the perfect projects or hire the best freelancers.</p>
            </div>
            <div className="col-md-4">
              <h4>Step 3</h4>
              <p>Work together and get paid for your efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      
    </div>
  );
};

export default LandingPage;
