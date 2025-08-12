import React, { useState } from "react";
import "../styles/App.css";

import logoImg from "../assets/logos/partner_small.webp";
import bannerImg from "../assets/logos/partner_large.png";

export default function PartnerButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [bannerLoad, setBannerLoad] = useState(false);

  return (
    <>
      <img
        src={logoImg}
        alt="Partner Logo"
        className="partner-logo"
        onClick={() => setShowPopup((v) => !v)}
      />

      {showPopup && (
        <div className="popup-overlay" style={{ display: bannerLoad ? "block" : "none" }}
          onClick={() => setShowPopup(false)}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <div
              className="popup-tab text-small"
              style={{ display: bannerLoad ? "block" : "none" }}
            >
              Our Partners
            </div>
            <img
              src={bannerImg}
              alt="Popup Logo"
              className="popup-logo"
              onLoad={() => setBannerLoad(true)}
              style={{ display: bannerLoad ? "block" : "none" }}
            />
            {bannerLoad && (
              <div className="link-row">
                <a
                  href="https://discord.com/invite/382ndCSG"
                  className="partner-link"
                  target="_blank"
                  rel="noopener noreferrer">
                  DISCORD
                </a>
                <a
                  href="https://www.reddit.com/r/382ndCSG"
                  className="partner-link"
                  target="_blank"
                  rel="noopener noreferrer">
                  REDDIT
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
