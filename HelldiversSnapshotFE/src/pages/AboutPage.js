import "../App.css";

function AboutPage() {
    return (
        <div className="content-wrapper">
            <div className="about-wrapper">
                <div className="about-text-title">
                    Grettings Helldivers, and welcome to{" "}
                    <span style={{ color: "#e74c3c" }}>Helldive.Live</span>
                </div>
                <div
                    className="about-text"
                    style={{ paddingLeft: "20px", paddingTop: "0px" }}
                >
                    This is a project aimed at bringing live, detailed player
                    loadout data for difficulties 7-9, in the name of Democracy,
                    science and such
                </div>
                <div
                    className="about-text"
                    style={{ fontSize: "26px", paddingLeft: "20px" }}
                >
                    How does it work ?
                </div>
                <div className="about-text">
                    {" "}
                    &#8226; Match data is gathered through an Autoscript running
                    random quickmatches and screenshotting player loadouts.
                </div>
                <div className="about-text">
                    &#8226; Player screenshots are passed to ORS scripts reading
                    player loadouts, difficulty, mission type from raw
                    screenshot data.
                </div>
                <div className="about-text">
                    &#8226; Data is then visualized according to faction,
                    categories, difficulty, mission types, etc
                </div>
                <div
                    className="about-text"
                    style={{ fontSize: "26px", paddingLeft: "20px" }}
                >
                    Disclaimers and known issues:
                </div>
                <div className="about-text">
                    {" "}
                    &#8226; Ballistic Shield data currently unavailable
                </div>
                <div className="about-text">
                    {" "}
                    &#8226; Data for Automatons for Patch 1.000.300 may be
                    limited for certain low usage stratagems and loadouts{" "}
                </div>
                <div className="about-text">
                    {" "}
                    &#8226; Shield Backpack/Rover Backpacks, 380mm/120mm
                    barrages have 1-3% margin of error due to being confused for
                    each other
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
                    {" "}
                    For feedback, suggestions and anything else, go to:
                    <a
                        className="about-text"
                        href="https://discord.gg/2ZJNZjNF"
                    >
                        https://discord.gg/e7hhKSJt
                    </a>
                    or
                    <a
                        className="about-text"
                        href="https://www.reddit.com/user/aretakembis/"
                    >
                        https://www.reddit.com/user/aretakembis/
                    </a>
                </div>
                or
            </div>
        </div>
    );
}

export default AboutPage;
