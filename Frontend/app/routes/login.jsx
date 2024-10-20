import "../styles/login.scss";
import { useNavigate } from "@remix-run/react";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="signinContainer">
            <img src={"/glove.png"} />

            <div className="loginCtner">
                <h1>Welcome Back</h1>
                <div className="loginOptions">
                    <div className="option">
                        <i className="bx bxl-apple" />
                        <span>Continue with Apple</span>
                    </div>

                    <div className="option" onClick={() => navigate("/home")}>
                        <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.2449 9.85646V13.8H19.1898C18.9092 15.4915 17.0918 18.7584 12.2449 18.7584C8.06633 18.7584 4.65408 15.5106 4.65408 11.5C4.65408 7.48937 8.06735 4.24158 12.2449 4.24158C14.6224 4.24158 16.2153 5.18937 17.1276 6.01354L20.448 3.00629C18.3153 1.13658 15.55 0 12.2449 0C5.47449 0 0 5.14146 0 11.5C0 17.8585 5.47449 23 12.2449 23C19.3122 23 24 18.3339 24 11.7626C24 11.0074 23.9133 10.4305 23.8071 9.85646H12.2449Z" fill="#333E52" />
                        </svg>

                        <span>Continue with Google</span>
                    </div>

                    <div className="option">
                        <i className="bx bxl-facebook-circle" />
                        <span>Continue with Facebook</span>
                    </div>

                    <div className="option">
                        <i className="bx bxs-envelope" />
                        <span>Continue with Email</span>
                    </div>

                    <div className="option">
                        <i className="bx bx-lock" />
                        <span>Continue with SSO</span>
                    </div>
                </div>
            </div>

        </div>
    );
}