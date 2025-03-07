import "../styles/App.css";

function AboutPage() {
    return (
        <div className="content-wrapper">
        <div className="about-wrapper">
            <div className="about-text-title">
                Greetings Helldivers, and welcome to{" "}
                <span className="about-text-title-highlight">Helldive.Live</span>
            </div>
            <div className="about-text">
                This is a project aimed at bringing live, detailed player
                loadout data for difficulties 7-10, in the name of Democracy,
                science and such.
            </div>
            <div className="about-text-large">Data Collection:</div>
            <div className="about-text">
                &#8226; Match data is gathered through a dummy player running
                random quickmatches and screenshotting loadout/briefing screens
            </div>
            <div className="about-text">
                &#8226; Screenshot data is read by OCR scripts parsing
                player loadouts, mission difficulty, type, planet, faction, etc
            </div>
            <div className="about-text">
                &#8226; Data is then visualized into hopefully easy-to-read graphs and trends
            </div>
            <div className="about-text-large">
                Disclaimers and known issues:
            </div>
            <div className="about-text">
                &#8226; No planet modifiers data before Patch 01.000.400 (June 13th 2024)
            </div>
            <div className="about-text">
                &#8226; Sub 0.1% pick rate strategems may not have data for companions/dificulty/mission lenght charts
            </div>
            <div className="about-text">
                &#8226; Data for difficulty 7 before Servants of Freddom has a small number of diff 6 games
            </div>
            
            <div className="about-text-large">Contact</div>
            <div className="about-text about-text-contact">
                For feedback, suggestions, or anything else, you can visit
                our <a href="https://discord.gg/TPB89jp5HK">Discord</a> or
                message us on{" "}
                <a href="https://www.reddit.com/user/Natural-Sympathyy">Reddit</a>.
            </div>
        </div>
    </div>
    );
}

export default AboutPage;
