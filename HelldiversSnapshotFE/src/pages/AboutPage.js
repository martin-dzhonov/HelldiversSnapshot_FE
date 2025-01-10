import "../styles/App.css";

function AboutPage() {
    return (
        <div className="content-wrapper">
        <div className="about-wrapper">
            <div className="about-text-title">
                Greetings Helldivers, and welcome to{" "}
                <span className="about-text-title-highlight">Helldive.Live</span>
            </div>
            <div className="about-text about-text-padded">
                This is a project aimed at bringing live, detailed player
                loadout data for difficulties 7-10, in the name of Democracy,
                science and such.
            </div>
            <div className="about-text about-text-large">How does it work?</div>
            <div className="about-text">
                &#8226; Match data is gathered through an Autoscript running
                random quickmatches and screenshotting loadout/briefing screens
            </div>
            <div className="about-text">
                &#8226; Match screenshot data is read by OCR scripts parsing
                player loadouts, mission difficulty, type, planet, faction, etc
            </div>
            <div className="about-text">
                &#8226; Data is then visualized into hopefully easy-to-read graphs and trends
            </div>
            <div className="about-text about-text-large">
                Disclaimers and known issues:
            </div>
            <div className="about-text">
                &#8226; No planet modifiers data before Patch 01.000.400 (June 13th 2024)
            </div>
            <div className="about-text">
                &#8226; Companion picks data for low pick rate stratagems (Eagle/Orbital Smoke, etc.) may be limited
            </div>
            <div className="about-text about-text-large">Contact</div>
            <div className="about-text about-text-contact">
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
