
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
    getFieldByFilters,
    getPatchDiffs,
    printDiffs,
    strategemsByCategory,
} from '../utils';
import { dataDummy } from '../dataDummy';

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

    const [filterResults, setFilterResults] = useState({ games: 0, loadouts: 0 });

    const fetchData = async (url) => {
        const fetchPromise = await fetch(`${apiBaseUrl}${url}`);
        const response = await fetchPromise.json();//dataDummy
        setData(response);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        //fetchData(`/report`);
        fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
    }, []);

    useEffect(() => {
        if (data && filters) {
            const factionData = data[filters.faction];
            const patchData = factionData[filters.patch.id];
            const graphData = strategemsByCategory(patchData, filters);
            setStrategemGraphData(graphData);
            if (patchData) {
                setFilterResults(getFieldByFilters(patchData, filters));
            }
        }
    }, [data, filters, tabIndex]);

    useEffect(() => {
        if (tabIndex === 1 && data && filters) {
            const factionData = data[filters.faction];
            const startPatchData = factionData[filters.patch.id];
            const endPatchData = factionData[filters.patchStart.id];
            const endPatch = strategemsByCategory(startPatchData, filters);
            const startPatch = strategemsByCategory(endPatchData, filters);
            const graphData = getPatchDiffs(startPatch, endPatch);

            setFilterResults({
                games: startPatchData.total.games + endPatchData.total.games,
                loadouts: startPatchData.total.loadouts + endPatchData.total.loadouts
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
                        Matches: {filterResults.games}
                        &nbsp;&nbsp;&nbsp;
                        Loadouts: {filterResults.loadouts}
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
                        <Tab >Games</Tab>
                    </TabList>

                    {!isMobile && !loading && <div className="end-element">
                        <div className='filters-result-text'>
                            Matches: {filterResults.games}
                            &nbsp;&nbsp;&nbsp;
                            Loadouts: {filterResults.loadouts}
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