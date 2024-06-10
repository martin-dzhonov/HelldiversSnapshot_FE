import './App.css';
import { useEffect, useState, useMemo } from 'react'
import { baseLabels, baseIconsSvg, missionNames, apiBaseUrl } from './constants';
import { getItemName, getItemColor, getCountingSuffix, getItemCategory, getPercentage, getRankedDict, getMissionLenght } from './utils';

import { useParams } from 'react-router-dom';
import { terminidData } from './data/terminid';
import * as settings from "./settings/chartSettings";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function StrategemPage() {
    let { itemId: itemName } = useParams();

    const [factionName, setFactionName] = useState('terminid')
    const [strategemData, setStrategemData] = useState(null)
    const [factionData, setFactionData] = useState(null)

    const [graphData, setGraphData] = useState(null);
    const [graphData1, setGraphData1] = useState(null);

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
        fetch(apiBaseUrl + `/faction/${factionName}`)
            .then(response => response.json())
            .then(data => setFactionData(data));

        fetch(apiBaseUrl + `/games/${factionName}/${itemName}`)
            .then(response => response.json())
            .then(data => setStrategemData(data));
    }, [factionName])

    const itemsRankings = useMemo(() => {
        if (itemName && factionData) {
            const factionDict = getRankedDict(factionData);
            return factionDict[itemName];
        }
    }, [itemName, factionData]);

    useEffect(() => {

        if (factionData && strategemData) {
            const loadoutsByDiff = {7: 0, 8: 0, 9: 0};
            const itemLoadoutsByDiff = Object.assign({}, loadoutsByDiff);
            const loadoutsByMission = {"Short": 0, "Long": 0};
            const itemLoadoutsByMission = Object.assign({}, loadoutsByMission);

            factionData.forEach((game) => {
                game.players.forEach((loadout) => {
                    loadoutsByDiff[game.difficulty]++;
                    loadoutsByMission[getMissionLenght(game.missionName)]++;
                })
            });

            strategemData.forEach((game) => {
                itemLoadoutsByDiff[game.difficulty]++;
                itemLoadoutsByMission[getMissionLenght(game.missionName)]++;
            })

            let dataParse = {
                labels: width > 1200 ? ["7 - Suicide Mission", "8 - Impossible", "9 - Helldive"] : ["7", "8", "9"],
                datasets: [{
                    data: Object.keys(loadoutsByDiff).map((diff, index) => {
                        return getPercentage(itemLoadoutsByDiff[diff], loadoutsByDiff[diff])
                    }),
                    backgroundColor: getItemColor(itemName),
                    barThickness: 24,
                }],
            };


            let dataParse1 = {
                labels: ["Short", "Long"],
                datasets: [{
                    data: Object.keys(loadoutsByMission).map((name, index) => {
                        return getPercentage(itemLoadoutsByMission[name], loadoutsByMission[name])
                    }),
                    backgroundColor: getItemColor(itemName),
                    barThickness: 24,
                }],
            };
            setGraphData(dataParse);
            setGraphData1(dataParse1);

        }
    }, [factionData, strategemData]);

    return (
        <div className='content-wrapper'>
            <div className='item-details-title-wrapper'>
                <div className='flex-row'>
                    <div className='item-details-img-wrapper'><img src={baseIconsSvg[baseLabels.indexOf(itemName)]}></img></div>
                    <div className='item-details-title-text'>{getItemName(itemName, "long")}</div>
                </div>
                {width > 1200 &&
                    <div className='flex-row' style={{ marginRight: "120px" }}>
                        <div className='item-details-tab-active'
                        onClick={()=>{setFactionName('terminid')}}>Terminid</div>
                        <div className='item-details-tab'
                        onClick={()=>{setFactionName('automaton')}}>Automaton</div>
                    </div>}
            </div>
            <div className='strategem-rankings-container'>
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
                    <div className='strategem-rankings-number' style={{ color: getItemColor(itemName) }}>{itemsRankings?.rankCategory}
                        <span className='strategem-rankings-number-small'>{getCountingSuffix(itemsRankings?.rankCategory)}</span>
                    </div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>in</div>
                        <div className='strategem-rankings-text-small'>{getItemCategory(itemName)}</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{ color: "rgb(255,182,0)" }}>{getPercentage(strategemData?.length, terminidData.length)}</div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>percent</div>
                        <div className='strategem-rankings-text-small'>of matches</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{ color: getItemColor(itemName) }}>{itemsRankings?.percentageLoadouts}</div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>percent</div>
                        <div className='strategem-rankings-text-small'>of loadouts</div>
                    </div>
                </div>

            </div>
            <div className='strategem-divier'></div>
            <div className='strategem-graphs-title'>In percent of loadouts by</div>
            <div className='strategem-graphs-wrapper'>
                {graphData &&
                    <div className='strategem-graph-wrapper'>
                        <div className='strategem-graph-title'>Difficulty</div>
                        <Bar style={{
                            backgroundColor: '#181818',

                        }}
                            options={{ ...settings.optionsStrategem, indexAxis: width < 1200 ? 'y' : 'x' }}
                            width="100%"
                            data={graphData}
                            redraw={true}
                        /></div>
                }
                {graphData1 &&
                    <div className='strategem-graph-wrapper'>
                        <div className='strategem-graph-title'>Mission Lenght</div>
                        <Bar style={{
                            backgroundColor: '#181818',
                        }}
                            options={{ ...settings.optionsStrategem, indexAxis: width < 1200 ? 'y' : 'x' }}
                            width="100%"
                            data={graphData1}
                            redraw={true}
                        /></div>
                }
            </div>
        </div>
    );
}

export default StrategemPage;
