
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
    getFiltersCount,
    getPatchDelta,
    itemsByCategory,
} from '../utils';
import { dataDummy } from '../dataDummy';
import ChartLegend from '../components/ChartLegend';

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
        // const fetchPromise = await fetch(`${apiBaseUrl}${url}`);
        //const response = await fetchPromise.json();//dataDummy
        setData(dataDummy);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchData(`/strategem?diff=${filters.difficulty}&mission=${filters.mission}`);
    }, []);

    useEffect(() => {
        if (data && filters) {
            const factionData = data[filters.faction];
            const endPatch = itemsByCategory(factionData[filters.patch.id], filters, 'strategems')
            const startPatch = itemsByCategory(factionData[filters.patch.id + 1], filters, 'strategems')
            const graphData = getPatchDelta(startPatch, endPatch);

            setStrategemGraphData(graphData);
            setFilterResults(getFieldByFilters(factionData[filters.patch.id], filters))
        }
    }, [data, filters, tabIndex]);

    return (
        <div className="content-wrapper">
            <Filters tab={tabIndex} filters={filters} type={0} setFilters={setFilters} />
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className="tabs-container">
                    <TabList className="custom-tab-list">
                        <Tab>Snapshot</Tab>
                        <Tab>Games</Tab>
                    </TabList>
                    {tabIndex === 0 && <ChartLegend patchId={filters.patch.id + 1}/>}
                    {!loading && <div className="end-element">
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
                                options={chartsSettings.snapshotStrategem}
                                limit={10}
                                type='strategem'
                                showTrends={filters.patch.name !== 'Classic'}
                            />
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