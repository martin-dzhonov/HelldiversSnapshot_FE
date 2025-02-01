
import '../styles/App.css';
import '../styles/SnapshotPage.css';
import "react-tabs/style/react-tabs.css";

import { useEffect, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl, patchPeriods } from '../constants';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import GamesTable from '../components/GamesTable';
import StrategemChart from '../components/StrategemChart';
import * as chartsSettings from "../settings/chartSettings";
import {
    getPatchDiffs,
    strategemsByCategory
} from '../utils';

function SnapshotPage() {
    const { isMobile } = useMobile()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snapshotGraphData, setSnapshotGraphData] = useState(null);
    const [graphFull, setGraphFull] = useState(false);
    const [timelineGraphData, setTimelineGraphData] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const [filters, setFilters] = useState({
        faction: "terminid",
        category: "All",
        difficulty: 0,
        mission: "All",
        patch: patchPeriods[0],
        patchStart: patchPeriods[1]
    });
    const [filterResults, setFilterResults] = useState({
        matchCount: 0,
        loadoutCount: 0
    });

    const fetchData = async (url) => {
        const fetchPromise = await fetch(`${apiBaseUrl}${url}`);
        const response = await fetchPromise.json();
        setData(response);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchData(`/strategem/filter?diff=${filters.difficulty}&?mission=${filters.mission}`);
    }, [filters.difficulty, filters.mission]);

    useEffect(() => {
        if (tabIndex === 0 && data && filters) {
            const factionData = data[filters.faction];
            const patchData = factionData[filters.patch.id];
            const graphData = strategemsByCategory(patchData, filters.category, graphFull);

            setFilterResults({
                matchCount: patchData.totalGames,
                loadoutCount: patchData.totalLoadouts
            });

            setSnapshotGraphData(graphData);
        }
    }, [data, filters, graphFull, tabIndex]);

    useEffect(() => {
        if (tabIndex === 1 && data && filters) {
            const factionData = data[filters.faction];
            const startPatchData = factionData[filters.patch.id];
            const endPatchData = factionData[filters.patchStart.id];

            setFilterResults({
                matchCount: startPatchData.totalGames + endPatchData.totalGames,
                loadoutCount: endPatchData.totalLoadouts + endPatchData.totalLoadouts
            });

            const endPatch = strategemsByCategory(startPatchData, filters.category, true);
            const startPatch = strategemsByCategory(endPatchData, filters.category, true);
            const graphData = getPatchDiffs(startPatch, endPatch);
            setTimelineGraphData(graphData);
        }
    }, [data, filters, tabIndex]);

    return (
        <div className="content-wrapper">
            <Filters type={tabIndex} filters={filters} setFilters={setFilters} />

            {isMobile && !loading && <div className="end-element">
                <div className='filters-result-text'>
                    Matches: {filterResults.matchCount}
                    &nbsp;&nbsp;&nbsp;
                    Loadouts: {filterResults.loadoutCount}
                </div>
            </div>}
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className="tabs-container">
                    <TabList className="custom-tab-list">
                        <Tab>Snapshot</Tab>
                        <Tab
                            disabled={filters.faction === "illuminate"}
                            onClick={() => { setFilters({ ...filters, patchStart: patchPeriods[1], patch: patchPeriods[0] }); }}>
                            Trends
                        </Tab>
                        <Tab>Games</Tab>
                    </TabList>

                    {!isMobile && !loading && <div className="end-element">
                        <div className='filters-result-text'>
                            Matches: {filterResults.matchCount}
                            &nbsp;&nbsp;&nbsp;
                            Loadouts: {filterResults.loadoutCount}
                        </div>
                    </div>}
                </div>

                <Loader loading={loading}>
                    <TabPanel>
                        {snapshotGraphData &&
                            <>
                                <StrategemChart
                                    barData={snapshotGraphData}
                                    filters={filters}
                                    options={chartsSettings.snapshotItems} />
                                <div
                                    className='text-small text-faction-show-all'
                                    onClick={() => setGraphFull(!graphFull)}>
                                    Show {graphFull ? "Less" : "All"}
                                </div>
                            </>}
                    </TabPanel>
                    <TabPanel>
                        {timelineGraphData &&
                            <div className='trends-container'>
                                <div className='row'>
                                    <div className='text-medium trends-title-patches'>
                                        {filters.patchStart.name} ➜ {filters.patch.name}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-lg-6 col-md-12">
                                        <div className='text-small trends-title-up'>
                                            Up
                                        </div>
                                        <StrategemChart
                                            barData={timelineGraphData?.up}
                                            filters={filters}
                                            options={chartsSettings.snapshotTrendsUp} />
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className='text-small trends-title-down'>
                                            Down
                                        </div>
                                        <StrategemChart
                                            barData={timelineGraphData?.down}
                                            filters={filters}
                                            options={chartsSettings.snapshotTrendsDown} />

                                    </div>
                                </div>
                            </div>
                        }
                    </TabPanel>
                    <TabPanel>
                        {/* {dataFiltered && (
                            <div className="show-games-table-wrapper">
                                <GamesTable data={dataFiltered} />
                            </div>
                        )} */}
                    </TabPanel>
                </Loader>
            </Tabs>
        </div>
    );
}

