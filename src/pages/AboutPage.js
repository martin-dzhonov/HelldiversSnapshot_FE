import "../styles/App.css";
import "../styles/AboutPage.css";
import DonateButton from "../components/DonateButton";

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
                    loadout data for high difficulties(7-10), in the name of Democracy,
                    science and such
                </div>
                <div className="about-text-large">Data Collection:</div>
                <div className="about-text">
                    &#8226; Match data is gathered through a dummy player
                    queuing Quickmatch and screenshotting loadout/briefing screens
                </div>
                <div className="about-text">
                    &#8226; Screenshots are parsed into raw data through combination of OCR and pixel matching,
                    reading player loadouts, difficulty level, planet, faction, etc
                </div>
                <div className="about-text">
                    &#8226; Data is visualized into hopefully easy-to-read graphs and trends
                </div>
                <div className="about-text-large">
                    Disclaimers:
                </div>
                <div className="about-text">
                    &#8226; Enemy subfaction/surges data may be missing for certain patch periods, depending on the current content rotation and Major Orders
                </div>
                <div className="about-text">
                    &#8226; Enemy subfaction/surges data available from Machinery Of Oppression onwards
                </div>
                <div className="about-text">
                    &#8226; Avg. player level and weapons data available from Servants of Freedom onwards
                </div>
                <div className="about-text">
                    &#8226; Armor data available from Masters of Ceremony onwards
                </div>
                <div className="about-text">
                    &#8226; Some players may be snapshotted with partial/no strategems if snapshotted during picking phase, they are excluded from the data calculations
                </div>
                <div className="about-text-large">Contact</div>
                <div className="about-text about-text-contact">
                    For feedback, suggestions, or anything else, you can visit
                    our <a href="https://discord.gg/TPB89jp5HK">Discord</a> or
                    message us on{" "}
                    <a href="https://www.reddit.com/user/Natural-Sympathyy">Reddit</a>
                </div>
                <div className="about-text-large">Resources</div>
                <div className="about-text about-text-contact">
                    Home page backgrounds courtesy of <a href="https://www.youtube.com/@K.C-LAB">K.C.</a> and
                    {" "}<a href="https://www.youtube.com/@butterbug">Butter Bug</a>
                </div>
                <div className="about-text about-text-contact">
                    Weapons/Armors icons courtesy of <a href="https://helldivers.wiki.gg/">Helldivers.wiki.gg</a>
                </div>
                <div className="about-text about-text-contact">
                    Strategem icons courtesy of <a href="https://github.com/nvigneux/Helldivers-2-Stratagems-icons-svg">nvigneux</a>
                </div>
                

                <DonateButton />
            </div>
        </div>
    );
}

export default AboutPage;
