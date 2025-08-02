import "../styles/App.css";
import "../styles/AboutPage.css";
import DonateWidget from "../components/DonateWidget";
import DonateButton from "../components/DonateButton";

function AboutPage() {
    return (
        <div className="content-wrapper">
            
            <DonateButton />

            <div className="about-wrapper">
                <div className="about-text-title">
                    Greetings Helldivers, and welcome to{" "}
                    <span className="about-text-title-highlight">Helldive.Live</span>
                </div>
                <div className="about-text">
                    This is a project aimed at bringing live, detailed player
                    loadout data for high difficulties(7-10), in the name of Democracy,
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
                    Disclaimers:
                </div>
                <div className="about-text">
                    &#8226; Avg. player level and weapons data available from Servants of Freedom onwards
                </div>
                <div className="about-text">
                    &#8226; Armor data available from Masters of Ceremony onwards
                </div>
                <div className="about-text">
                    &#8226; Sub 1% pick rate items may have incomplete data for companions/dificulty/mission lenght charts
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
