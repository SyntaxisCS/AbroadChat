import { useEffect } from "react";
import { NavLink } from "@remix-run/react";
import "../styles/meetup.scss";

export default function Meetup() {
    return (
        <div className="meetupContainer">
            <header className="chatHeader">
                <div className="leftGroup">
                    <NavLink to="/chat/id">
                        <i className="bx bx-left-arrow-alt" />
                    </NavLink>
                    <span className="groupName">Recommended Meetup Spots</span>
                </div>
            </header>
            <main className="mainContent">
                <div className="meetingSpots">
                    <div className="meetingSpot">
                        <i className="bx bxs-star" />
                        <h2 className="name">Kudu</h2>
                        <p className="type">Coffee Shop</p>
                        <p className="distance">2 mins away (0.3 miles)</p>
                    </div>

                    <div className="meetingSpot">
                        <i className="bx bxs-star" />
                        <h2 className="name">Island Provisions</h2>
                        <p className="type">Coffee Shop</p>
                        <p className="distance">5 mins away (0.7 miles)</p>
                    </div>

                    <div className="meetingSpot">
                        <i className="bx bxs-star" />
                        <h2 className="name">The Rise</h2>
                        <p className="type">Coffee Shop</p>
                        <p className="distance">10 mins away (1.7 miles)</p>
                    </div>

                    <div className="meetingSpot">
                        <h2 className="name">The Harbinger</h2>
                        <p className="type">Cafe & Bakery</p>
                        <p className="distance">7 mins away (1.2 miles)</p>
                    </div>

                    <div className="meetingSpot">
                        <h2 className="name">Basic Kitchen</h2>
                        <p className="type">restaurant</p>
                        <p className="distance">15 mins away (3.4 miles)</p>
                    </div>
                </div>
            </main>
        </div>
    );
};