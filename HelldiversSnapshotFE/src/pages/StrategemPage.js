import '../App.css';
import { useEffect, useState, useMemo } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useParams, useNavigate } from 'react-router-dom';
import * as settings from "../settings/chartSettings";
import { baseLabels, baseIconsSvg, apiBaseUrl, patchPeriods, itemCategories } from '../constants';
import { getItemName, getItemColor, getCountingSuffix, getItemCategory, getPercentage, getRankedDict, getMissionLenght, filterByPatch } from '../utils';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend
);

function StrategemPage() {
    const navigate = useNavigate();
    let { itemId } = useParams();
    let { factionId } = useParams();

    const [factionName, setFactionName] = useState(factionId);
    const [dataLoading, setDataLoading] = useState(true);
    const [data, setData] = useState({
        faction: null,
        strategem: null
    });
    const [filters, setFilters] = useState({
        period: {
            id: patchPeriods[1].id,
            start: patchPeriods[1].start,
            end: patchPeriods[1].end
        },
    });

    const [graphData, setGraphData] = useState(null);
    const [graphData1, setGraphData1] = useState(null);
    const [graphData2, setGraphData2] = useState(null);
    const [graphData3, setGraphData3] = useState(null);

    const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    useEffect(() => {
        if (factionName && itemId && filters.period) {
            setDataLoading(true);

            const fetchFaction = fetch(apiBaseUrl + `/faction/${factionName}`)
                .then(response => response.json());

            const fetchAutomaton = fetch(apiBaseUrl + `/faction/automaton`)
                .then(response => response.json());

            const fetchTerminid = fetch(apiBaseUrl + `/faction/terminid`)
                .then(response => response.json());

            const fetchStrategem = fetch(apiBaseUrl + `/games/${factionName}/${itemId}`)
                .then(response => response.json());

            Promise.all([fetchFaction, fetchStrategem, fetchAutomaton, fetchTerminid]).then((res) => {
                setData({
                    faction: res[0].filter((game) => filterByPatch(filters.period.id, game)),
                    strategem: res[1].filter((game) => filterByPatch(filters.period.id, game)),
                    automaton: res[2].filter((game) => filterByPatch(filters.period.id, game)),
                    terminid: res[3].filter((game) => filterByPatch(filters.period.id, game)),
                    patch300: res[0].filter((game) => filterByPatch("1.000.300", game)),
                    patch400: res[0].filter((game) => filterByPatch("1.000.400", game)),
                })
                setDataLoading(false);
            })
        }
    }, [factionName, itemId, filters])

    const itemsRankings = useMemo(() => {
        if (data?.faction) {
            const factionDict = getRankedDict(data.faction, "All");
            return factionDict[itemId];
        }
    }, [data]);

    useEffect(() => {
        if (data.faction && data.strategem) {

            const loadoutsByDiff = { 7: 0, 8: 0, 9: 0 };
            const itemLoadoutsByDiff = Object.assign({}, loadoutsByDiff);
            const loadoutsByMission = { "Short": 0, "Long": 0 };
            const itemLoadoutsByMission = Object.assign({}, loadoutsByMission);

            data.faction.forEach((game) => {
                game.players.forEach((loadout) => {
                    loadoutsByDiff[game.difficulty]++;
                    loadoutsByMission[getMissionLenght(game.missionName)]++;
                })
            });

            data.strategem.forEach((game) => {
                game.players.forEach((loadout) => {
                    if (loadout.includes(itemId)) {
                        itemLoadoutsByDiff[game.difficulty]++;
                        itemLoadoutsByMission[getMissionLenght(game.missionName)]++;
                    }
                })
            })

            setGraphData({
                labels: width > 1200 ? ["7 - Suicide Mission", "8 - Impossible", "9 - Helldive"] : ["7", "8", "9"],
                datasets: [{
                    data: Object.keys(loadoutsByDiff).map((diff, index) => {
                        return getPercentage(itemLoadoutsByDiff[diff], loadoutsByDiff[diff], 1)
                    }),
                    backgroundColor: getItemColor(itemId),
                    barThickness: 24,
                }],
            });



            setGraphData1({
                labels: ["Short", "Long"],
                datasets: [{
                    data: Object.keys(loadoutsByMission).map((name, index) => {
                        return getPercentage(itemLoadoutsByMission[name], loadoutsByMission[name], 1)
                    }),
                    backgroundColor: getItemColor(itemId),
                    barThickness: 24,
                }],
            });

            console.log(getRankedDict(data.automaton, "All")[itemId])
            setGraphData2({
                labels: ["Automaton", "Terminid"],
                datasets: [{
                    data: [getRankedDict(data.automaton, "All")[itemId].percentageLoadouts, getRankedDict(data.terminid, "All")[itemId].percentageLoadouts],
                    backgroundColor: ["#de7b6c", "rgb(255,182,0)"],
                    barThickness: 24,
                }],
            });

            setGraphData3({
                labels: ["Patch 1.000.300", "Patch 1.000.400"],
                datasets: [{
                    data: [getRankedDict(data.patch300, "All")[itemId].percentageLoadouts, getRankedDict(data.patch400, "All")[itemId].percentageLoadouts],
                    backgroundColor: getItemColor(itemId),
                    barThickness: 24,
                }],
            });
        }
    }, [data])

    function capitalizeFirstLetter(str) {
        if (str.length === 0) return str; // Return the string as is if it is empty
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className='content-wrapper'>
            <div className='item-details-title-wrapper'>
                <div className='strategem-details-title'>
                    <div className='item-details-img-wrapper'><img src={baseIconsSvg[baseLabels.indexOf(itemId)]}></img></div>
                    <div className='item-details-title-text'>{getItemName(itemId, "long")}</div>
                </div>
                <div className='strategem-details-filters-container'>
                    <div className='strategem-details-filter-container'>
                        <DropdownButton
                            className='dropdown-button'
                            title={"Faction: " + capitalizeFirstLetter(factionName)}>
                            <Dropdown.Item as="button"
                                onClick={() => { setFactionName('terminid') }}>
                                Terminid
                            </Dropdown.Item>
                            <Dropdown.Item as="button"
                                onClick={() => { setFactionName('automaton') }}>
                                Automaton
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <div className='strategem-details-filter-container'>
                        <DropdownButton
                            className='dropdown-button'
                            title={"Patch: " + filters.period.id}>
                            {patchPeriods.map((patchPeriod, index) =>
                                <Dropdown.Item as="button"
                                    onClick={() => { setFilters({ ...filters, period: patchPeriod }) }}>
                                    {`${patchPeriod.id === "All" ? "" : "Patch"} ${patchPeriod.id} : ${patchPeriod.start} - ${patchPeriod.end}`}
                                </Dropdown.Item>
                            )}
                        </DropdownButton>
                    </div>


                </div>
            </div>
            <div className='strategem-divier'></div>

            <div className='strategem-section-container'>
                <div className='strategem-rankings-container'>
                    {dataLoading ?
                        <div className="spinner-faction-container">
                            <div className="lds-dual-ring"></div>
                        </div> :
                        <>
                            <div className='strategem-rankings-item'>
                                <div className='strategem-rankings-number' style={{ color: "rgb(255,182,0)" }}>{itemsRankings?.rankTotal}
                                    <span className='strategem-rankings-number-small'>{getCountingSuffix(itemsRankings?.rankTotal)}</span>
                                </div>
                                <div className='strategem-rankings-text-wrapper'>
                                    <div className='strategem-rankings-text-small'>in</div>
                                    <div className='strategem-rankings-text-small'>All Strategem</div>
                                </div>
                            </div>
                            <div className='strategem-rankings-item'>
                                <div className='strategem-rankings-number' style={{ color: getItemColor(itemId) }}>
                                    {itemsRankings?.rankCategory}
                                    <span className='strategem-rankings-number-small'>{getCountingSuffix(itemsRankings?.rankCategory)}</span>
                                </div>
                                <div className='strategem-rankings-text-wrapper'>
                                    <div className='strategem-rankings-text-small'>in</div>
                                    <div className='strategem-rankings-text-small'>{getItemCategory(itemId)}</div>
                                </div>
                            </div>
                            <div className='strategem-rankings-item'>
                                <div className='strategem-rankings-number' style={{ color: "rgb(255,182,0)" }}>
                                    {getPercentage(data?.strategem?.length, data?.faction?.length, 1)}
                                </div>
                                <div className='strategem-rankings-text-wrapper'>
                                    <div className='strategem-rankings-text-small'>percent</div>
                                    <div className='strategem-rankings-text-small'>of matches</div>
                                </div>
                            </div>
                            <div className='strategem-rankings-item'>
                                <div className='strategem-rankings-number' style={{ color: getItemColor(itemId) }}>
                                    {itemsRankings?.percentageLoadouts}
                                </div>
                                <div className='strategem-rankings-text-wrapper'>
                                    <div className='strategem-rankings-text-small'>percent</div>
                                    <div className='strategem-rankings-text-small'>of loadouts</div>
                                </div>
                            </div>
                        </>}
                </div>
                {dataLoading ?
                    <div className="spinner-faction-container">
                        <div className="lds-dual-ring"></div>
                    </div> :
                    <div className='strategem-trends-container'>
                        <div className='strategem-trends-wrapper'>
                            {graphData2 &&
                                <div className='strategem-graph-wrapper-small'>
                                    <Bar style={{
                                        backgroundColor: '#181818',
                                    }}
                                        options={{ ...settings.stregemSmallOption }}
                                        width="100%"
                                        data={graphData2}
                                        redraw={false}
                                    /></div>
                            }
                        </div>
                        <div className='strategem-trends-wrapper'>

                            {graphData3 &&
                                <div className='strategem-graph-wrapper-small'>
                                    <Bar style={{
                                        backgroundColor: '#181818',
                                    }}
                                        options={{ ...settings.stregemSmallOption }}
                                        width="100%"
                                        data={graphData3}
                                        redraw={false}
                                    /></div>
                            }
                        </div>
                    </div>}
            </div>
            <div className='strategem-graphs-title'>Companion Picks</div>
            <div className='strategem-divier'></div>
            {dataLoading &&
                <div className="spinner-faction-container">
                    <div className="lds-dual-ring"></div>
                </div>
            }
            {data?.strategem && !dataLoading &&
                <div className='strategem-loadouts-wrapper'>
                    {itemCategories.map((category) =>
                        <div className='strategem-loadouts-section-wrapper'>
                            <div className='strategem-loadouts-title'>{category}</div>
                            <div class='table-loadout-wrapper'>
                                {Object.entries(getRankedDict(data?.strategem, category, itemId))
                                    .slice((category === getItemCategory(itemId)) ? 1 : 0, (category === getItemCategory(itemId)) ? 5 : 4).map((item) =>
                                        <OverlayTrigger
                                            overlay={(props) => (
                                                <Tooltip {...props}>
                                                    In {item[1].percentageLoadouts}%{item[1].percentageLoadouts === 100 ? "(duh)" : ""} of loadouts
                                                </Tooltip>
                                            )}
                                            placement="bottom">
                                            <img className='armory-img-wrapper'
                                                onClick={() => navigate(`/armory/${factionName}/${item[0]}`)}
                                                src={baseIconsSvg[baseLabels.indexOf(item[0])]}
                                                width={40} />
                                        </OverlayTrigger>

                                    )}
                            </div>
                        </div>
                    )}
                </div>
            }

            <div className='strategem-graphs-title'>Charts</div>
            <div className='strategem-divier'></div>
            <div className='strategem-graphs-wrapper'>
                {dataLoading &&
                    <div className="spinner-faction-container">
                        <div className="lds-dual-ring"></div>
                    </div>
                }
                {graphData && !dataLoading &&
                    <div className='strategem-graph-wrapper'>
                        <div className='strategem-graph-title'>Difficulty</div>
                        <Bar style={{
                            backgroundColor: '#181818',

                        }}
                            options={{ ...settings.optionsStrategem, indexAxis: width < 1200 ? 'y' : 'x' }}
                            width="100%"
                            data={graphData}
                            redraw={false}
                        /></div>
                }
                {graphData1 && !dataLoading &&
                    <div className='strategem-graph-wrapper'>
                        <div className='strategem-graph-title'>Mission Lenght</div>
                        <Bar style={{
                            backgroundColor: '#181818',
                        }}
                            options={{ ...settings.optionsStrategem, indexAxis: width < 1200 ? 'y' : 'x' }}
                            width="100%"
                            data={graphData1}
                            redraw={false}
                        /></div>
                }
            </div>
        </div>
    );
}

export default StrategemPage;
