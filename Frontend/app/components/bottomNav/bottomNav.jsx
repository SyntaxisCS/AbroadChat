import "./bottomNav.scss";

export default function BottomNav() {
    return (
        <nav className="bottomNav">
            <div className="icon">
                <i className="bx bxs-home-smile" />
                <p>Home</p>
            </div>
            <div className="icon">
                <i className="bx bxs-conversation" />
                <p>Chats</p>
            </div>
        </nav>
    )
};