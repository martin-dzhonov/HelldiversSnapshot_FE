
import '../styles/App.css';
import '../styles/SnapshotPage.css';
import "react-tabs/style/react-tabs.css";

import { useEffect, useMemo, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { apiBaseUrl, patchPeriods, strategems } from '../constants';
import { filterByPatch, getMissionsByLength, getItemDict, isFiniteNumber } from '../utils';
import * as chartsSettings from "../settings/chartSettings";
import GamesTable from '../components/GamesTable';
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import StrategemChart from '../components/StrategemChart';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

function SnapshotPage() {
    const { isMobile } = useMobile();
    const [loading, setLoading] = useState(true);
    const [showGraphFull, setShowGraphFull] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const [matchData, setMatchData] = useState(null);
    const [snapshotGraphData, setSnapshotGraphData] = useState(null);
    const [timelineGraphData, setTimelineGraphData] = useState(null);

    const [filters, setFilters] = useState({
        faction: "terminid",
        type: "All",
        difficulty: 0,
        mission: "All",
        patch: patchPeriods[0],
        patchStart: patchPeriods[1]
    });

    const [filterCount, setFilterCount] = useState({
        matchCount: 0,
        loadoutCount: 0
    });

    const fetchMatchData = async (url) => {
        const response = await fetch(`${apiBaseUrl}${url}`);
        const data = await response.json();
        setMatchData(data);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchMatchData(`/faction/all`);
    }, []);

    const dataFiltered = useMemo(() => {
        if (matchData && filters) {
            const filtered = matchData.filter((game) => {
                return (
                    game.faction === filters.faction &&
                    (filters.difficulty === 0 || game.difficulty === filters.difficulty) &&
                    filterByPatch(filters.patch, game) &&
                    getMissionsByLength(filters.mission).includes(game.mission)
                );
            });
            setFilterCount({
                matchCount: filtered.length,
                loadoutCount: filtered.reduce((sum, item) => sum + item.players.length, 0)
            });
            return filtered;
        }
    }, [matchData, filters]);

    useEffect(() => {
        if (dataFiltered) {
            let rankedDict = getItemDict(dataFiltered, filters.type);
            if (!showGraphFull) {
                rankedDict = Object.fromEntries(Object.entries(rankedDict).slice(0, 15))
            }
            setSnapshotGraphData(rankedDict);
        }
    }, [dataFiltered, filters, showGraphFull]);

    useEffect(() => {
        if (matchData && filters) {
            const patchesData = [filters.patch, filters.patchStart].map((patch) =>
                getItemDict(matchData
                    .filter((game) => game.faction === filters.faction)
                    .filter((game) => filterByPatch(patch, game)),
                    filters.type
                ))

            const itemValues = Object.keys(patchesData[0])
                .map((item) => {
                    const currValue = patchesData[0][item]?.value;
                    const pastValue = patchesData[1][item]?.value;
                    return {
                        name: item,
                        value: Number((currValue - pastValue).toFixed(1)),
                        currValue: currValue,
                        pastValue: pastValue,
                    }
                });

            const allFiltered = [...itemValues]
                .filter((item) => isFiniteNumber(item.value) && Math.abs(item.value) > 0.5)
                .sort((a, b) => { return a.value - b.value; });

            const up = allFiltered.filter((item) => item.value > 0).reverse();
            const down = allFiltered.filter((item) => item.value < 0);

            setTimelineGraphData({
                up: up.reduce((acc, item) => {
                    acc[item.name] = {
                        value: item.value,
                        currValue: item.currValue,
                        pastValue: item.pastValue,
                    };
                    return acc;
                }, {}),
                down: down.reduce((acc, item) => {
                    acc[item.name] = {
                        value: Math.abs(item.value),
                        currValue: item.currValue,
                        pastValue: item.pastValue,
                    };
                    return acc;
                }, {}),
            })
        }
    }, [matchData, filters]);

    return (
        <div className="content-wrapper">

            <Filters type={tabIndex} filters={filters} setFilters={setFilters} />
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className="tabs-container">
                    <TabList className="custom-tab-list">
                        <Tab>Snapshot</Tab>
                        <Tab onClick={() => { setFilters({ ...filters, patchStart: patchPeriods[1], patch: patchPeriods[0] }); }}>Trends</Tab>
                        <Tab>Games</Tab>
                    </TabList>
                    <div className="end-element">
                        <div className='text-small' style={{ fontSize: "17px" }}>
                            Matches: {filterCount.matchCount}
                            &nbsp;&nbsp;&nbsp;
                            Loadouts: {filterCount.loadoutCount}
                        </div>
                    </div>
                </div>
                <Loader loading={loading}>
                    <TabPanel>
                        {snapshotGraphData &&
                            <>
                                <StrategemChart barData={snapshotGraphData} filters={filters} options={chartsSettings.snapshotItems} />
                                <div
                                    className='text-small text-faction-show-all'
                                    onClick={() => setShowGraphFull(!showGraphFull)}>
                                    Show {showGraphFull ? "Less" : "All"}
                                </div>
                            </>}
                    </TabPanel>
                    <TabPanel>
                        {timelineGraphData &&
                            <div className='trends-container'>
                                <div className='row'>
                                    <div className='text-medium'>
                                        {filters.patchStart.id} ➜ {filters.patch.id}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-6">
                                        <div className='text-small trends-title-up'>
                                            Up
                                        </div>
                                        <StrategemChart barData={timelineGraphData?.up} filters={filters} options={chartsSettings.snapshotTrendsUp} />
                                    </div>
                                    <div className="col-6">
                                        <div className='text-small trends-title-down'>
                                            Down
                                        </div>
                                        <StrategemChart barData={timelineGraphData?.down} filters={filters} options={chartsSettings.snapshotTrendsDown} />

                                    </div>
                                </div>
                            </div>
                        }
                    </TabPanel>
                    <TabPanel>
                        {dataFiltered && (
                            <div className="show-games-table-wrapper">
                                <GamesTable data={dataFiltered} />
                            </div>
                        )}
                    </TabPanel>
                </Loader>
            </Tabs>
        </div>
    );
}

export default SnapshotPage;
