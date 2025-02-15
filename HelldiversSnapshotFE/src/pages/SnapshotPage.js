
import '../styles/App.css';
import '../styles/SnapshotPage.css';
import "react-tabs/style/react-tabs.css";

import { useEffect, useState } from 'react'
import { useMobile } from '../hooks/useMobile';
import { isDev, apiBaseUrl, patchPeriods } from '../constants';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import GamesTable from '../components/GamesTable';
import StrategemChart from '../components/StrategemChart';
import * as chartsSettings from "../settings/chartSettings";
import {
    getPatchDiffs,
    printDiffs,
    strategemsByCategory
} from '../utils';

function SnapshotPage() {
    const { isMobile } = useMobile()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
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
        if (filters.difficulty !== 0 || filters.mission !== "All") {
            setLoading(true);
            fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
        }

    }, [filters.difficulty, filters.mission]);

    useEffect(() => {
        setLoading(true);
        fetchData(`/strategem`);
    }, []);

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
                loadoutCount: startPatchData.totalLoadouts + endPatchData.totalLoadouts
            });

            const endPatch = strategemsByCategory(startPatchData, filters.category, true);
            const startPatch = strategemsByCategory(endPatchData, filters.category, true);
            const graphData = getPatchDiffs(startPatch, endPatch);
            if (isDev) {
                printDiffs(startPatch, endPatch)
            }
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
                                    options={chartsSettings.snapshotItems}
                                />
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
                                            options={chartsSettings.snapshotTrendsUp}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className='text-small trends-title-down'>
                                            Down
                                        </div>
                                        <StrategemChart
                                            barData={timelineGraphData?.down}
                                            filters={filters}
                                            options={chartsSettings.snapshotTrendsDown}
                                        />
                                    </div>
                                </div>
                                {/* <div className='row'>
                                    <div className="col-lg-12 col-md-12">
                                        <div className='text-small trends-title-up'>
                                            Up
                                        </div>
                                        {timelineGraphData?.up && <MultiLineChart
                                            data={timelineGraphData?.up}
                                            filters={filters}
                                            options={chartsSettings.trends}
                                            type={1} />}
                                    </div>
                                </div> */}
                            </div>
                        }
                    </TabPanel>
                    <TabPanel>
                        <div className="show-games-table-wrapper">
                            <GamesTable filters={filters} />
                        </div>
                    </TabPanel>
                </Loader>
            </Tabs>
        </div>
    );
}

export default SnapshotPage;