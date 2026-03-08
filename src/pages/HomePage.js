import { updates } from '../constants/updates';
import { patchPeriods } from '../constants';
import crimsonStrikeLogo from "../assets/logos/crimson_strike.png";
import hdWikiLogo from "../assets/logos/hd_wiki.png";
import { factionColors, factions } from '../constants';
import { getDataCollectionColors } from '../utils/utils';
import { useDataStatus } from '../hooks/useDataStatus';
import Loader from '../components/Loader';

function HomePage() {

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const { data, isLoading } = useDataStatus();
    const videoSrc = `/home_${randomInt(1, 2)}.mp4`

    return (
        <div className="home-container">
            <video autoPlay loop muted className="video">
                <source src={videoSrc} type="video/mp4" />
            </video>

            <div className="overlay">
                <div className="left-boxes">
                    <div className="box1">
                        <div className="box-title">News & Updates</div>
                        {updates.map((section, i) => (
                            <div key={i} className="update-section">
                                <div className="update-title">{section.title}</div>
                                <ul className="update-items">
                                    {section.items.map((item, j) => (
                                        <li key={j}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="box2">
                        <div className="box-title">Partners & Supporters</div>
                        <div className='partner-section'>
                            <a href="https://discord.com/invite/382ndCSG" target="_blank">
                                <img src={crimsonStrikeLogo} alt="Crimson Strike Logo" className="popup-logo" />
                            </a>
                        </div>
                        <div className='partner-section'>
                            <a href="https://helldivers.wiki.gg/" target="_blank">
                                <img src={hdWikiLogo} alt="HD Wiki Logo" className="hd-wiki-logo-wrapper popup-logo" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="right-box">
                    <div className="box3">
                        <div className="box-title box-title-center">Data Status</div>
                        
                        <Loader loading={isLoading}>
                            <div className="data-collection-subsection-title">Latest Patch</div>
                            <div className="data-collection-text">{patchPeriods[patchPeriods.length - 1].name}</div>

                            <div className="data-collection-subsection-title">Loadouts Collected</div>
                            {data && <div>{factions.map((faction, index) => {
                                return <div className="data-collection-text">
                                    <span style={{ color: factionColors[index] }}>{faction.toUpperCase()}</span> &nbsp;&nbsp;
                                    <span style={{ color: getDataCollectionColors(data[index]) }}>{data[index]}</span>
                                </div>
                            })}</div>}

                            <div className="data-collection-subsection-title">Current Planet</div>
                            <div className="data-collection-text" style={{ color: factionColors[2] }}>HERTHON SECUNDUS</div>
                        </Loader>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;