export default SnapshotPage;

// const fetchMatchData = async (url) => {
//     const fetchPromise = await fetch(`${apiBaseUrl}${url}`);
//     const data1 = await fetchPromise.json();

//     setMatchData(data1);
//     setLoading(false);
// };

// useEffect(() => {
//     setLoading(true);
//     fetchMatchData(`/faction/all`);
// }, []);

// const dataFiltered = useMemo(() => {
//     if (matchData && filters) {
//         const filtered = matchData.filter((game) => {f
//             return (
//                 game.faction === filters.faction &&
//                 (filters.difficulty === 0 || game.difficulty === filters.difficulty) &&
//                 filterByPatch(filters.patch, game) &&
//                 getMissionsByLength(filters.mission).includes(game.mission)
//             );
//         });
//         setFilterCount({
//             matchCount: filtered.length,
//             loadoutCount: filtered.reduce((sum, item) => sum + item.players.length, 0)
//         });
//         return filtered;
//     }
// }, [matchData, filters]);

// useEffect(() => {
//     if (dataFiltered) {
//         let rankedDict = getItemDict(dataFiltered, filters.category);
//         if (!showGraphFull) {
//             rankedDict = Object.fromEntries(Object.entries(rankedDict).slice(0, 15))
//         }
//         console.log(rankedDict);
//         setSnapshotGraphData(rankedDict);
//     }
// }, [dataFiltered, filters, showGraphFull]);

// useEffect(() => {
//     if (matchData && filters) {
//         const patchesData = [filters.patch, filters.patchStart].map((patch) =>
//             getItemDict(matchData
//                 .filter((game) => game.faction === filters.faction)
//                 .filter((game) => filterByPatch(patch, game)),
//                 filters.category
//             ))

//         const itemValues = Object.keys(patchesData[0])
//             .map((item) => {
//                 const currValue = patchesData[0][item]?.value;
//                 const pastValue = patchesData[1][item]?.value;
//                 return {
//                     name: item,
//                     value: Number((currValue - pastValue).toFixed(1)),
//                     currValue: currValue,
//                     pastValue: pastValue,
//                 }
//             });

//         const allFiltered = [...itemValues]
//             .filter((item) => isFiniteNumber(item.value) && Math.abs(item.value) > 0.5)
//             .sort((a, b) => { return a.value - b.value; });

//         const up = allFiltered.filter((item) => item.value > 0).reverse();
//         const down = allFiltered.filter((item) => item.value < 0);

//         setTimelineGraphData({
//             up: up.reduce((acc, item) => {
//                 acc[item.name] = {
//                     value: item.value,
//                     currValue: item.currValue,
//                     pastValue: item.pastValue,
//                 };
//                 return acc;
//             }, {}),
//             down: down.reduce((acc, item) => {
//                 acc[item.name] = {
//                     value: Math.abs(item.value),
//                     currValue: item.currValue,
//                     pastValue: item.pastValue,
//                 };
//                 return acc;
//             }, {}),
//         })
//     }
// }, [matchData, filters]);