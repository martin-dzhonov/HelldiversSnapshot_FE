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

    const [percentMatch, setPercentMatch] = useState(null);
    const [percentLoadout, setPercentLoadout] = useState(null);
    const [rankingAll, setRankingAll] = useState(null);
    const [rankingCategory, setRankingCategory] = useState(null);

    const sortDictArray = (a, b) => { return b[1] - a[1] };

    function getCountingSuffix(number) {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = number % 100;

        return (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    useEffect(() => {

        let metaDictObj = {};
        let itemDictObj = {};
        let matchDictDiffObj = {};
        let missionDictObj = {
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

                            const missionType = missionNames.slice(7, 11).includes(match.type) ? "Short" : "Long";

                            if(missionType === "Long"){
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

        setPercentMatch(Math.round((itemMatchCount / matchCount) * 100));
        setPercentLoadout(Math.round((itemLoadoutCount / loadoutCount) * 100));
        setRankingAll(allRanking + 1);
        setRankingCategory(categoryRanking + 1);


        const entriesMatchDiff = Object.entries(matchDictDiffObj);

        const asd = Object.entries(itemDictObj).map((item, index) => {
            const perc = Math.round((item[1] / entriesMatchDiff[index][1]) * 100);
            return perc;

        });


        let dataParse = {
            labels: ["7 - Suicide Mission", "8 - Impossible", "9 - Helldive"],
            datasets: [{
                data: Object.entries(itemDictObj).map((item, index) => {
                    const perc = Math.round((item[1] / entriesMatchDiff[index][1]) * 100);
                    return perc;

                }
                ),
                backgroundColor: graphColors[graphNames.indexOf(itemIdsType[itemId])],
                barThickness: 16,
            }],
        };
        setGraphData(dataParse);

    }, [itemId, terminidData]);


    const scales = {
        x: {
            ticks: {
                display: true,
                stepSize: 20,
            },
            grid: {
                drawBorder: false,
                color: '#aaa', // for the grid lines
                drawTicks: true, // true is default 
                drawOnChartArea: false // true is default 
            },
        },
        y: {
            ticks: {
                display: true,
                stepSize: 20,
                font: {
                    size: 12
                },
                color: 'white'
            },
            grid: {
                drawBorder: false,
                color: '#aaa', // for the grid lines
                drawTicks: false, // true is default 
                drawOnChartArea: true // true is default 
            },

            beginAtZero: true,
        },
    }

    return (
        <div className='content-wrapper'>
            <div className='item-details-title-wrapper'>
                <div className='item-details-img-wrapper'>
                    <img src={baseIconsSvg[itemIndex]}></img>
                </div>
                <div className='item-details-title-text'>{fullName}</div>
            </div>
            <div className='strategem-rankings-container'>
            <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{color: "rgb(255,182,0)"}}>{rankingAll}
                        <span className='strategem-rankings-number-small'>{getCountingSuffix(rankingAll)}</span>
                    </div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>in</div>
                        <div className='strategem-rankings-text-small'>All strategem</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{color: "rgb(255,182,0)"}}>{rankingCategory}
                        <span className='strategem-rankings-number-small'>{getCountingSuffix(rankingCategory)}</span>
                    </div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>in</div>
                        <div className='strategem-rankings-text-small'>{itemIdsType[itemId]}</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{color: "rgb(231, 76, 60)"}}>{percentMatch}</div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>percent</div>
                        <div className='strategem-rankings-text-small'>of matches</div>
                    </div>
                </div>
                <div className='strategem-rankings-item'>
                    <div className='strategem-rankings-number' style={{color: "rgb(231, 76, 60)"}}>{percentLoadout}</div>
                    <div className='strategem-rankings-text-wrapper'>
                        <div className='strategem-rankings-text-small'>percent</div>
                        <div className='strategem-rankings-text-small'>of loadouts</div>
                    </div>
                </div>
               
            </div>
            <div>
                <div className='strategem-graph-wrapper'>
                    <div className='strategem-graph-title'>In Percent of loadouts by difficulty</div>
                    {graphData &&
                        <div className='strategem-rankings-graph-wrapper'>
                            <Bar style={{
                                backgroundColor: 'black',

                            }}
                                options={{ ...settings.options, indexAxis: 'x', scales: scales }}
                                width="100%"
                                data={graphData}
                                redraw={true}
                            /></div>
                    }</div>
            </div>
        </div>
    );
}

export default StrategemPage;
