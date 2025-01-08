import "../styles/App.css";

function AboutPage() {
    return (
        <div className="content-wrapper">
            <div className="about-wrapper">
                <div className="about-text-title">
                    Greetings Helldivers, and welcome to{" "}
                    <span style={{ color: "#e74c3c" }}>Helldive.Live</span>
                </div>
                <div
                    className="about-text"
                    style={{ paddingLeft: "20px", paddingTop: "0px" }}
                >
                    This is a project aimed at bringing live, detailed player
                    loadout data for difficulties 7-10, in the name of Democracy,
                    science and such.
                </div>
                <div
                    className="about-text"
                    style={{ fontSize: "26px", paddingLeft: "20px" }}
                >
                    How does it work ?
                </div>
                <div className="about-text">
                    &#8226; Match data is gathered through an Autoscript running
                    random quickmatches and screenshotting loadout/briefing screens
                </div>
                <div className="about-text">
                    &#8226; Match screenshot data is read through OCR scripts parsing
                    player loadouts, mission difficulty, type, planet, faction, etc
                </div>
                <div className="about-text">
                    &#8226; Data is then visualized into hopefully easy-to-read graphs and trends
                </div>
                <div
                    className="about-text"
                    style={{ fontSize: "26px", paddingLeft: "20px" }}
                >
                    Disclaimers and known issues:
                </div>
                <div className="about-text">
                    &#8226; No mission modifiers data before Patch 01.000.400 (June 13th 2024)
                </div>
                <div className="about-text">
                    &#8226; Companion picks data for low pick rate stratagems (Eagle/Orbital Smoke, etc.) may be limited
                </div>
                <div
                    className="about-text"
                    style={{ fontSize: "26px", paddingLeft: "20px" }}
                >
                    Contact
                </div>
                <div
                    className="about-text"
                    style={{ paddingLeft: "20px", paddingTop: "10px" }}
                >
                    For feedback, suggestions, or anything else, you can visit
                    our <a href="https://discord.gg/2ZJNZjNF">Discord</a> or
                    message us on{" "}
                    <a href="https://www.reddit.com/user/aretakembis/">Reddit</a>.
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
