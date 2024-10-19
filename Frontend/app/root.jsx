import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigation,
    useRouteError
} from "@remix-run/react"
import { useEffect, useRef } from "react"

// Components
import LoadingBar from "react-top-loading-bar"
import "./index.scss";

export const meta = () => {
    return [
        // General Meta Tags
        {
            name: "keywords",
            content: ""
        },
    ];
};

export const links = () => {
    return [
        { rel: "icon", href: "/favicon.ico"},
        { rel: "icon", type: "image/png", sizes: "32x32", href:""},
        { rel: "icon", type: "image/png", sizes: "16x16", href:""},
        { rel: "apple-touch-icon", sizes: "180x108", href: ""},
        { rel: "shortcut-icon", href: ""},
        { rel: "manifest", href: ""},
        // Bunny
        { rel: "preconnect", href: "https://fonts.bunny.net"},
        { rel: "stylesheet", href: "https://fonts.bunny.net/css?family=inter:100,200,300,400,500,600,700,800,900|quicksand:300,400,500,600,700" },
        // Boxicons
        { rel: "stylesheet", href: "https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css"}
    ]
};

export const ErrorBoundary = () => {
    const error = useRouteError();

    if (error.status === 404) {
        return (
            <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <Links/>
                <Meta/>
            </head>
            <body>
                <div className="topBar" style={{display: "flex", padding: "20px 50px 20px 50px", justifyContent: "space-between"}}>
                    <a href="/" style={{fontFamily:"'Inter', sans-serif",color: "#040309",fontSize: "18px",fontWeight:"bold",textDecoration:"none"}}>Abroad<span style={{background:"linear-gradient(to right, #6C06f1, #ec4b8a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",textFillColor:"transparent"}}>Chat</span></a>
                    <a href="/" style={{fontFamily: "'Inter', sans-serif", color: "#fcfcfd", padding: "0.5em", textAlign: "center", display: "flex", alignItems: "center", textDecoration: "none", fontSize: "22px", height: "43px", boxSizing: "border-box", backgroundColor: "#6C06f1", borderRadius: "5px"}}>Home</a>
                    
                </div>
                <div id="notfound" style={{ position: "relative", height: "90vh" }}>
                    <div className="notfound" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                        <div className="notfound-404" style={{ position: "relative", height: "240px" }}>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontSize: "232px", fontWeight: "900", margin: "0px", color: "#040309", textTransform: "uppercase", letterSpacing: "-40px", marginLeft: "-20px" }}>
                            <span style={{ textShadow: "-8px 0px 0px #6C06f1" }}>4</span>
                            <span style={{ textShadow: "-8px 0px 0px #6C06f1" }}>0</span>
                            <span style={{ textShadow: "-8px 0px 0px #6C06f1" }}>4</span>
                        </h3>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", position: "relative", fontSize: "16px", fontWeight: "700", textTransform: "uppercase", textAlign: "center", color: "#040309", margin: "0px", letterSpacing: "3px", paddingLeft: "6px" }}>Oops! Page not found</h3>
                        </div>
                        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "20px", fontWeight: "400", textTransform: "uppercase", textAlign: "center", color: "#040309", marginTop: "0px", marginBottom: "25px" }}>
                        we are sorry, but the page you requested was not found
                        </h2>
                    </div>
                </div>

                <ScrollRestoration/>
                <Scripts/>
            </body>
            </html>
        )
    }
};

export default function App() {
    // Utils
    const transition = useNavigation();
    const ref = useRef();

    useEffect(() => {
        if (transition.state === "loading") {
            ref.current.continuousStart();
        }

        if (transition.state === "idle") {
            ref.current.complete();
        }
    }, [transition.state]);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <Links/>
                <Meta/>
            </head>
            <body>
                <div id="root">
                    <LoadingBar color="#6e06f1" ref={ref}/>
                    <Outlet/>
                    <ScrollRestoration/>
                    <Scripts/>
                </div>
            </body>
        </html>
    );
};