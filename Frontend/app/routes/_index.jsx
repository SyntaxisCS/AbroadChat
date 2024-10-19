import { json } from "@remix-run/react";
import "../styles/landing.scss";
import { Link } from "@remix-run/react";
import React from "react";

export const loader = async ({request}) => {

    return json({});
};

export default function Home() {
    return (
        <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to WanderPals</h1>
        <p>Connecting wanderers from home, Abroad</p>
        <div className="button-group">
          <Link to="/signup" className="button signup-button">Sign Up</Link>
          <Link to="/login" className="button signin-button">Sign In</Link>
        </div>
      </div>
    </div>
    )
}