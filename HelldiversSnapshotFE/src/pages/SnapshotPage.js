
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
import StrategemChart from '../components/charts/StrategemChart';
import * as chartsSettings from "../settings/chartSettings";
import {
    getPatchDiffs,
    printDiffs,
    strategemsByCategory,
} from '../utils';

function SnapshotPage() {
    const { isMobile } = useMobile()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [strategemGraphData, setStrategemGraphData] = useState(null);
    const [timelineGraphData, setTimelineGraphData] = useState(null);

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
        if (filters.difficulty || filters.mission) {
            setLoading(true);
            fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
        }
    }, [filters.difficulty, filters.mission]);

    useEffect(() => {
        if ((tabIndex === 0 || tabIndex === 2) && data && filters) {
            const factionData = data[filters.faction];
            const patchData = factionData[filters.patch.id];
            setStrategemGraphData(strategemsByCategory(patchData, filters.category));
            if (patchData) {
                setFilterResults({
                    matchCount: patchData.totalGames,
                    loadoutCount: patchData.totalLoadouts
                });
            }
        }
    }, [data, filters, tabIndex]);

    useEffect(() => {
        if (tabIndex === 1 && data && filters) {
            const factionData = data[filters.faction];
            const startPatchData = factionData[filters.patch.id];
            const endPatchData = factionData[filters.patchStart.id];
            const endPatch = strategemsByCategory(startPatchData, filters.category, true);
            const startPatch = strategemsByCategory(endPatchData, filters.category, true);
            const graphData = getPatchDiffs(startPatch, endPatch);

            setFilterResults({
                matchCount: startPatchData.totalGames + endPatchData.totalGames,
                loadoutCount: startPatchData.totalLoadouts + endPatchData.totalLoadouts
            });
            setTimelineGraphData(graphData);
            if (isDev) {
                printDiffs(startPatch, endPatch)
            }
        }
    }, [data, filters, tabIndex]);

    return (
        <div className="content-wrapper">
            <Filters tab={tabIndex} filters={filters} type={0} setFilters={setFilters} />
            {isMobile && !loading &&
                <div className="end-element">
                    <div className='filters-result-text'>
                        Matches: {filterResults.matchCount}
                        &nbsp;&nbsp;&nbsp;
                        Loadouts: {filterResults.loadoutCount}
                    </div>
                </div>
            }
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className="tabs-container">
                    <TabList className="custom-tab-list">
                        <Tab>Snapshot</Tab>
                        <Tab
                            onClick={() => {
                                setFilters({
                                    ...filters,
                                    patchStart: patchPeriods[1],
                                    patch: patchPeriods[0]
                                });
                            }}>
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
                        {strategemGraphData &&
                            <StrategemChart
                                barData={strategemGraphData}
                                filters={filters}
                                options={chartsSettings.snapshotItems}
                                expandable
                            />
                        }
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
        </div >
    );
}

export default SnapshotPage;

/* <div className='row'>
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
                                </div>  */