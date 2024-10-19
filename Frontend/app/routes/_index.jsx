import { json } from "@remix-run/react";
import React from "react";

export const loader = async ({request}) => {

    return json({});
};

export default function Home() {
    return (
        <div className="homePage">
            <h1>Check console</h1>
        </div>
    )
}