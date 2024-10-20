import { useState } from "react";

import "../styles/home.scss";
import { useNavigate } from "@remix-run/react";

// export function links() {
// //   return [{ rel: "stylesheet", href: styles }];
// }

export default function Home() {
  const navigate = useNavigate();
  // Mock data for joined groups
  const [joinedGroups, setJoinedGroups] = useState([
    { id: 1, name: "Tech Enthusiasts" },
    { id: 2, name: "Hiking Buddies" },
    { id: 3, name: "Language Exchange" },
  ]);
  
  const [suggestedGroups, setSuggestedGroups] = useState([
    { id: 4, country: "Colombia", interest: "Coffee", img: "/rounded_spain.png", name: "Colombia Coffee", color: "blue"},
    { id: 5, country: "South America", interest: null, img: "/rounded_american.png", name: "South America", color: "green"},
    { id: 6, country: "Colombia", interest: "Food", img: "/rounded_american.png", name: "Colombia Food", color: "orange" },
    { id: 7, country: "Colombia", interest: "Culture", img: "/rounded_spain.png", name: "Colombia Culture", color: "blue" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleJoinClick = (group) => {
    console.log("this is group: ", group)
    setSelectedGroup(group);
    setShowModal(true);
  };

  const handleConfirmJoin = () => {
    if (selectedGroup) {
      // Navigate to the appropriate chat room
      navigate(`/chat/4`);
    }
    setShowModal(false);
    setSelectedGroup(null);
  };

  const handleCancelJoin = () => {
    setShowModal(false);
    setSelectedGroup(null);
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>Your Groups</h1>
      </header>
      <main className="main-content">
        <section className="groups-section">
          <h2>Joined Groups</h2>
          <ul className="group-list">
            {joinedGroups.map((group) => (
              <li key={group.id} className="group-item">
                {group.name}
              </li>
            ))}
          </ul>
        </section>
        <section className="suggested-groups-section">
          <h2>Suggested Groups</h2>
          <div className="suggested-group-grid">
            {suggestedGroups.map((group) => (
              <div key={group.id} className={`suggested-group-box ${group.color}`} onClick={handleJoinClick}>
                <div className="flag-circle">
                  <img src={group.img} alt="n/a" />
                </div>
                <div className="suggested-group-info">
                  <div className="country">{group.country}</div>
                  <div className="interest">{group.interest}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="join-group-button">Join a New Group</button>
        </section>
        
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Join Colombia Coffee?</h2>
            <p>Are you sure you want to join this group?</p>
            <button className="confirm-button" onClick={handleConfirmJoin}>
              Yes
            </button>
            <button className="cancel-button" onClick={handleCancelJoin}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}