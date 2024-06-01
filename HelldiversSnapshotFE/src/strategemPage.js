import './App.css';
import { useEffect, useRef, useState } from 'react'
import { baseLabels, baseIconsSvg, graphColors, graphNames, itemTypesIndexes, itemIdsType, missionNames, baseLabelsFull2 } from './baseAssets';
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
    let { itemId } = useParams();
    const itemIndex = baseLabels.indexOf(itemId);
    const fullName = baseLabelsFull2[itemIndex];

    const [graphData, setGraphData] = useState(null);
    const [graphData1, setGraphData1] = useState(null);

    const [percentMatch, setPercentMatch] = useState(null);
    const [percentLoadout, setPercentLoadout] = useState(null);
    const [rankingAll, setRankingAll] = useState(null);
    const [rankingCategory, setRankingCategory] = useState(null);

    const categoryColor = graphColors[graphNames.indexOf(itemIdsType[itemId])];

    const sortDictArray = (a, b) => { return b[1] - a[1] };

    function getCountingSuffix(number) {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = number % 100;

        return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
    
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

        let metaDictObj = {};
        let itemDictObj = {};
        let matchDictDiffObj = {};
        let missionDictObj = {
            "Short": 0,
            "Long": 0
        }
        let missionDictObjAll = {
            "Short": 0,
            "Long": 0
        }

        let matchCount = 0;
        let loadoutCount = 0;

        let itemMatchCount = 0;
        let itemLoadoutCount = 0;

        let allRanking = -1;
        let categoryRanking = -1;

        if (terminidData && itemId) {
            terminidData.forEach((match) => {
                const players = match.players;
                const missionType = missionNames.slice(7, 11).includes(match.type) ? "Short" : "Long";

             

                matchCount++;
                let itemFound = false;


                players.forEach((playerItems) => {
                    let hasItems = false;

                    playerItems.forEach((itemName) => {
                        if (itemName !== "") {
                            hasItems = true;
                        }
                        if (itemName === itemId) {
                            if (itemDictObj[match.difficulty]) {
                                itemDictObj[match.difficulty] += 1;
                            } else {
                                itemDictObj[match.difficulty] = 1;
                            }
                            if (missionType === "Long") {
                                missionDictObj["Long"]++;
                            } else {
                                missionDictObj["Short"]++;
                            }
                        }

                        if (metaDictObj[itemName]) {
                            metaDictObj[itemName] += 1;
                        } else {
                            metaDictObj[itemName] = 1;
                        }
                        if (itemName === itemId) {
                            itemLoadoutCount++;
                            itemFound = true;
                        }
                    })

                    if (hasItems) {
                        loadoutCount++;
                        if (matchDictDiffObj[match.difficulty]) {
                            matchDictDiffObj[match.difficulty] += 1;
                        } else {
                            matchDictDiffObj[match.difficulty] = 1;
                        }

                        if (missionDictObjAll[missionType]) {
                            missionDictObjAll[missionType] += 1;
                        } else {
                            missionDictObjAll[missionType] = 1;
                        }
                    }
                })
                if (itemFound) { itemMatchCount++; }
            })
        }


        let dataSorted = Object.entries(metaDictObj)
            .filter((item) => baseLabels.slice(0, 49).includes(item[0]))
            .sort(sortDictArray);

        dataSorted.forEach((item, index) => {
            if (item[0] === itemId) {
                allRanking = index;
            }
        });

        const sliceIndexes = itemTypesIndexes[graphNames.indexOf(itemIdsType[itemId])];

        let categorySorted = Object.entries(metaDictObj)
            .filter((item) => baseLabels.slice(sliceIndexes[0], sliceIndexes[1]).includes(item[0]))
            .sort(sortDictArray);

        categorySorted.forEach((item, index) => {
            if (item[0] === itemId) {
                categoryRanking = index;
            }
        });

        const matchPercFull = (itemMatchCount / matchCount) * 100;
        const loadoutPercFull = (itemLoadoutCount / loadoutCount) * 100;


        setPercentMatch(matchPercFull > 1 ? Math.round(matchPercFull) : matchPercFull.toFixed(1));
        setPercentLoadout(loadoutPercFull > 1 ? Math.round(loadoutPercFull) : loadoutPercFull.toFixed(1));
        setRankingAll(allRanking + 1);
        setRankingCategory(categoryRanking + 1);

        const entriesMatchDiff = Object.entries(matchDictDiffObj);

        let dataParse = {
            labels: width > 1200 ? ["7 - Suicide Mission", "8 - Impossible", "9 - Helldive"] : ["7", "8", "9"],
            datasets: [{
                data: Object.entries(itemDictObj).map((item, index) => {
                    const perc = (item[1] / entriesMatchDiff[index][1]) * 100;
                    return perc.toFixed(1);

                }
                ),
                backgroundColor: graphColors[graphNames.indexOf(itemIdsType[itemId])],
                barThickness: 24,
            }],
        };


        let dataParse1 = {
            labels: ["Short", "Long"],
            datasets: [{
                data: [
                    ((missionDictObj["Short"] / missionDictObjAll["Short"]) * 100).toFixed(1),
                    ((missionDictObj["Long"] / missionDictObjAll["Long"]) * 100).toFixed(1)
                ],
                backgroundColor: graphColors[graphNames.indexOf(itemIdsType[itemId])],
                barThickness: 22,
            }],
        };
        setGraphData(dataParse);
        setGraphData1(dataParse1);


    }, [itemId, terminidData]);

  

    return (
        <div className='content-wrapper'>
            <div className='item-details-title-wrapper'>
                <div className='flex-row'>
                <div className='item-details-img-wrapper'><img src={baseIconsSvg[itemIndex]}></img></div>
                <div className='item-details-title-text'>{fullName}</div>
                </div>
                {width > 1200 &&
                <div className='flex-row' style={{marginRight: "120px"}}>
                <div className='item-details-tab-active'>Terminid</div>
                <div className='item-details-tab'>Automaton</div>
                </div>  }
            </div>
            <div className='strategem-rankings-container'>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{ color: "rgb(255,182,0)" }}>{rankingAll}
                        <span className='strategem-rankings-number-small'>{getCountingSuffix(rankingAll)}</span>
                    </div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>in</div>
                        <div className='strategem-rankings-text-small'>All Strategem</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{color: categoryColor}}>{rankingCategory}
                        <span className='strategem-rankings-number-small'>{getCountingSuffix(rankingCategory)}</span>
                    </div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>in</div>
                        <div className='strategem-rankings-text-small'>{itemIdsType[itemId]}</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{ color: "rgb(255,182,0)" }}>{percentMatch}</div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>percent</div>
                        <div className='strategem-rankings-text-small'>of matches</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{color: categoryColor}}>{percentLoadout}</div>
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
                            backgroundColor: 'black',

                        }}
                            options={{...settings.optionsStrategem, indexAxis: width < 1200 ? 'y' : 'x'}}
                            width="100%"
                            data={graphData}
                            redraw={true}
                        /></div>
                }
                {graphData1 &&
                    <div className='strategem-graph-wrapper'>
                        <div className='strategem-graph-title'>Mission Lenght</div>
                        <Bar style={{
                            backgroundColor: 'black',
                        }}
                        options={{...settings.optionsStrategem, indexAxis: width < 1200 ? 'y' : 'x'}}
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
