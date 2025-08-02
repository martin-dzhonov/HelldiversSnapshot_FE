import React, { useState } from "react";
import "../styles/App.css";

import logo1 from "../assets/logos/partner_small.webp";
import logo2 from "../assets/logos/partner_large.png";

export default function PartnerButton() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <img
                src={logo1}
                alt="Partner Logo"
                className="partner-logo"
                onClick={() => setShowPopup((v) => !v)}
            />

            {showPopup && (
                <div className="popup-container">
                    <div className="popup-tab text-small">Our Partners</div>
                    <img src={logo2} alt="Popup Logo" className="popup-logo" />
                    <div className="link-row">
                        <a href="https://www.reddit.com/r/382ndCSG" className="partner-link" target="_blank" rel="noopener noreferrer">REDDIT</a>
                        <a href="https://discord.com" className="partner-link" target="_blank" rel="noopener noreferrer">DISCORD</a>
                    </div>
                </div>
            )}
        </>
    );
}