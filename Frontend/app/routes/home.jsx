import { useState } from "react";
import "../styles/home.scss";

// export function links() {
// //   return [{ rel: "stylesheet", href: styles }];
// }

export default function Home() {
  // Mock data for joined groups
  const [joinedGroups, setJoinedGroups] = useState([
    { id: 1, name: "Tech Enthusiasts" },
    { id: 2, name: "Hiking Buddies" },
    { id: 3, name: "Language Exchange" },
  ]);

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
        <button className="join-group-button">Join a New Group</button>
      </main>
    </div>
  );
}